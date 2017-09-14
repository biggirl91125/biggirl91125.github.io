/**
 * Created by chaowang211311 on 2017/9/14.
 */
(function(){

    // 注册组件
    const Home={template:'<div>Welcome home!</div>'};
    const About={template:'<div>About page!</div>'};
    const routes=[
        {path:'/',component:Home},
        {path:'/about',component:About}
    ];
    const router=new VueRouter({
        mode:'history',
        routes:routes
    });
    // 创建根实例
    const app=new Vue({
        el: '#vue-demo',
        router:router,
        data:{
            currentRoute:window.location.pathname,
            activeClass:'active'
        },
        methods:{
            init:function(){
                window.addEventListener('popstate',function(){
                    this.currentRoute=window.location.pathname;
                });
            },
            isActive:function(){

            },
            go:function(ev){
                console.log("h5 go");
                ev.preventDefault();
                this.$root.currentRoute=this.href;
                window.history && window.history.pushState
                && window.history.pushState(null,null,this.href);

            }
        }
    });
    app.init();
})();