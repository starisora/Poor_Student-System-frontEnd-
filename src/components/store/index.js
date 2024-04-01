import vue from 'vue'
import Vuex from 'vuex'
import router,{resetRouter} from "../../router";
// import Home from "../../views/home/Home";
// import createPersistedState from 'vuex-persistedstate';
vue.use(Vuex)

//动态路由
function addNewRouter(menuList){

    // console.log("输出")
    // console.log(menuList)
    let routes = router.options.routes
    // console.log("routes")
    routes.forEach(routeItem=>{
        if (routeItem.path=="/index"){
            menuList.forEach(menu=>{
                let childRoute={
                    path:'/'+menu.menuclick,
                    name:menu.menuname,
                    meta:{
                        title:menu.menuname
                    },
                    component:()=>import('../../components/'+menu.menucomponent)
                }
                routeItem.children.push(childRoute)
            })
        }
    })
    //合并路由
    resetRouter()
    router.addRoutes(routes)
}
//这个文件暂时不知道是干什么,官话状态管理
const store = new Vuex.Store({
    state: {
        menu:[]
    },
    mutations: {
        setMenu(state,menuList){
            state.menu = menuList
            addNewRouter(menuList)
        },
        setRouter(state,menuList){
            addNewRouter(menuList)
        }
    },
    getters:{
        getMenu(state){
            return state.menu
        }
    },
    // plugins:[createPersistedState]
})

export default store