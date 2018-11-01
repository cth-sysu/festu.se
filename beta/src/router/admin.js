import Vue from 'vue'
import Router from 'vue-router'
import EditParties from '../views/EditParties.vue'
import EditParty from '../views/EditParty.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/kalas',
      name: 'kalas',
      component: EditParties
    },
    {
      path: '/kalas/:id',
      name: 'kalas-edit',
      component: EditParty
    },
    {
      path: '/orv',
      name: 'orv',
    },
    { 
      path: '*',
      redirect: '/kalas'
    }
  ]
})
