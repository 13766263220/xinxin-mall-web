<template>
	<div>
		<h2>注册完成</h2>
		<el-button style="margin-top: 12px;" @click="returnHome">返回主页</el-button>
	</div>
</template>

<script>
	export default{
		mounted() {
			
		},
		methods:{
			returnHome(){//返回主页
				this.$router.push({name:'home'})
			}
		},
		data(){
			return {
				
			};
		}
	}
</script>

<style>
</style>
