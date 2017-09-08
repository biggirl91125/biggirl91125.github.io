/**
 * Created by chaowang211311 on 2017/8/31.
 */
function PxLoader(a){a=a||{};if(a.statusInterval==null){a.statusInterval=5e3}if(a.loggingDelay==null){a.loggingDelay=20*1e3}if(a.noProgressTimeout==null){a.noProgressTimeout=Infinity}var b=[],c=[],d,e=+(new Date);var f={QUEUED:0,WAITING:1,LOADED:2,ERROR:3,TIMEOUT:4};var g=function(a){if(a==null){return[]}if(Array.isArray(a)){return a}return[a]};this.add=function(a){a.tags=new PxLoaderTags(a.tags);if(a.priority==null){a.priority=Infinity}b.push({resource:a,status:f.QUEUED})};this.addProgressListener=function(a,b){c.push({callback:a,tags:new PxLoaderTags(b)})};this.addCompletionListener=function(a,b){c.push({tags:new PxLoaderTags(b),callback:function(b){if(b.completedCount===b.totalCount){a()}}})};var h=function(a){a=g(a);var b=function(b){var c=b.resource,d=Infinity;for(var e=0;e<c.tags.length;e++){for(var f=0;f<Math.min(a.length,d);f++){if(c.tags[e]==a[f]&&f<d){d=f;if(d===0)break}if(d===0)break}}return d};return function(a,c){var d=b(a),e=b(c);if(d<e)return-1;if(d>e)return 1;if(a.priority<c.priority)return-1;if(a.priority>c.priority)return 1;return 0}};this.start=function(a){d=+(new Date);var c=h(a);b.sort(c);for(var e=0,g=b.length;e<g;e++){var j=b[e];j.status=f.WAITING;j.resource.start(this)}setTimeout(i,100)};var i=function(){var c=false,d=+(new Date)-e,g=d>=a.noProgressTimeout,h=d>=a.loggingDelay;for(var j=0,k=b.length;j<k;j++){var m=b[j];if(m.status!==f.WAITING){continue}if(m.resource.checkStatus){m.resource.checkStatus()}if(m.status===f.WAITING){if(g){m.resource.onTimeout()}else{c=true}}}if(h&&c){l()}if(c){setTimeout(i,a.statusInterval)}};this.isBusy=function(){for(var a=0,c=b.length;a<c;a++){if(b[a].status===f.QUEUED||b[a].status===f.WAITING){return true}}return false};var j=function(a,d){var g=null;for(var h=0,i=b.length;h<i;h++){if(b[h].resource===a){g=b[h];break}}if(g==null||g.status!==f.WAITING){return}g.status=d;e=+(new Date);var j=a.tags.length;for(var h=0,l=c.length;h<l;h++){var m=c[h],n;if(m.tags.length===0){n=true}else{n=a.tags.contains(m.tags)}if(n){k(g,m)}}};this.onLoad=function(a){j(a,f.LOADED)};this.onError=function(a){j(a,f.ERROR)};this.onTimeout=function(a){j(a,f.TIMEOUT)};var k=function(a,c){var d=0,e=0;for(var g=0,h=b.length;g<h;g++){var i=b[g],j=false;if(c.tags.length===0){j=true}else{j=i.resource.tags.contains(c.tags)}if(j){e++;if(i.status===f.LOADED||i.status===f.ERROR||i.status===f.TIMEOUT){d++}}}c.callback({resource:a.resource,loaded:a.status===f.LOADED,error:a.status===f.ERROR,timeout:a.status===f.TIMEOUT,completedCount:d,totalCount:e})};var l=this.log=function(a){if(!window.console){return}var c=Math.round((+(new Date)-d)/1e3);window.console.log("PxLoader elapsed: "+c+" sec");for(var e=0,g=b.length;e<g;e++){var h=b[e];if(!a&&h.status!==f.WAITING){continue}var i="PxLoader: #"+e+" "+h.resource.getName();switch(h.status){case f.QUEUED:i+=" (Not Started)";break;case f.WAITING:i+=" (Waiting)";break;case f.LOADED:i+=" (Loaded)";break;case f.ERROR:i+=" (Error)";break;case f.TIMEOUT:i+=" (Timeout)";break}if(h.resource.tags.length>0){i+=" Tags: ["+h.resource.tags.join(",")+"]"}window.console.log(i)}}}function PxLoaderTags(a){this.array=[];this.object={};this.value=null;this.length=0;if(a!==null&&a!==undefined){if(Array.isArray(a)){this.array=a}else if(typeof a==="object"){for(var b in a){this.array.push(b)}}else{this.array.push(a);this.value=a}this.length=this.array.length;for(var c=0;c<this.length;c++){this.object[this.array[c]]=true}}this.contains=function(a){if(this.length===0||a.length===0){return false}else if(this.length===1&&this.value!==null){if(a.length===1){return this.value===a.value}else{return a.object.hasOwnProperty(this.value)}}else if(a.length<this.length){return a.contains(this)}else{for(var b in this.object){if(a.object[b]){return true}}return false}}}if(!Array.isArray){Array.isArray=function(a){return Object.prototype.toString.call(a)=="[object Array]"}}
function PxLoaderImage(a,b,c){function g(a,b,c){var f,g,h,i,d=this,e=null;this.img=new Image,this.tags=b,this.priority=c,f=function(){"complete"==d.img.readyState&&(i(),e.onLoad(d))},g=function(){i(),e.onLoad(d)},h=function(){i(),e.onError(d)},i=function(){d.unbind("load",g),d.unbind("readystatechange",f),d.unbind("error",h)},this.start=function(b){e=b,d.bind("load",g),d.bind("readystatechange",f),d.bind("error",h),d.img.src=a},this.checkStatus=function(){d.img.complete&&(i(),e.onLoad(d))},this.onTimeout=function(){i(),d.img.complete?e.onLoad(d):e.onTimeout(d)},this.getName=function(){return a},this.bind=function(a,b){d.img.addEventListener?d.img.addEventListener(a,b,!1):d.img.attachEvent&&d.img.attachEvent("on"+a,b)},this.unbind=function(a,b){d.img.removeEventListener?d.img.removeEventListener(a,b,!1):d.img.detachEvent&&d.img.detachEvent("on"+a,b)}}var f,h,i,j,d=this,e=null;this.img=new Image,this.tags=b,this.priority=c,f=function(){"complete"==d.img.readyState&&(j(),e.onLoad(d))},PxLoader.prototype.addImage=function(a,b,c){var d=new g(a,b,c);return this.add(d),d.img},h=function(){j(),e.onLoad(d)},i=function(){j(),e.onError(d)},j=function(){d.unbind("load",h),d.unbind("readystatechange",f),d.unbind("error",i)},this.start=function(b){e=b,d.bind("load",h),d.bind("readystatechange",f),d.bind("error",i),d.img.src=a},this.checkStatus=function(){d.img.complete&&(j(),e.onLoad(d))},this.onTimeout=function(){j(),d.img.complete?e.onLoad(d):e.onTimeout(d)},this.getName=function(){return a},this.bind=function(a,b){d.img.addEventListener?d.img.addEventListener(a,b,!1):d.img.attachEvent&&d.img.attachEvent("on"+a,b)},this.unbind=function(a,b){d.img.removeEventListener?d.img.removeEventListener(a,b,!1):d.img.detachEvent&&d.img.detachEvent("on"+a,b)}}PxLoader.prototype.addImage=function(a,b,c){var d=new PxLoaderImage(a,b,c);return this.add(d),d.img};
WebGLUtils=function(){var a=function(a){return'<table style="background-color: #8CE; width: 100%; height: 100%;"><tr><td align="center"><div style="display: table-cell; vertical-align: middle;"><div style="">'+a+"</div>"+"</div>"+"</td></tr></table>"},b='This page requires a browser that supports WebGL.<br/><a href="http://get.webgl.org">Click here to upgrade your browser.</a>',c='It doesn\'t appear your computer can support WebGL.<br/><a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>',d=function(d,f,g){function h(e){var g,f=d.parentNode;f&&(g=window.WebGLRenderingContext?c:b,e&&(g+="<br/><br/>Status: "+e),f.innerHTML=a(g))}g=g||h,d.addEventListener&&d.addEventListener("webglcontextcreationerror",function(a){g(a.statusMessage)},!1);var i=e(d,f);return i||window.WebGLRenderingContext||g(""),i},e=function(a,b){var e,c=["webgl","experimental-webgl","webkit-3d","moz-webgl"],d=null;for(e=0;e<c.length;++e){try{d=a.getContext(c[e],b)}catch(f){}if(d)break}return d};return{create3DContext:e,setupWebGL:d}}(),window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}();