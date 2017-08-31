/**
 * Created by chaowang211311 on 2017/8/31.
 */
// View.js

(function() {
    View = function(gl, idVertexShader, idFragmentShader) {
        if(gl == undefined) return;

        this.gl = gl;
        this.model = null;
        this.shader = new bongiovi.GLModelShader(gl, idVertexShader, idFragmentShader);

        this._init();

    }


    var p = View.prototype;


    p._init = function() {

    }


    p.render = function(camera, projection) {

    }

})();