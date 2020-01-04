<template>
	<div style="height: 580px;">
		<div style="height: 60px;background-color: #304156;">
			
			<div style="float: right;">
				<el-menu 
				:default-active="'1'" 
				class="el-menu-demo" 
				mode="horizontal" 
				@select="handleSelect"
				background-color="#304156"
				text-color="rgb(191,203,217)"
				active-text-color="rgb(64,158,255)"
				>
				  <el-menu-item index="1">主页</el-menu-item>
				  <el-menu-item index="2">商品分类</el-menu-item>
				  <el-menu-item index="3">购物车</el-menu-item>
				  <el-menu-item index="4">消息中心</el-menu-item>
				  <el-menu-item index="5">订单</el-menu-item>
				  
				  
				  
				  <el-submenu v-if="user != null" index="6">
					<template slot="title">用户</template>
					<el-menu-item index="6-1" style="50px">查看信息</el-menu-item>
					<el-menu-item index="6-2" style="50px">修改密码</el-menu-item>
					<el-menu-item index="6-3" style="50px">退出登录</el-menu-item>
				  </el-submenu>
				  <el-menu-item v-else index="7">登录</el-menu-item>
				</el-menu>
			</div>
		</div>
		<br />
		<el-scrollbar style="height: 100%; overflow:hidden;">
			<router-view /><!-- style="margin-top: -25px;" -->
		<el-dialog
			:visible.sync="loginDialogParam.show"
			width="500px"
			@close="loginDialogClose"
		>
			<el-form
				:inline="true"
				:model="loginParam"
				ref="loginParam"
				class="demo-form-inline"
				@submit.native.prevent
			>
				<el-form-item label="" prop="name">
					<el-input v-model="loginParam.phone" placeholder="请输入账号/手机号码" style="width: 300px;" prefix-icon="el-icon-user"></el-input>
				</el-form-item>
				<br />
				<el-form-item label="" prop="name">
					<el-input v-model="loginParam.password" placeholder="请输入密码" style="width: 300px;" prefix-icon="el-icon-lock"></el-input>
				</el-form-item>
				<br />
				<el-button style="width: 300px;margin-left: -13px;"type="primary" @click="dologin()">登录</el-button>
				
			</el-form>
		</el-dialog>
		</el-scrollbar>
		
		
	</div>
</template>

<script>
	export default{
		mounted(){
			this.$router.push({name:'home'})
		},
		methods:{
			handleSelect(key, keyPath) {//改变菜单
			    console.log(key);
				if(key == '1'){//首页
					this.$router.push({name:'home'})
				}else if(key == '2'){//商品分类
					this.$router.push({name:'category'})
				}else if(key == '3'){//购物车
					this.$router.push({name:'shoppingCart'})
				}else if(key == '6-3'){//退出登录
					sessionStorage.removeItem('user');
					location.reload()
				}else if(key == '7'){//打开登录模态框
					this.loginDialogParam.show = true;
				}
			},
			loginDialogClose(){
				this.loginParam.phone = null
				this.loginParam.password = null
			},
			dologin(){//点击模态框中点击登录
				sessionStorage.setItem("user",true)
				location.reload()
			}
		},
		data(){
			return {
				user:sessionStorage.getItem('user'),
				loginDialogParam:{
					show:false
				},
				loginParam:{
					phone:null,
					password:null
				}
			};
		}
	}
</script>

<style>
	.el-popup-parent--hidden{
		padding-right: 0px;
	}
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .blocks{
	  float: left;
	  /* margin-left: 50px;
	  margin-top: 10px; */
	  width: 200px;
	  cursor: pointer;
	  border: 1px white solid;
	  padding: 10px;
	  padding-left: 20px;
	  padding-right: 20px;
  }
  .blocks:hover{
  	  border: orange 1px solid;
  }
  
  
  .product-descript{
	  overflow:hidden; 
	  text-overflow:ellipsis; 
	  white-space:nowrap
  }
</style>
