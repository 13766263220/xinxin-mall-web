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
				  <el-menu-item index="2">购物车</el-menu-item>
				  <el-menu-item index="3">订单</el-menu-item>

				  <el-submenu v-if="token != null" index="6">
					<template slot="title">用户</template>
					<el-menu-item index="4-1" style="50px">查看信息</el-menu-item>
					<el-menu-item index="4-2" style="50px">退出登录</el-menu-item>
				  </el-submenu>
				  <el-menu-item v-else index="5">登录</el-menu-item>
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
		>	<div style="margin-top: -40px;margin-bottom: 10px;">
				<img src="../assets/defaultphoto.png" style="width: 100px;height: 100px;"/>
			</div>
			<el-form
				:inline="true"
				:model="loginParam"
				ref="loginParam"
				class="demo-form-inline"
				@submit.native.prevent
				:rules="loginRules"
			>
				<el-form-item label="" prop="phone">
					<el-input v-model="loginParam.phone" placeholder="请输入账号/手机号码" style="width: 300px;" prefix-icon="el-icon-user"></el-input>
				</el-form-item>
				<br />
				<el-form-item label="" prop="password">
					<el-input v-model="loginParam.password" placeholder="请输入密码" show-password style="width: 300px;" prefix-icon="el-icon-lock"></el-input>
				</el-form-item>
				<br />
				
				<el-button style="width: 300px;margin-left: -13px;"type="primary" @click="dologin()">登录</el-button>
				<br />
				<span class="numberOperation"  @click="forgetPassword()">忘记密码?</span>
				<span class="numberOperation"  @click="registerUser()">注册账号</span>
				
			</el-form>
			
			<!-- 忘记密码模态框 start -->
			<el-dialog
				title="找回密码"
				:visible.sync="forgetPasswordDialogParam.show"
				width="500px"
				@close="forgetPasswordDialogClose"
				append-to-body
			>
				<el-form
					:inline="true"
					:model="forgetPasswordParam"
					ref="forgetPasswordParam"
					class="demo-form-inline"
					@submit.native.prevent
					:rules="forgetPasswordParamRules"
				>	
					<div style="margin-left: 30px;">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="forgetPasswordParam.phone" placeholder="请输入账号/手机号码" style="width: 300px;"></el-input>
						</el-form-item>
						<el-form-item label="验证码" prop="validCode">
							<el-input v-model="forgetPasswordParam.validCode" placeholder="请输入验证码" style="width: 300px;"></el-input>
						</el-form-item>
						<el-button style="margin-left: 55px;" type="primary" :loading="forgetPasswordDialogParam.isVerification" @click="sendVerification">{{forgetPasswordDialogParam.vftion}}</el-button>
						<el-button type="primary" @click="goValid()">验证</el-button><br /><br />
						<el-form-item label="设置新密码" prop="newPassword">
							<el-input :disabled="forgetPasswordDialogParam.ifNewPassword" v-model="forgetPasswordParam.newPassword" placeholder="请输入新密码" style="width: 300px;"></el-input>
						</el-form-item>
					</div>
				</el-form>
				
				<div slot="footer" class="dialog-footer">
				  <el-button @click="forgetPasswordDialogParam.show = false">取 消</el-button>
				  <el-button :disabled="forgetPasswordDialogParam.ifNewPassword" type="primary" @click="editNewPassword()">确认设置新密码</el-button>
				</div>
			</el-dialog>
			<!-- 忘记密码模态框 end -->
			
		</el-dialog>
		</el-scrollbar>
		
		
	</div>
</template>

