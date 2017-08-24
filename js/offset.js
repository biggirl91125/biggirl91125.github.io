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
//文档总高度、总宽度
function getDocSize(){
    var sH=document.documentElement.scrollHeight||document.body.scrollHeight,
        sW=document.documentElement.scrollWidth||document.body.scrollWidth;
    var cH=document.documentElement.clientHeight||document.body.clientHeight,
        cW=document.documentElement.clientWidth||document.body.clientWidth;
    var docH=Math.max(sH,cH),
        docW=Math.max(sW,cW);
    return {
        width:docW,
        height:docH
    };
}

//回滚到顶部
function scrollToTop(element){
    if(element.scrollTop!=0){
        element.scrollTop=0;
    }
}

// 获取元素在视口中的位置
// 支持getBoundingClientRect()的浏览器
function getBoundingClientRect_in(element){
    if(typeof arguments.callee.offset!='number'){
        //arguments.callee不能在严格模式下使用
        //arguments是个很大的对象，每次调用时需重新创建，影响浏览器性能和闭包
        var scrollTop=document.documentElement.scrollTop;
        var temp=document.createElement("div");
        temp.style.cssText="position:absolute;left:0;top:0;";
        document.body.appendChild(temp);

        console.log(temp.getBoundingClientRect());
        arguments.callee.offset=-temp.getBoundingClientRect().top-scrollTop;
        document.body.removeChild(temp);
        temp=null;
    }

    var rect=element.getBoundingClientRect();
    var offset=arguments.callee.offset;

    return {
        left:rect.left+offset,
        right:rect.right+offset,
        top:rect.top+offset,
        bottom:rect.bottom+offset
    };
}
// 获取元素在视口中的位置
// 不支持getBoundingClientRect()的浏览器
function getBoundingClientRect_out(element){
    var scrollTop=document.documentElement.scrollTop;
    var scrollLeft=document.documentElement.scrollLeft;
    var actualTop=getElementTop(element);
    var actualLeft=getElementLeft(element);

    return {
        left:actualLeft-scrollLeft,
        right:actualLeft+element.offsetWidth-scrollLeft,
        top:actualTop-scrollTop,
        bottom:actualTop+element.offsetHeight-scrollTop
    };
}

//跨浏览器的getBoundingClientRect()
function getBoundingClientRect_crossBrowser(element){
    if(element.getBoundingClientRect){
        getBoundingClientRect_in(element);
    }else{
        getBoundingClientRect_out(element);
    }
}

//dom2遍历/范围能力检测
function traversal(){
    var supportsTraversals=document.implementation.hasFeature("Traversal","2.0");
    var supportsNodeIterator=typeof document.createNodeIterator == "function";
    var supportsTreeWalker=typeof document.createTreeWalker == "function";

    var supportsRange=typeof document.createRange == "function";
}