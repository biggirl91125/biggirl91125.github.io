/**
 * Created by chaowang211311 on 2017/8/31.
 */
// SoundMixer.js

(function(){
    SoundMixer = function() {
        this.ctx = null;
        this._isSoundLoaded = false;
        this.loader = null;
    }


    var p = SoundMixer.prototype;

    p.init = function() {
        try {
            this.ctx = new webkitAudioContext();
        } catch (e) {
            console.log( "Can't create Web Audio" );
            return this;
        }

        console.log( this.ctx );
        this._loadSounds();
        return this;
    }


    p._loadSounds = function() {
        var sources = ['sounds/wind.mp3'];
        var that = this;
        this.loader = new BufferLoader(this.ctx, sources, function(e){ that._onLoaded(e);	});
        this.loader.load();
    }

    p._onLoaded = function(buffers) {
        this._isSoundLoaded = true;
        console.log( "Sound Loaded : " + buffers );
        this.ctx.buffers = buffers;
        this.sources = new Array(1);
        this.gains = new Array(1);

        var targetStart = this.ctx.currentTime + 0.1;
        for (var i = 0, length = this.ctx.buffers.length; i < length; i++) {
            this.playSound(i, targetStart);
        }
    }

    p.playSound = function(index, targetTime) {
        var buffer = this.ctx.buffers[index];
        var source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        var gainNode = this.ctx.createGainNode();
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        this.sources[index] = source;
        this.gains[index] = gainNode;
        source.noteOn(targetTime);

        this.gains[0].gain.value = 0.1;
    }


    p.updateSound = function(gain) {
        if(!this.gains) return;
        this.gains[0].gain.value = gain;
    }

})();