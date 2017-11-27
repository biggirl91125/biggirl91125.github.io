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
    //超时设置
    xhr.timeout=1000;
    xhr.ontimeout=function(){};
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
    xhr.overrideMimeType('text/xml');

    xhr.send(null);
}
//url后添加查询字段
function addURLParam(url,name,value){
    url+= (url.indexOf('?') == -1?'?':'&');
    url+=encodeURIComponent(name)+'='+encodeURIComponent(value);
    return url;
}
//进度条事件，IE8+只支持load事件
function progress(){
    var xhr=createXHR();
    xhr.onload=function(event){
        if((xhr.status >= 200&&xhr.status<300)||xhr.status==304){
            console.log(xhr.responseText);
        }else{
            console.log('Request was successful:'+xhr.status);
        }
    };

    xhr.onprogress=function(event){
        var divStatus=document.getElementById('status');
        if(event.lengthComputable){
            divStatus.innerHTML='Received '+event.position+' of '+event.totalSize +'bytes.'
        }
    };

    xhr.open('get','dd.php',true);
    xhr.send(null);
}


//IE对CORS的实现——XDR
function xdr_ie_cors(){
    var xdr=new XDomainRequest();
    xdr.onload=function(){
        console.log(xdr.responseText);
    };
    xdr.error=function(){
        console.log('An error occurred.');
    };
    xdr.timeout=1000;
    xdr.ontimeout=function(){
        console.log('Request took too long.');
    };

    xdr.open('get','http://somewhere.com');

    //post请求时，配合contentType属性使用
    //xdr.contentType='application/x-www-form-urlencoded';

    xdr.send(null);
}
//其他浏览器对CORS的实现——XHR+绝对url
function xhr_others_cors(){
    ajax_cors();
}

//不能使用setRequestHeader设置自定义头部
//getAllResponseHeaders()返回空字符串
function ajax_cors(){
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
    //超时设置
    xhr.timeout=1000;
    xhr.ontimeout=function(){};
    xhr.open('get','example.txt',true);//本地资源：相对url，远程资源：绝对url
    //不可以setRequestHeader设置头部信息

    xhr.send(null);

}


/**
 * 跨浏览器的CORS
 */
function createCORSRequest(method,url){
    var xhr=new XMLHttpRequest();
    if('withCredentials' in xhr){//Chrome/FF/Safari
        xhr.open(method,url,true);
    }else if(typeof XDomainRequest != 'undefined'){
        xhr=new XDomainRequest();
        xhr.open(method,url);//xdr只能异步
    }else{
        xhr=null;
    }

    return xhr;
}
/**
 * 其他跨域技术
 */
//get && 无法访问服务器响应文本
function pingImage(){
    var img=new Image();
    img.onload=img.onerror=function(){
        console.log('done');
    };
    img.src='';//ping地址url
}


