/**
 * Created by chaowang211311 on 2017/10/16.
 */
function createXHR(){
    if(typeof XMLHttpRequest != 'undefined'){
        return new XMLHttpRequest();
    }else if(typeof ActiveXObject != 'undefined'){//IE7及之前
        if(typeof arguments.callee.activeXString != 'string'){
            var versions=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
            for(var i=0,len=versions.length;i<len;i++){
                try{
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString=versions[i];
                    break;
                }catch(ex){

                }
            }
        }

        return new ActiveXObject(arguments.callee.activeXString);
    }else{
        throw new Error('No XHR object available.');
    }
}
//获取响应头部信息
//xhr.getResponseHeader
//xhr.getAllResponseHeaders
function ajax(){
    var xhr=createXHR();
    xhr.onreadystatechange=function(){
        console.log(this);
        if(xhr.readyState == 4){
            if((xhr.status >= 200 && xhr.status <300)|| xhr.status ==304){
                console.log(xhr.responseText);
            }else{
                console.log(xhr.status);
            }
        }

    };
    xhr.open('get','example.txt',true);
    //可以在这里设置头部信息
    //xhr相关的头部字段：
    //      accept
    //      accept-charset
    //      accept-encoding
    //      accept-language
    //      connection
    //      cookie
    //      host
    //      referer
    xhr.setRequestHeader('myHeader','123');
    xhr.send(null);
}