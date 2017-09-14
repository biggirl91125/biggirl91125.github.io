/**
 * Created by chaowang211311 on 2017/9/11.
 */
if(window.vuejs === undefined)window.vuejs={};
(function(){
    if(vuejs.Directives === undefined){
        var Directives={
            text:function(node,vm,exp){
                this.bind(node,vm,exp,'text');
            },
            html:function(node,vm,exp){
                this.bind(node,vm,exp,'html');
            },
            model:function(node,vm,exp){
                this.bind(node,vm,exp,'model');

                var self=this,
                    val=this._getVMVal(vm,exp);
                widgets.Events.addHandler(node,'input',function(ev){
                    var newValue=ev.target.value;
                    if(newValue === val){
                        return;
                    }
                    self._setVMVal(vm,exp,newValue);
                    val=newValue;

                });
            },
            class:function(node,vm,exp){
                this.bind(node,vm,exp,'class');
            },
            eventOn:function(node,vm,exp,dir){
                var eventType=dir.split(":")[1],
                    eventHandler=vm.options.methods && vm.options.methods[exp];
                if(eventType && eventHandler)
                    widgets.Events.addHandler(node,eventType,eventHandler);
            },
            /**
             * 绑定包含两步操作:
             * 1、更新当前dom
             * 2、监听后续变化
             */
            bind:function(node,vm,exp,dir){
                var updater=this.updater[dir];
                updater && updater(node,this._getVMVal(vm,exp));

                new vuejs.Watcher(vm,exp,function(value,oldValue){
                    updater && updater(node,value,oldValue);
                });
            },

            /**
             *  获取vm对象中的真实值
             *  vm:vm obj
             *  exp:表达式
             */
            _getVMVal:function(vm,exp){
                var val=vm,
                    exp=exp.split('.');
                exp.forEach(function(key){
                    val=val[key];
                });

                return val;
            },
            _setVMVal:function(vm,exp,value){
                var val=vm,
                    exp=exp.split('.');
                exp.forEach(function(key,index){
                    if(index<exp.length-1){
                        val=val[key];
                    }else{//最后key,更新val值
                        val[key]=value;
                    }
                });
            },
            updater:{
                text:function(node,val){
                    node.textContent=typeof val == 'undefined'?'':val;
                },
                html:function(node,val){
                    node.innerHTML=typeof val == 'undefined'?'':val;
                },
                class:function(node,val,oldVal){

                },
                model:function(node,val){
                    node.value=typeof val == 'undefined'?'':val;
                }

            }

        };
        vuejs.Directives=Directives;
    }
})();