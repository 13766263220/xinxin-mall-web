import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// 解决重复点击导航路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
	{
	  path: '/index',
	  name: 'index',
	  component: resolve => require(['@/components/Index'], resolve),
	  meta: { title: '首页' },
	  children:[//表示子路由
			{
				path:"home",
				name:"home",
				component:resolve => require(['@/components/views/home'], resolve)
			},
			{
				path:"category",
				name:"category",
				component:resolve => require(['@/components/views/category'], resolve)
			},
			{
				path:"shoppingCart",
				name:"shoppingCart",
				component:resolve => require(['@/components/views/shoppingCart'], resolve)
			}
	  	]
		
	},
	{
	  name: '404',
	  path: '/404',
	  component: resolve => require(['@/components/404'], resolve),
	  meta: { title: '路由不存在' }
	},
	{
	  name: '403',
	  path: '/403',
	  component: resolve => require(['@/components/403'], resolve),
	  meta: { title: '资源不可访问' }
	},
	{
	  path: '*',
	  redirect: '/404'
	}
  ],
  mode: 'history'//url地址不显示#号
})
