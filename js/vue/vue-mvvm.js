/**
 * Created by chaowang211311 on 2017/9/12.
 */
if(window.vuejs === undefined)window.vuejs={};
(function(){
    /**
     * 双向绑定类
     */
    if(vuejs.MVVM === undefined){
        var MVVM = function(options){
            this.options = options || {};
            this._data = this.options.data;
            //this.observe(this._data);
            new vuejs.Compiler(options.el || document.body,this);
        };

        MVVM.protype={
            observe:function(data,vm){
                if(!data || typeof data !== 'object')
                    return;

                return new vuejs.Observer(data);
            },
            watch:function(expOrFn,cb){
                new vuejs.Watcher(this,expOrFn,cb);
            },
            //数据模型代理
            _proxy:function(key){
                Object.defineProperty(this,key,{
                    configurable:true,
                    enumerable:true,
                    get:function(){
                        return this._data[key];
                    },
                    set:function(val){
                        this._data[key]=val;
                    }
                });
            }
        };
        vuejs.MVVM = MVVM;
    }
})();