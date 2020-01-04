<template>
	<div style="margin-top: 0px;">
	<div>
		<div>
			<el-form
			  :inline="true"
			  class="demo-form-inline"
			  label-width="68px"
				@submit.native.prevent
			>	
				<el-form-item class="form_input" label="" style="">
				  <el-input 
					placeholder="请输入商品名称" clearable
					@keyup.enter.native=""
					prefix-icon="el-icon-search"
					style="width:500px;"
				  ></el-input>
				</el-form-item>
				<el-form-item>
				  <el-button type="primary" icon="el-icon-search">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div>
			<el-card 
			v-for="(product, index) in products" :key="index"
			:body-style="{ padding: '0px'}"
			 class="card-class"
			shadow="hover">
			  <img :src="product.pic" class="image">
			  <div style="padding-top: 20px;padding-bottom: 20px;width: 100%;" >
				<div class="product-descript">
					<span>{{product.name}}</span>
				</div>
				<div style="margin-top: 10px;">
					<span>￥{{product.price}}</span>
				</div>
				<div style="margin-top: 10px;">
					<el-button title="购买" type="success" icon="el-icon-goods" circle size="medium"></el-button>
					<el-button @click="showShopping(product)" title="加入购物车" type="primary" icon="el-icon-shopping-cart-2" circle size="medium"></el-button>
				</div>
				
			  </div>
			</el-card>
			
			
		</div>
	</div>
	<!-- 商品展示 end -->
	<div>
		<el-dialog
			:visible.sync="shoppingDialog.show"
			width="600px"
			@close="shoppingDialogClose"
			append-to-body
		>
			<div style="margin-left: 30px;">
				<el-image 
				    style="width: 100px; height: 100px"
				    :src="shoppingProduct.product.pic" 
				    :preview-src-list="[shoppingProduct.product.pic]">
				</el-image>
				<h3>{{shoppingProduct.product.name}}</h3>
				<h3>￥{{shoppingProduct.product.price}}</h3>
			</div>
			<span :key="index" v-for="(attr,index) in shoppingProduct.productAttr" style="margin-left: 40px;">
				{{attr.name}}:<span style="margin-left:10px;"></span>
				<el-radio-group v-model="shoppingProduct.radio[index]" @change="changeAttrOptions(index)">
					<el-radio :key="key" v-for="(option,key) in attr.attrOptions" :label="option.name">{{option.name}}</el-radio>
				</el-radio-group>
				<br /><br />
			</span>
		</el-dialog>
	</div>
	
	
	<div style="margin-top: 50px;"></div>
	</div>
</template>

<script>
	export default{
		mounted(){
			this.queryProductAll();//查询所有商品信息
		},
		methods:{
			queryProductAll(){//查询所有商品信息
				//查询post请求
				this.$http
				.get('/product/list')
				.then(response => {
					console.log(response.data)
					this.products = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
			},
			showShopping(product){//打开购买商品页面
				this.shoppingDialog.show = true
				this.shoppingProduct.product = product
				this.queryAttr(product.categoryId)
			},
			shoppingDialogClose(){//关闭购买商品页面
				
			},
			queryStock(productId){//查询商品属性
				//查询post请求		  
				this.$http
				.post('/stock/getByProductId',this.$qs.stringify({productId:productId}))
				.then(response => {
					
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: error,
						type: 'error'
				  	});
				})
			},
			queryAttr(categoryId){
				this.$http
				.post('/productAttr/list',this.$qs.stringify({categoryId:categoryId}))
				.then(response => {
					console.log(response.data)
					this.shoppingProduct.productAttr = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
			},
			changeAttrOptions(attrIndex){//选择发生的事件
				var attrs = this.shoppingProduct.productAttr;
				this.shoppingProduct.productSpecs[attrs[attrIndex].name] = this.shoppingProduct.radio[attrIndex];
				console.log(this.shoppingProduct.productSpecs)
			}
			
		},
		data(){
			return {
				src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
				products:[],//商品信息
				shoppingDialog:{
					show : false
				},
				shoppingProduct:{//购买的商品
					product:{},
					productAttr:[],//查询到的所有属性
					radio:[], //选择的所有属性值
					productSpecs:{} //最终要上传的json字符串值
				}
			};
		}
	}
</script>

<style scoped>
  
  
  
  .product-descript{
	  overflow:hidden; 
	  text-overflow:ellipsis; 
	  white-space:nowrap
  }
  
  /* ------------------- */
  
  .time {
      font-size: 13px;
      color: #999;
    }
    
    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }
  
    .button {
      padding: 0;
      float: right;
    }
  
    .image {
	padding-top: 20px;
      width: 100%;
	  height: 250px;
      display: block;
    }
  
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    
    .clearfix:after {
        clear: both
    }
	
	.card-class{
		float: left;
		margin: 5px;
		width: 249px;
		cursor: pointer;
	}
	
	.card-class:hover{
		  border: orange 1px solid;
	}
</style>

