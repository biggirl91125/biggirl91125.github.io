/**
 * Created by chaowang211311 on 2017/11/17.
 */
//检查数据类型
function checkDataType(data){
    return {
        isFunction:Object.prototype.toString.call(data) == 'object Function',
        isArray:Object.prototype.toString.call(data) == 'object Array',
        isRegExp:Object.prototype.toString.call(data) == 'object RegExp',
        isNativeJSON:Object.prototype.toString.call(data) == 'object JSON'
    };
}
/**
 * 作用域安全的构造函数，避免全局污染
 * 构造函数窃取+原型链
 **/
function Polygon(sides){
    if(this instanceof Polygon){
        this.sides=sides;
        this.getArea=function(){
            return 0;
        };
    }else{
        return new Polygon(sides);
    }
}

function Rectangle(width,height){
    Polygon.call(this,2);
    this.width=width;
    this.height=height;
    this.getArea=function(){
        return this.width*this.height;
    };
}

Rectangle.prototype=new Polygon();//形成继承关系


/**
 * 惰性载入函数
 * 优化if语句多的情况
 */
function createXHR(){
    if(typeof XMLHttpRequest != 'undefined'){
        createXHR=function(){
            return new XMLHttpRequest();
        };
    }
}


function bind(fn,context){
    return function(){
        return fn.apply(context,arguments);
    };
}


