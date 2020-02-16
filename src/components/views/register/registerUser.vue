<template>
	<div >
		<div style="width: 500px;margin:0 auto;" class="myClass">
		<el-steps :active="active" finish-status="success" align-center>
		  <el-step title="基本信息"></el-step>
		  <el-step title="短信验证"></el-step>
		  <el-step title="完成"></el-step>
		</el-steps>
			
		</div>
		<br />
		<basic-info v-show="showStatus[0]" @active="getActive" @userInfo="getUserInfo"></basic-info>
		<phone-verification v-show="showStatus[1]" @active="getActive" @phone="getPhone"></phone-verification>
		<register-ok v-show="showStatus[2]" @active="getActive"></register-ok>
	</div>
</template>

<script>
	import basicInfo from './basicInfo.vue';
	import phoneVerification from './phoneVerification.vue';
	import registerOk from './registerOk.vue';
	export default{
		mounted(){
			
		},
		methods:{
			getActive(active){//第几步
				for(var i = 0;i<2;i++){
					this.showStatus[i] = false;
				}
				this.showStatus[active] = true;
				this.active = active;	
			},
			getUserInfo(userInfo){//获得用户基本信息
				this.userInfoEdit = userInfo;
			},
			getPhone(data){//获得用户电话
				this.userInfoEdit.phone = data.phone;
				this.userInfoEdit.passWord = data.passWord;
				//alert(this.$qs.stringify(this.userInfoEdit))
				
				
				this.$http
				.post('/api/userInfo/insert',this.userInfoEdit,
				{headers: {
					'Content-Type': 'application/json'
				}})
				.then(request => {
					console.log(request.data)
				}).catch(error => {
					  //弹出消息框
					this.$message({
						message: '服务器异常',
						type: 'error'
					})
				})
			}
		},
		data(){
			return{
				active: 0, //步骤
				showStatus: [true, false, false],
				userInfoEdit:{//用户信息
					name:null,
					sex:1,
					address:null,
					phone:null,
					photo:null,
					passWord:null
				},
			}
		},
		components:{ //组件
			basicInfo,
			phoneVerification,
			registerOk
		}
	}
</script>

<style scoped="scoped">
	.myClass{
		text-align: left;
	}
</style>
