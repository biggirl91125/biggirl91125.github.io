/**
 * Created by chaowang211311 on 2017/9/11.
 */
if(window.vuejs === undefined)window.vuejs={};
/**
 * 监听器(观察者)
 * 功能：监听数据变化&通知订阅者
 */

//import Depend.js
(function(){
    if(vuejs.Observer === undefined){
        var Observer=function(data){
            this.data=data;
            this.dep=new Depend();
            this.walk(data);
        };
        Observer.prototype={
            walk:function(data){
                var self=this;
                //Object.keys(obj),顺序返回对象的keys
                Object.keys(data).forEach(function(key){
                    self.convert(key,data[key]);
                });

            },
            convert:function(key,val){
                this.defineReactive(this.data,key,val);
            },
            //将data对象的每个属性赋予getter/setter方法，以便追踪变化
            defineReactive:function(data,key,val){
                //获取key的描述对象
                var property=Object.getOwnPropertyDescriptor(data,key);
                if(property && property.configurable === false)
                    return;

                var getter=property && property.get,
                    setter=property && property.set;

                //???
                var dep=new Depend();
                var childOb=observe(val);

                Object.defineProperty(data,key,{
                    enumerable:true,
                    configurable:true,
                    get:function reactiveGetter(){
                        //如果有预先定义的getter则执行预先定义的getter获取值
                        var value=getter?getter.call(data):val;
                        if(Depend.target){
                            dep.depend();
                            if(childOb)childOb.dep.depend();
                        }
                        return value;
                    },
                    set:function reactiveSetter(newVal){
                        var value=getter?getter.call(data):val;
                        if(newVal === value)return;

                        if(setter)setter.call(data,newVal);
                        else{
                            val=newVal;
                        }

                        childOb=observe(newVal);
                        dep.notify();//通知更新
                    }
                });


            }

        };
        vuejs.Observer=Observer;
    }
})();