/**
 * Created by chaowang211311 on 2017/8/21.
 */
function getElementLeft(element){
    var actualLeft=element.offsetLeft;
    var current=element.offsetParent;
    while(current!=null){
        actualLeft+=current.offsetLeft;
        current=current.offsetParent;
    }

    return actualLeft;
}
function getElementTop(element){
    var actualTop=element.offsetTop;
    var current=element.offsetParent;
    while(current!=null){
        actualTop+=current.offsetTop;
        current=current.offsetParent;
    }

    return actualTop;
}
//浏览器视口大小
function getViewport(){
    if(document.compatMode == 'BackCompat'){//混杂模式
        return {
            width:document.body.clientWidth,
            height:document.body.clientHeight
        };
    }else{
        return {
            width:document.documentElement.clientWidth,
            height:document.documentElement.clientHeight
        };

    }
}