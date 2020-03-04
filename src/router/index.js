import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

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
				component:resolve => require(['@/components/views/home'], resolve) //主页
			},
			{
				path:"shoppingCart",
				name:"shoppingCart",
				component:resolve => require(['@/components/views/shoppingCart'], resolve) //购物车
			},
			{
				path:"orderForm",
				name:"orderForm",
				component:resolve => require(['@/components/views/orderForm'], resolve) //订单
			},
			{
				path:"userInfo",
				name:"userInfo",
				component:resolve => require(['@/components/views/userInfo'], resolve) //用户信息
			},
			{
				path:"registerUser",
				name:"registerUser",
				component:resolve => require(['@/components/views/register/registerUser'], resolve) //注册账号
			},
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


/**
 * 请求拦截器,添加请求头token
 */
axios.interceptors.request.use(
  config => {
		//config.url="http://localhost:8080"+ config.url;//设置全局的请求地址
		console.log('>>>请求url:',config.url);
    var headers = config.headers;
    if (sessionStorage.getItem("token")) {
      headers.token = sessionStorage.getItem("token");
    }
    return config;
  },
  error => {
    console.log('>>>请求异常:',error.message);
    return Promise.reject(error);
  });
//接口请求超时设置
axios.defaults.timeout=5000;//毫秒
/**
 * 响应拦截器,添加请求头token
 */
axios.interceptors.response.use(function (response) {
  // Do something with response data
  console.log('<<<请求成功');
  return response;
}, error=> {
  // Do something with response error
  console.log('<<<异常信息:',error.message);
  return Promise.reject(error);
});
