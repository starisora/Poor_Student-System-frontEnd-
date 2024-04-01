import VueRouter from 'vue-router';
import Login from '../views/login/Login';
import Index from '../components/Index';
import Home from '../views/home/Home';
import Main from '../components/Main';
// import store from '../components/store';
// import Admin from '../components/admin/AdminManager';
// import user from '../components/user/UserManager';

const routes = [
    {
        path:'/',
        name:'Login',
        component:Login
    },
    {
        path:'/index',
        name:'Index',
        component:Index,
        children:[
            {
                path:'/home',
                name:'Home',
                meta:{
                  title:"首页"
                },
                component:Home,
            },
            {
                path:'/main',
                name:'Main',
                meta:{
                    title:"主页测试"
                },
                component:Main,
            },
            // {
            //     path:'/admin',
            //     name:'Admin',
            //     meta:{
            //         title:"管理员管理"
            //     },
            //     component:Admin,
            // },
            // {
            //     path:'/user',
            //     name:'User',
            //     meta:{
            //         title:"用户管理"
            //     },
            //     component:user,
            // }
        ]
    }
]

const router = new VueRouter({
    mode:'history',
    routes,
})

//Vue合并路径的时候会有重复问题,有了这个方法,执行之前使用该方法重置就没有问题了
export function resetRouter(){
    router.matcher = new VueRouter({
        mode:'history',
        routes:[]
    }).matcher
}

// router.afterEach((to,from,next) =>{
//     next({ ...to, replace: true })
// })

// router.beforeEach((to,from,next) =>{
//     // next({ ...to, replace: true })
//     // this.$store.commit("setRouter",router)
//     if (sessionStorage.getItem('menu')){
//         console.log("commit成功")
//         store.commit("setRouter",JSON.parse(sessionStorage.getItem('menu')));
//         next();
//     }else {
//         next();
//     }
//     // store.commit("setMenu",JSON.parse(sessionStorage.getItem('menu')))
//     // next()
// })

// router.beforeEach((to, from, next) => {
//     // 检查是否是刷新操作
//     if (to.name === null && from.name !== null) {
//         // 获取刷新前的路由路径
//         const previousPath = from.path
//         console.log(previousPath)
//
//         // 根据刷新前的路径获取对应的动态参数
//         // 这里假设你的动态参数是以冒号(:)开头的
//         const dynamicParams = previousPath.split('/').filter(param => param.startsWith(':'))
//         console.log(dynamicParams)
//
//         // 构建刷新后的路由路径
//         let refreshedPath = to.path
//         console.log(refreshedPath)
//         dynamicParams.forEach(param => {
//             // 从刷新前的路径中提取动态参数的值
//             const paramValue = previousPath.split('/').find(p => p.includes(param.replace(':', '')))
//
//             // 将动态参数的值替换到刷新后的路径中
//             refreshedPath = refreshedPath.replace(param, paramValue)
//         })
//
//         // 重定向到刷新后的路径
//         next(refreshedPath)
//     } else {
//         // 不是刷新操作，正常进行路由导航
//         next()
//     }
// })

// // let status = true
// router.beforeEach((to,from,next) =>{
//     console.log("路由刷新")
//     console.log("from="+from.path)
//     console.log("to="+to.path)
//     console.log(sessionStorage.getItem('submitUser'))
//
//     if(JSON.parse(sessionStorage.getItem('submitUser'))){
//         console.log("条件1")
//         next()
//     }else   if (from.path==="/"){
//         console.log("条件2")
//         next()
//     }else   if (to.path!=="/" && !JSON.parse(sessionStorage.getItem('submitUser'))){
//         console.log("跳转/")
//         next("/")
//     }
// })

//同路由下会报错,加上这个就不会了
//原理是重写了push方法,有些报错不必要,
//这段代码是对Vue Router的push方法进行了重写，并添加了错误处理逻辑
//这段代码需要在创建Vue Router实例之前执行，以确保重写的push方法在应用程序中生效
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push=function push(to){
    return VueRouterPush.call(this,to).catch(err=>err)
}

export default router;