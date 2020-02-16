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
			v-for="(p, index) in products" :key="index"
			:body-style="{ padding: '0px'}"
			 class="card-class"
			shadow="hover">
			  <img :src="p.pic" class="image">
			  <div style="padding-top: 20px;padding-bottom: 20px;width: 100%;" >
				<div class="product-descript">
					<span>{{p.name}}</span>
				</div>
				<div style="margin-top: 10px;">
					<span>￥{{p.price}}</span>
				</div>
				<div style="margin-top: 10px;">
					<el-button @click="showShopping(p,0)" title="购买" type="success" icon="el-icon-goods" circle size="medium"></el-button>
					<el-button @click="showShopping(p,1)" title="加入购物车" type="primary" icon="el-icon-shopping-cart-2" circle size="medium"></el-button>
				</div>
				
			  </div>
			</el-card>
			
			
		</div>
	</div>
	<!-- 商品展示 start -->
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
				    :src="shoppingDialog.pic" 
				    :preview-src-list="[shoppingDialog.pic]">
				</el-image>
				<h3>{{shoppingProduct.product.name}}</h3>
				<h3>￥{{shoppingDialog.price}}</h3>
				<h3>库存：{{shoppingDialog.stock}}</h3>
			</div>
			<span :key="index" v-for="(attr,index) in shoppingProduct.productAttr" style="margin-left: 40px;">
				{{attr.name}}:<span style="margin-left:10px;"></span>
				<el-radio-group v-model="shoppingProduct.radio[index]" @change="changeAttrOptions(index)">
					<el-radio :key="key" v-for="(option,key) in attr.attrOptions" :label="option.name">{{option.name}}</el-radio>
				</el-radio-group>
				<br /><br />
			</span>
			
			<div style="margin-left: 30px;">
				<el-button @click="addShoppingCart()" v-show="isCar == 1" type="success">加入购物车</el-button>
				<el-button v-show="isCar == 0" type="success">购买</el-button>
			</div>
		</el-dialog>
	</div>
	<!-- 商品展示 end -->
	
	
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
				//查询get请求
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
			whetherTheLogin(){//用来判断是否已登录
				if(this.token == null){
					this.$confirm('你还未进行登录, 是否需要登录?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					          this.showLogin();//打开登录界面
					        }).catch(() => {
					          //不进行登录（不做任何操作） 
					        });
					return false;
				}else{
					return true;
				}
			},
			showShopping(product,isCar){//打开购买商品页面
				if(isCar == 0){
					this.isCar = 0;
				}else{
					this.isCar = 1;
				}
				if(this.whetherTheLogin() == false){
					return;
				}
				
				this.shoppingDialog.show = true
				this.shoppingProduct.product = product
				this.shoppingDialog.pic = this.shoppingProduct.product.pic;
				this.shoppingDialog.price = this.shoppingProduct.product.price;
				this.shoppingDialog.stock = this.shoppingProduct.product.stock;
				this.queryAttr(product.categoryId)
			},
			shoppingDialogClose(){//关闭购买商品页面
				this.shoppingProduct.radio = [];//清空选择项
				this.shoppingProduct.productSpecs = {};//清空真正要json的数据
				this.shoppingDialog.pic = null;
				this.shoppingDialog.price = null;
				this.shoppingDialog.stock = null;
				
			},
			queryAttr(categoryId){ //查询商品属性
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
				//属性按照中文排序
				var productSpecs = {};
				productSpecs.productId = this.shoppingProduct.product.id;
				
				// console.log(this.shoppingProduct)
				// this.shoppingProduct.productSpecs.productId = this.shoppingProduct.product.id;
			
				var attrs = this.shoppingProduct.productAttr;
				this.shoppingProduct.productSpecs[attrs[attrIndex].name] = this.shoppingProduct.radio[attrIndex];
				
				console.log(this.shoppingProduct.productSpecs)
				
				//排序
				Object.keys(this.shoppingProduct.productSpecs).sort().map(key => {
				  productSpecs[key]=this.shoppingProduct.productSpecs[key]
				})
				//alert(this.products[10].pic)
				//console.log(this.products[])
				this.$http.get('/stock/getStockBySpecs',
				{
					params: {
					  specs: JSON.stringify(productSpecs)
					}
				}).then(request => {
					if(request.data.data != null){
						//this.shoppingProduct.product.pic = request.data.data.pic;
						//this.shoppingProduct.product.name = "111111111"
						this.shoppingDialog.stockId = request.data.data.id;
						this.shoppingDialog.pic = request.data.data.pic;
						this.shoppingDialog.price = request.data.data.price;
						this.shoppingDialog.stock = request.data.data.stock;
						//alert(this.products[10].pic)
						//console.log(this.products)
					}
				})
			},
			addShoppingCart(){//确认加入购物车
				//判断是否登录
				var token = sessionStorage.getItem('token');
				this.$http.get('/api/userInfo/info?token='+token)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '403'){
						this.showLogin();
						return;
					}
				
					//判断选完属性了没
					if(this.shoppingProduct.productAttr.length != Object.keys(this.shoppingProduct.productSpecs).length){
						this.$message({
							type:"warning",
							message:"请选择商品属性"
						})
						return;
					}
					//判断商品数量是否为0
					if(this.shoppingDialog.stock == 0){
						this.$message({
							type:"warning",
							message:"库存不足,请选择其他商品"
						})
						return;
					}
					
					
					var data = {
						quantity:1, //数量
						price : this.shoppingDialog.price,//单价
						skuId : this.shoppingDialog.stockId ,//库存id
						userId : request.data.data.id ,//用户id
						orderId : 0 //订单id
					}
					this.$http.post('/api/cartItem',data)
					.then(result => {
						console.log(result.data)
						this.$message({
							message: result.data.msg,
							type: 'success'
						});
					})
					
				})
			
				
			}
			
		},
		data(){
			return {
				token:sessionStorage.getItem('token'),
				products:[],//商品信息
				
				shoppingDialog:{
					show : false,
					stockId : null,
					pic: null,
					price: null,
					stock: 0
				},
				shoppingProduct:{//购买的商品
					product:{
						pic:null
					},
					productAttr:[],//查询到的所有属性
					radio:[], //选择的所有属性值
					productSpecs:{} //最终要上传的json字符串值
				},
				isCar:0 //是否购物车
			};
		},
		inject:['showLogin'],
		
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

