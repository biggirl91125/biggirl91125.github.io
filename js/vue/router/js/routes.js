/**
 * Created by chaowang211311 on 2017/9/14.
 */
(function(){

    // 注册组件
    const NotFound={template:'<div>404 Not Found!</div>'};
    const Home={template:'<div>Welcome home!</div>'};
    const About={template:'<div>About page!</div>'};
    const routes=[
        {path:'*',component:NotFound},
        {path:'/',component:Home},
        {path:'/about',component:About}
    ];
    const router=new VueRouter({
        mode:'history',//h5 history模式，path更简洁美观
        routes:routes
    });
    // 创建根实例
    const app=new Vue({
        el: '#vue-demo',
        router:router,
        data:{
            currentRoute:window.location.pathname,
            href:'/'
        },
        computed:{
            isActive:function(){
                return this.href === this.currentRoute;
            }
        },
        methods:{
            init:function(){
                window.addEventListener('popstate',function(){
                    this.currentRoute=window.location.pathname;
                });
            },
            go:function(ev){
                ev.preventDefault();
                this.href=ev.target.href;
                this.currentRoute=this.href;
                window.history && window.history.pushState
                && window.history.pushState(null,'',this.href);

            }
        }
    });
    app.init();
})();