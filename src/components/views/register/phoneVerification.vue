<template>
	<div>
		<el-form
			:inline="true"
			:model="userInfoEdit"
			ref="userInfoEdit"
			class="demo-form-inline"
			@submit.native.prevent
			:rules="userInfoEditRules"
		>
			<el-form-item label="手机号码" prop="phone">
				<el-input v-model="userInfoEdit.phone" placeholder="请输入账号/手机号码" style="width: 300px;" ></el-input>
			</el-form-item>
			<br />
			<el-form-item label="密码" prop="passWord">
				<el-input v-model="userInfoEdit.passWord" placeholder="请输入密码" show-password style="width: 300px;" ></el-input>
			</el-form-item>
			<br />
			<el-form-item label="验证码" prop="verificationCode">
				<el-input v-model="userInfoEdit.verificationCode" placeholder="请输入验证码" style="width: 300px;"></el-input>
			</el-form-item>
			<br />
			<el-button type="primary" :loading="isVerification" @click="sendVerification">{{vftion}}</el-button>
			<br />
		</el-form>
		
		<!-- 手机号码：<el-input type="text" style="width: 200px;"></el-input>
		<el-button type="primary" :loading="isVerification" @click="sendVerification">{{vftion}}</el-button><br />
		验证码：<el-input type="text" style="width: 200px;"></el-input> -->
		<br />
		<el-button style="margin-top: 12px;" @click="prev">上一步</el-button>
		<el-button style="margin-top: 12px;" @click="next">下一步</el-button>
	</div>
</template>

<script>
	//引入全局对象(用户校验)
	 import {isvalidPhone} from '../../../utils/validate'
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
		mounted() {
			
		},
		methods:{
			next(){//下一步
			this.$refs["userInfoEdit"].validate(valid => {//判断校验是否成功
				if(valid){
					this.$emit('active',2)
					this.$emit('phone',this.userInfoEdit)
				}
			})
				
			},
			prev(){//上一步
				this.$emit('active',0)
			},
			sendVerification(){//发送验证
				this.isVerification = true;
				this.vftion = 60;
				var _this = this;
				var time = window.setInterval(function(){
					_this.vftion-=1;
					if(_this.vftion == 0){
						_this.vftion = '获取验证码'
						window.clearInterval(time) //关闭计时器
						_this.isVerification = false;
					}
				},1000);
				
			}
		},
		data(){
			return{
				isVerification:false, //是否可以发送验证
				vftion:'获取验证码',
				
				userInfoEdit:{//用户信息
					phone:null,
					verificationCode:null, //验证码
					passWord:null //密码
				},
				userInfoEditRules:{//用户信息校验规则
					phone: [
					    { required: true, trigger: 'blur', validator: validPhone }//这里需要用到全局变量
					],
					verificationCode:[
						{ required: true, message: "请输入验证码", trigger: "blur" }
					],
					passWord: [
					  { required: true, message: "请输入用户密码", trigger: "blur" }
					]
				}
			}
		}
	}
</script>

<style>
</style>
