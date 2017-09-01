/**
 * Created by chaowang211311 on 2017/8/31.
 */
// Index.js

(function() {
    var MAX = 1000;


    Index = function(gl) {
        if(gl == undefined) return;
        this.gl = gl;
        this.bg = null;
        this.particle = null;
        this.textureBg = null;
        this.textureParticle = null;

        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.viewParticles = null;
        // this.gl.disable(this)
        //var that = this
        //window.addEventListener("resize", function(e) {that._onResize(e);	}	);
    }

    var p = Index.prototype;

    p.init = function() {
        var that = this;
        this.loader = new PxLoader();
        //this.bg = this.loader.addImage("/img/webgl/giantBG.jpg");
        this.particle = this.loader.addImage("/img/webgl/flower.png");
        //this.sun = this.loader.addImage("/img/webgl/sun.png");
        this.tree = this.loader.addImage("/img/webgl/wood.jpg");
        //this.ground = this.loader.addImage("/img/webgl/ground.jpg");
        this.loader.addCompletionListener(function(){ that._onImageLoaded()} );
        this.loader.start();

        return this;
    }


    p._onResize = function(e) {
        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    }


    p._onImageLoaded = function() {
        //this.textureBg = new GLTexture(this.gl, this.bg);
        this.textureParticle = new GLTexture(this.gl, this.particle);
        //this.textureSun = new GLTexture(this.gl, this.sun);
        this.textureTree = new GLTexture(this.gl, this.tree);
        //this.textureGround = new GLTexture(this.gl, this.ground);

        this.projection = new bongiovi.ProjectionPerspectiveMatrix();
        this.projection.perspective(45, W/H, .1, 10000);
        this.camera = new bongiovi.HoverCamera().init(3500);

        //this.viewBg = new ViewBg(this.gl, "shader-vs-bg", "shader-fs", this.textureBg);
        this.viewParticles = new ViewParticles(this.gl, "shader-vs-particle", "shader-fs-particle", this.textureParticle);
        //this.viewSun = new ViewSun(this.gl, "shader-vs-bg", "shader-fs", this.textureSun);
        this.viewTree = new ViewTree(this.gl, "shader-vs", "shader-fs", this.textureTree);
        //this.viewGround = new ViewGround(this.gl, "shader-vs-ground", "shader-fs-ground", this.textureGround);


        scheduler.addEF(this, this._loop, []);
    }


    p._loop = function() {
        var cameraRange = .3;
        if(this.camera.rx > cameraRange) this.camera.rx = cameraRange;
        else if ( this.camera.rx < -cameraRange) this.camera.rx = -cameraRange;

        var mtx = this.camera.update();

        this.gl.disable(this.gl.DEPTH_TEST);
        //this.viewBg.render();
        //this.viewSun.render();

        this.gl.enable(this.gl.DEPTH_TEST);
        this.viewTree.render(mtx, this.projection.matrix);
        //this.viewGround.render(mtx, this.projection.matrix);

        this.gl.disable(this.gl.DEPTH_TEST);
        this.viewParticles.camera = this.camera;
        this.viewParticles.render(this.projection.matrix);
    }
})();