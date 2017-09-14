/**
 * Created by chaowang211311 on 2017/9/13.
 */
/**
 * Dependency依赖
 * @constructor
 * 功能：收集依赖(订阅者)
 */
var uid=0;
function Depend(){
    this.id=uid++;
    this.subs=[];
}
//全局唯一
Depend.target=null;
//sub为watcher类型
Depend.prototype={
    addSub:function(sub){
        this.subs.push(sub);
    },
    removeSub:function(sub){
        var index=this.subs.indexOf(sub);
        if(index>-1){
            this.subs.splice(index,1);
        }
    },
    //为什么所有的sub都要更新一遍
    notify:function(){
        this.subs.forEach(function(sub){
            sub.update();
        });
    },
    depend:function(){
        Depend.target.addDepend(this);
    }
};

