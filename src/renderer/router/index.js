import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/RedditPage').default
    },
    {
      path: 'closermonkey',
      name: 'closermonkey',
      component: require('@/components/CloserMonkeyPage').default
    },
    {
      path: 'yahoo',
      name: 'yahoo',
      component: require('@/components/YahooPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