<script>
	 //引入全局对象(用户校验)
	  import {isvalidPhone} from '../utils/validate'
	  //定义一个全局的变量
	  var validPhone=(rule, value, callback)=>{
	      if (!value){
	          callback(new Error('请输入手机号码'))
	      }else  if (!isvalidPhone(value)){
	        callback(new Error('请输入正确的11位手机号码'))
	      }else {
	          callback()
	      }
	  }
	
	export default{
		mounted(){
			this.$router.push({name:'home'})
		},
		methods:{
			handleSelect(key, keyPath) {//改变菜单
			    console.log(key);
				if(key == '1'){//首页
					this.$router.push({name:'home'})
				}else if(key == '2'){//购物车
					this.$router.push({name:'shoppingCart'})
				}else if(key == '3'){//订单
					this.$router.push({name:'orderForm'})
				}
				else if(key == '4-1'){//用户信息
					this.$router.push({name:'userInfo'})
				}else if(key == '4-2'){//退出登录
					sessionStorage.removeItem('token');
					location.reload() //刷新页面
				}else if(key == '5'){//打开登录模态框
					this.showLogin();
				}
			},
			showLogin(){//打开登录界面
				this.loginDialogParam.show = true;
			},
			loginDialogClose(){ //关闭登录界面
				//this.loginParam.phone = null
				//this.loginParam.password = null
				this.$refs["loginParam"].resetFields();//清空对话框里面的值 与 校验警告值
			},
			dologin(){//点击模态框中点击登录
			
				this.$refs["loginParam"].validate(valid => {
					if(valid){
						//查询post请求
						this.$http
						.get('/api/userInfo/login/'+this.loginParam.phone+'?password='+this.loginParam.password)
						.then(response => {
							console.log(response.data)
							if(response.data.code == '200'){
								this.$message({
									message:response.data.msg,
									type:'success'
								});
								//保存用户账号
								sessionStorage.setItem("token",response.data.data)
								
								//alert(sessionStorage.getItem("token"))
								
								location.reload()//刷新页面
								
							}else{
								this.$message({
									message:response.data.msg,
									type:'error'
								});
							}
							
						})
						.catch(error => {
						  	//弹出消息框
						  	this.$message({
								message: '服务器异常',
								type: 'error'
						  	});
						})
					}
				});
			
				
			},
			forgetPassword(){//打开忘记密码
				this.forgetPasswordDialogParam.show = true;
			},
			forgetPasswordDialogClose(){//关闭忘记密码
				this.forgetPasswordDialogParam.ifNewPassword=true
				this.forgetPasswordParam.phone=''
				this.forgetPasswordParam.validCode=''
				this.forgetPasswordParam.newPassword=''
				this.forgetPasswordParamRules.newPassword=[]
			},
			registerUser(){//注册账号
				this.$router.push({name:'registerUser'});
				this.loginDialogParam.show = false;
			},
			sendVerification(){//发送验证
				var isVaild = false;
				this.$refs["forgetPasswordParam"].validate(valid => {//判断校验是否成功
					if(valid){
						isVaild = true;
					}})
				if(isVaild==false){
					return ;
				}
				this.forgetPasswordDialogParam.isVerification = true;
				this.forgetPasswordDialogParam.vftion = 60;//一分钟
				var _this = this;
				var time = window.setInterval(function(){
					_this.forgetPasswordDialogParam.vftion-=1;
					if(_this.forgetPasswordDialogParam.vftion == 0){
						_this.forgetPasswordDialogParam.vftion = '获取验证码'
						window.clearInterval(time) //关闭计时器
						_this.forgetPasswordDialogParam.isVerification = false;
					}
				},1000);
				
				this.$http.get('/verificationCode/generateCode',{params:{'phone':this.forgetPasswordParam.phone}})
				.then(response =>{
					if(response.data.code == '200'){
						this.forgetPasswordDialogParam.verificationCode = response.data.data;
						alert(this.forgetPasswordDialogParam.verificationCode)
					}
				})
			},
			goValid(){//确认验证
				if(this.forgetPasswordDialogParam.verificationCode == ''){
					this.$message({
						type:'warning',
						message:'请确认是否获取验证码'
					})
					return ;
				}
				if(this.forgetPasswordDialogParam.verificationCode == this.forgetPasswordParam.validCode){
					this.$message({
						type:'success',
						message:'验证成功'
					})
					this.forgetPasswordDialogParam.ifNewPassword = false;
					this.forgetPasswordParamRules.newPassword=[{required: true, message: "请输入新密码", trigger: "blur" }];
					
				}else{
					this.$message({
						type:'error',
						message:'验证失败'
					})
				}
			},
			editNewPassword(){//确认修改新密码
				var data={
					'phone':this.forgetPasswordParam.phone,
					'passWord':this.forgetPasswordParam.newPassword
				}
				this.$http.put('/api/userInfo/newPassword',data)
				.then(response=>{
					console.log(response.data)
					if(response.data.code == '200'){
						this.$message({
							type:'success',
							message:response.data.msg
						})
						this.forgetPasswordDialogParam.show = false
					}
				})
				
			}
			
		},
		data(){
			return {
				token:sessionStorage.getItem('token'),
				loginDialogParam:{//登录窗口是否显示
					show:false,
					
				},
				
				loginParam:{//登录的账号与密码
					phone:null,
					password:null
				},
				loginRules:{//登录校验
					phone: [
					    { required: true, trigger: 'blur', validator: validPhone }//这里需要用到全局变量
					],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				forgetPasswordDialogParam:{//忘记密码模态框
					show:false,
					isVerification:false,
					vftion:'获取验证码',
					ifNewPassword:true,//新密码是否不可以操作
					verificationCode:'',//验证码
				},
				forgetPasswordParam:{//忘记密码参数
					phone:'',
					validCode:'',
					newPassword:''//新密码
				},
				forgetPasswordParamRules:{//忘记密码参数校验
					phone: [
					    { required: true, trigger: 'blur', validator: validPhone }//这里需要用到全局变量
					],
					newPassword:[
						//{ required: true, message: "请输入新密码", trigger: "blur" }
					]
				}
			};
		},
		provide(){
		      return{
		          showLogin:this.showLogin //可用于子组件调用父组件的方法
		      }
		}
	}
</script>

<style scoped>
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
  
  .numberOperation{
	  text-decoration: underline;
	  font-size: 10px;
	  cursor: pointer;
	  color: #97a8be;
  }
  
</style>
