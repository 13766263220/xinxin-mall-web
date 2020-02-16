<template>
	<div>
		<div class="demo-basic--circle">
			<div class="block">
				<el-upload 
					class="upload-demo" 
					ref="uploadIcon"
					action=""
					:limit="1"
					list-type="picture-card"
					:auto-upload="false"
					:on-preview="iconHandlePictureCardPreview"
					:on-remove="iconHandleRemove"
					:http-request='submitUpload'
					:file-list="photoInfo.iconImagelist"
					:class="{disabled:iconUploadDisabled}"
					:on-change="iconUploadChange"
					:on-success='iconOnSuccess'
					:disabled="userInfoEditDisabled"
					accept="image/jpeg,image/jpg,image/png"
					>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-button 
					v-show="userInfoEditDisabled == false"
					style="margin-left: 10px;" type="success" icon="el-icon-check" round size="small" @click="iconSubmitAssess()">
					上传到服务器
				</el-button>
				<!-- 大图查看 -->
				<el-dialog :visible.sync="photoInfo.dialogVisible" append-to-body>
					<img width="100%" :src="photoInfo.dialogImageUrl" alt="">
				</el-dialog>
				<!-- <el-image
				:src="userInfoEdit.photo"
				style="width: 80px;height: 80px;"
				@click="changePhoto()"
				>
					<div slot="error" class="image-slot">
						<el-image
						:src="defaultPhotoUrl"
						style="width: 80px;height: 80px;"
						@click="changePhoto()"
						></el-image>
					</div>
				</el-image> -->
			</div>
			
			<br />
			<el-form
				:inline="true"
				:model="userInfoEdit"
				ref="userInfoEdit"
				class="demo-form-inline"
				:rules="userInfoEditRules"
				:disabled="userInfoEditDisabled"
				@submit.native.prevent
			>
				<el-form-item label="姓名:" prop="name">
					<el-input v-model="userInfoEdit.name" style="width: 400px;"></el-input>
				</el-form-item>
				<br />
				<span style="margin-left: -295px;"></span>
				<el-form-item label="性别:" prop="sex">
					<el-radio-group v-model="userInfoEdit.sex">
					    <el-radio :label="1">男</el-radio>
					    <el-radio :label="0">女</el-radio>
					  </el-radio-group>
				</el-form-item>
				<br />
				<el-form-item label="电话:" prop="phone">
					<el-input v-model="userInfoEdit.phone" style="width: 400px;"></el-input>
				</el-form-item>
				<br />
				<el-form-item label="地址:" prop="address">
					<el-input v-model="userInfoEdit.address" style="width: 400px;"></el-input>
				</el-form-item>
				<br />
				<el-button v-show="userInfoEditDisabled == false" type="success" @click="userInfoUpdate()">确认编辑</el-button>
				<el-button v-show="userInfoEditDisabled == false" type="primary" @click="cancelUserInfoEdit">取消编辑</el-button>
				<br />
				
			</el-form>
		</div>
		<el-button v-show="userInfoEditDisabled == true" type="primary" @click="userInfoEditDisabled = false">编辑用户信息</el-button>
		
	</div>
</template>

<script>
	export default{
		mounted() {
			this.getUserInfo();
		},
		methods:{
			getUserInfo(){//查询用户信息
				var token = sessionStorage.getItem('token');
				this.$http.get('/api/userInfo/info?token='+token)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '403'){
						this.showLogin();
						return;
					}
					this.userInfoEdit = request.data.data;
					if (this.userInfoEdit.photo !== null && this.userInfoEdit.photo !== undefined && this.userInfoEdit.photo !== ''){
						this.photoInfo.iconImagelist=[{url:this.userInfoEdit.photo}];//赋值logo上传图片框
						this.photoInfo.iconPath=this.userInfoEdit.photo;//赋值logo存进数据库的path
					}
				}).catch(error => {
					
				})
			},
			userInfoUpdate(){//编辑用户信息
				this.userInfoEdit.photo = this.photoInfo.iconPath;
				var data={
					userInfo:this.userInfoEdit,
					token:sessionStorage.getItem('token'),
					role:"user"
				}
				this.$http.put('/api/userInfo',data)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '403'){
						this.showLogin();
						return;
					}else if(request.data.code == '200'){
						this.$message({
							message:request.data.msg,
							type: 'success'
						});
					}else if(request.data.code == '500'){
						this.$message({
							message:request.data.msg,
							type: 'error'
						});
					}
					
				}).catch(error => {
					
				})
			},
			cancelUserInfoEdit(){//取消用户编辑
				this.userInfoEditDisabled = true
				this.getUserInfo();
			},
			changePhoto(){//编辑头像图片
				
			},
			/* 上传 start */
			iconSubmitAssess(){//点击上传至服务器
				if(this.photoInfo.iconImagelist.length > 0){
					//图片上传
					this.$refs.uploadIcon.submit()
				}else{
					this.$message({
						message:'请选择上传图片',
						type:'info'
					})
				}
			},
			iconHandlePictureCardPreview(file) {//查看图片发生
			  this.photoInfo.dialogImageUrl = file.url;
			  this.photoInfo.dialogVisible = true;
			},
			iconUploadChange(file, fileList){//添加图片发生的事件
				this.photoInfo.iconImagelist=fileList;
			},
			iconHandleRemove(file, fileList) {//删除图片发生
			    console.log(file, fileList);
				this.photoInfo.iconImagelist=fileList;
			},
			iconOnSuccess(filePath){//上传成功(文件上传成功的回调)
				this.photoInfo.iconPath=filePath;
			},
			//调用this.$refs.upload.submit()就会调用此方法
			submitUpload: function(content) {//自定义的上传图片的方法（改变 <el-upload> 默认上传行为）
				//1. 创建formData 利用AXIOS传递
				let formData = new FormData;
				formData.append('myfile', content.file);
					console.log(content.file)
					let config = {
						'Content-Type': 'multipart/form-data'
					}
						this.$http
						.post('/file/upload', formData, config)
						.then(response => {
							console.log(response.data)
							if(response.data.code=="200"){
								//上传成功,给logoPath赋个路径(回调上传成功)
								content.onSuccess(response.data.data)
							}
						})
						.catch(error => {
							console.log(error);
							//弹出消息框
							this.$message({
								message: '服务器异常',
							 	type: 'error'
							});
						});
			},
			
			/* 上传end */
			
		},
		data(){
			return {
				defaultPhotoUrl: "http://localhost:8080/file/download?filename=defaultphoto.png",
				userInfoEdit:{//用户信息
					name:null,
					sex:null,
					address:null,
					phone:null
				},
				userInfoEditRules:{//用户信息校验规则
					
				},
				userInfoEditDisabled:true, //是变为不可编辑
				photoInfo:{
					dialogImageUrl: '',//大图查看路径
					dialogVisible: false,//大图图查看弹出
					iconPath:'',//icon路径
					iconImagelist:[]//图片
				}
			}
			
		},
		inject:['showLogin'],
		computed: {
			iconUploadDisabled:function(){//是否显示bigPic上传的+号
				return this.photoInfo.iconImagelist.length > 0
			}
		}
	}
</script>

<style>
	.disabled .el-upload--picture-card {
		display: none; /* 上传图片是否显示+ */
	}
</style>
