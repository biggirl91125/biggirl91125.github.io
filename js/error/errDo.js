/**
 * Created by chaowang211311 on 2017/9/30.
 */
//错误和调试方法

/**
 * 错误日志
 * @param sev 严重程度数值
 * @param msg 错误信息
 * 好处：
 * 1)所有浏览器都支持Image对象
 * 2)避免跨域限制
 * 3)输出到服务器
 */
function logError(sev,msg){
    var img=new Image();
    img.src='log.php?sev='+encodeURIComponent(sev)+'&msg='+encodeURIComponent(msg);
}

//是不是早就弃用了？？
//输出到控制台或页面自建区域
function logConsole(msg){
    if(typeof console == 'object'){
        console.log(msg);
    }else if(typeof opera == 'object'){
        opera.postError(msg);
    }else if(typeof java == 'object' && typeof java.lang == 'object'){
        java.lang.System.out.println(msg);
    }else{
        var console=document.getElementById("debugInfo");
        if(console == null){
            console=document.createElement('div');
            console.id='debugInfo';
            console.style.background='#dedede';
            console.style.border='1px solid silver';
            console.style.padding='5px';
            console.style.position='absolute';
            console.style.right='0px';
            console.style.top='0px';
            document.appendChild(console);
        }
        console.innerHTML+='<p>'+message+'</p>';
    }
}
/**
 *
 * @param condition if的条件语句
 * @param message
 */
function assert(condition,message){
    if(!condition){
        throw new Error(message);
    }
}
function init(mods){
    for(var i=0;i<mods.length;i++){
        try{
            mods[i].init();
        }catch(err){
            //打印错误日志
            logError('fatal','Module init failed:'+err.message);
        }

    }
}