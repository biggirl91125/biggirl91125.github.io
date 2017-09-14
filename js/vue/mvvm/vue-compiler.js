/**
 * Created by chaowang211311 on 2017/9/11.
 */
/**
 * 模板编译
 */
if(window.vuejs === undefined)window.vuejs={};
(function(){
    if(vuejs.Compiler === undefined){
        var Compiler=function(el,vm){
            this._vm=vm;
            this._el=this.isElementNode(el)?el:document.querySelector(el);
            if(this._el)this.init();
        };
        Compiler.prototype={
            init:function(){
                var frag=this.node2Fragment(this._el);
                this.compile(frag);
            },
            compile:function(frag){
                var  self=this;
                var childNodes=frag.childNodes;
                //[].slice交给childNodes使用
                [].slice.call(childNodes).forEach(function(node){
                    var txt=node.textContent,
                        reg=/\{\{(.*)}}/g;//???
                    if(self.isElementNode(node)){
                        self.compileElNode(node);
                    }else if(self.isTextNode(node) && reg.test(txt)){//{{解析文本变量}}
                        self.compileTxtNode(node,RegExp.$1.trim());
                    }

                    //递归遍历子节点
                    if(node.childNodes && node.childNodes.length){
                        self.compile(node);
                    }
                });

            },
            //编译元素节点
            compileElNode:function(node){
                var self=this;
                var attrs=node.attributes;
                [].slice.call(attrs).forEach(function(attr){
                    var attrName=attr.name;
                    if(self.isDirective(attrName)){
                        var exp=attr.value,
                            dir=attrName.substring(2);//substring(start[,stop]),包含start
                        if(self.isEventDirective(dir)){
                            vuejs.Directives.eventOn(node,self._vm,exp,dir);
                        }else{
                            vuejs.Directives[dir]&&vuejs.Directives[dir](node,self._vm,exp);
                        }
                        //去掉dom中包含v指令属性
                        node.removeAttribute(attrName);
                    }
                });
            },
            //编译文本节点
            compileTxtNode:function(node,exp){
                vuejs.Directives.text(node,this._vm,exp);
            },
            node2Fragment:function(el){
                var fragment=document.createDocumentFragment(),child;
                while(child=el.firstChild){
                    fragment.appendChild(child);
                }
                return fragment;
            },
            isElementNode:function(node){
                return node.nodeType==1;
            },
            isDirective:function(attr){
                return attr.indexOf("v-") === 0;
            },
            isEventDirective:function(dir){
                return dir.indexOf("on") === 0;
            },
            isTextNode:function(node){
                return node.nodeType==3;
            }
        };
        vuejs.Compiler=Compiler;
    }
})();