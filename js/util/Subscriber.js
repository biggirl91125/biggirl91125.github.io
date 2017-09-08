/**
 * Created by chaowang211311 on 2017/9/7.
 */
/**
 * 数据绑定
 * 使用 发布-订阅者模式 实现数据绑定
 * 原生
 */
if(window.widgets === undefined)window.widgets={};
(function(){
    if(widgets.PubSubBinder === undefined){
        var PubSubBinder=function(){
            this._cbs={};

        };
        widgets.PubSubBinder=PubSubBinder;
        var p=PubSubBinder.prototype;

        p.subscribe=function(msg,cb){
            this._cbs[msg]=this._cbs[msg]||[];
            this._cbs[msg].push(cb);
        };
        p.publish=function(msg){
            this._cbs[msg]=this._cbs[msg]||[];
            for(var i=0,len=this._cbs[msg].length;i<len;i++){
                this._cbs[msg][i].apply(this,arguments);
            }
        };
        p.changeHandler=function(ev){
            var target=ev.target||ev.srcElement,
                property=target.getAttribute();

            if(property&&property !== ""){
                this.publish(message,property,target.value);
            }

        };
        p.bind=function(id,dir){
            var _el=document.getElementById(id);
        };
    }
    var init=function(){
        var mb=new PubSubBinder();
    };
})();