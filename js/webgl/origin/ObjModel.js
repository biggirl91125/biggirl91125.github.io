/**
 * Created by chaowang211311 on 2017/8/31.
 */
// ObjModel.js

if(window.bongiovi === undefined ) window.bongiovi = {};

(function() {
    if( bongiovi.ObjModel === undefined) {
        ObjModel = function(gl, path) {
            if(gl == undefined) return;
            this.gl = gl;
            this._path = path;
            this._req = new XMLHttpRequest();

            this._vertices = [];
            this._uvs = [];
            this._indices = [];
            this._normals = [];
            this._attributes = [];
            this._attrBuffers = [];
            this._textures = [];

            this._init();
        }

        bongiovi.ObjModel = ObjModel;
        var p = ObjModel.prototype;


        p._init = function() {
            var req = new XMLHttpRequest();
            req.open("GET", this._path, false);
            req.send();

            var ary = req.responseText.split("\n");

            var vertices = [];
            var indices = [];
            var uvs = [];
            var normals = [];

            for ( var i =0; i<ary.length; i++) {
                var tmp = ary[i].split(" ");
                var type = tmp[0];

                if(type == 'v') {
                    vertices.push( Number(tmp[1]) );
                    vertices.push( -Number(tmp[2]) );
                    vertices.push( Number(tmp[3]) );
                } else if( type == 'vt') {
                    uvs.push( tmp[1] );
                    uvs.push( tmp[2] );
                } else if ( type == 'f') {
                    var f = tmp[1].split("/").concat(tmp[2].split("/")).concat(tmp[3].split("/"));
                    indices.push( [tmp[1], tmp[2], tmp[3]] );
                } else if ( type == 'vn') {
                    normals.push( Number(tmp[1]) );
                    normals.push( Number(tmp[2]) );
                    normals.push( Number(tmp[3]) );
                }

            }

            var totalVertices = (vertices.length/3);
            for ( var i=0; i<indices.length; i++) {
                for ( var j=0; j<indices[i].length; j++) {
                    var o = indices[i][j];
                    var tmp = o.split("/");
                    this._indices.push( Number(tmp[0])-1 );
                    this._uvs.push( uvs[ Number(tmp[1])-1 ] );
                    this._normals.push( normals[ Number(tmp[2])-1 ] );
                }
            }

            this._vertices = vertices;
            this._generateBuffer();
        }


        p._generateBuffer = function() {
            this.vBufferPos = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferPos);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._vertices), this.gl.STATIC_DRAW);
            this.vBufferPos.itemSize = 3;
            // this.vBufferPos.numItems = this._numVertex;

            this.vBufferUV = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferUV);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._uvs), this.gl.STATIC_DRAW);
            this.vBufferUV.itemSize = 2;
            // this.vBufferUV.numItems = this._numVertex;

            this.iBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), this.gl.STATIC_DRAW);
            this.iBuffer.itemSize = 1;
            this.iBuffer.numItems = this._indices.length;
        }


        p.setTexture = function(index, text) {
            this._textures[index] = text;
        }


        p.render = function(shader, mvMatrix, pMatrix, output) {
            if(output != undefined) {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, output.frameBuffer);
                this.gl.viewport(0, 0, output.frameBuffer.width, output.frameBuffer.height);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            }

            var shaderProgram = shader.shaderProgram;
            this.gl.useProgram(shaderProgram);

            this.attachAttributes(shaderProgram);
            this.setupUniforms(shader, shaderProgram, mvMatrix, pMatrix);
            this.bindBuffers(shaderProgram);
            this.bindTextures(shaderProgram);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
            this.gl.drawElements(this.gl.TRIANGLES, this.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

            if(output != undefined) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, output.texture);
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);

                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            }
        }


        p.bindTextures = function(shaderProgram) {
            for ( var i=0 ; i<this._textures.length; i++) {
                this.gl.activeTexture(this.gl["TEXTURE"+i.toString()]);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this._textures[i].texture);
                this.gl.uniform1i(shaderProgram.samplerUniform, i);
            }
        }


        p.bindBuffers = function(shaderProgram) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferPos);
            this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vBufferPos.itemSize, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferUV);
            this.gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vBufferUV.itemSize, this.gl.FLOAT, false, 0, 0);

            for( var i=0; i<this._attributes.length; i++) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._attributes[i].buffer);
                this.gl.vertexAttribPointer(shaderProgram[this._attributes[i].name], this._attributes[i].size, this.gl.FLOAT, false, 0, 0);
            }
        }


        p.setupUniforms = function(shader, shaderProgram, mvMatrix, pMatrix) {
            for ( var i=0; i<this._textures.length; i++) {
                shaderProgram.samplerUniform = this.gl.getUniformLocation(shaderProgram, "uSampler" + i.toString());
            }

            for ( var i=0; i<shader.parameters.length; i++) {
                var o = shader.parameters[i];
                if(o.type.indexOf("Matrix") == -1) this.gl[o.type](shaderProgram[o.name], o.value);
                else {
                    this.gl.uniformMatrix3fv(shaderProgram[o.name], false, o.value);
                }
            }

            this.gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
            this.gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix );
        }


        p.attachAttributes = function(shaderProgram) {
            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

            shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

            for( var i=0; i<this._attributes.length; i++) {
                shaderProgram[this._attributes[i].name] = gl.getAttribLocation(shaderProgram, this._attributes[i].name);
                gl.enableVertexAttribArray(shaderProgram[this._attributes[i].name]);
            }


            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        }


        var isArray = function(someVar) {
            if( Object.prototype.toString.call( someVar ) === '[object Array]' ) return true;
            else return false;
        }
    }

})();