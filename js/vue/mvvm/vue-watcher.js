/**
 * Created by chaowang211311 on 2017/9/12.
 */
if(window.vuejs === undefined)window.vuejs={};
/**
 * 订阅者
 */
(function(){
    if(vuejs.Watcher === undefined){
        var Watcher=function(vm,expOrFn,cb){
            this.vm=vm;
            this.cb=cb;
            this.depIds={};
            if(typeof expOrFn === 'function'){
                this.getter=expOrFn;
            }else{
                this.getter=this.parseExpression(expOrFn);
            }
            this.value=this.get();

        };
        Watcher.prototype={
            get:function(){
                Depend.target=this;
                var value=this.getter.call(this.vm,this.vm);
                Depend.target=null;

                return value;
            },
            update:function(){
                var value=this.get(),
                    oldVal=this.value;
                if(value!== oldVal){
                    this.value=value;
                    this.cb.call(this.vm,value,oldVal);
                }
            },
            parseExpression:function(exp){
                if(/[^\w.$]/.test(exp))
                    return;
                var exps=exp.split(".");

                return function(obj){
                    for(var i=0,len=exps.length;i<len;i++){
                        if(!obj)return;
                        obj=obj[exps[i]];
                    }

                    return obj;
                };
            },
            //添加新依赖
            addDepend:function(dep){
                if(!this.depIds.hasOwnProperty(dep.id)){
                    dep.addSub(this);
                    this.depIds[dep.id]=dep;
                }
            }

        };
        vuejs.Watcher=Watcher;
    }
})();