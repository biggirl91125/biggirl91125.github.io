/**
 * Created by chaowang211311 on 2017/8/29.
 */
var EventUtil={
    //存在的问题：1)IE中的作用域问题，this指向window
    //2)DOM0只支持一个事件处理程序
    addHandler:function(el,type,handler){
        if(el.addEventListener){
            el.addEventListener(type,handler,false);
        }else if(el.attachEvent){
            el.attachEvent('on'+type,handler);
        }else{
            el['on'+type]=handler;
        }
    },
    removeHandler:function(el,type,handler){
        if(el.removeEventListener){
            el.removeEventListener(type,handler);
        }else if(el.attachEvent){
            el.attachEvent('on'+type,handler);
        }else{
            el['on'+type]=null;
        }
    },
    getEvent:function(event){
        return event?event:window.event;
    },
    getTarget:function(event){
        return event.target||event.srcElement;
    },
    preventDefault:function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    stopPropagation:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{//IE只能阻止事件冒泡
            event.cancelBubble=true;
        }
    }
};