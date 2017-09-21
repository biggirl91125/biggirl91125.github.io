/**
 * Created by chaowang211311 on 2017/9/20.
 */
function scrollListener(){
    var scrollTop;
    if(document.compatMode == "CSS1Compat"){//标准模式
        scrollTop=document.documentElement.scrollTop;
    }else{//混杂模式 & safari
        scrollTop=document.body.scrollTop;
    }
}