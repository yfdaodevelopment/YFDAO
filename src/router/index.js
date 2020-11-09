
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index"

Vue.use(VueRouter)
const router= new VueRouter({
  routes:[
  {
    path: '/',
    redirect: 'Staking'
  },
  {
    path: '/staking',
    name: 'Staking',
    component: () => import('../views/Staking.vue')
  },
  {
    path: '/farming',
    name: 'Farming',
    component: () => import('../views/Farming.vue')
  },
  {
    path:"/settings",
    name:'Setting',
    component: () => import('../views/Setting.vue'),
   
    
  }
]
})




router.beforeEach(async (to, from, next) => {
  console.log(to)
 
 
  if(to.path=="/settings"){
    if(store.state.currentAddress==store.state.owner){
      console.log(store.state.currentAddress)
      console.log(store.state.owner)

      next()
    }else{
      next('/Staking')
    }
  }else{
    next();
  }
  // ...
})

export default router
