<template>
	<div>
		<el-table
		      :data="cartItems"
		      style="width: 100%"
			  @selection-change="handleSelectionChange"
			  ref="singleTable"
			  >
			  <el-table-column
			        type="selection"
			        width="55">
			  </el-table-column>
			  <el-table-column
			    prop="productStock.id"
			    label="商品编号"
			    width="80">
			  </el-table-column>
			  
			  <el-table-column
			    label="图片"
			    width="100">
				<template slot-scope="scope">
					<div class="block">
						<el-image 
						:src="scope.row.productStock.pic"
						style="width: 80px;height: 80px;"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline" style="font-size: 80px;"></i>
							</div>
						</el-image>
					</div>
				</template>
			  </el-table-column>
			  
		      <el-table-column
		        prop="product.name"
		        label="商品名称"
		        width="180">
		      </el-table-column>
			  
			  <el-table-column
			    label="类型"
			    width="120">
			    <template slot-scope="scope">
			  	  <span>{{scope.row.product.productCategory.parentCategoryName}}/{{scope.row.product.productCategory.name}}</span>
			    </template>
			  </el-table-column>
			  <el-table-column
			    label="品牌"
			    width="100">
				<template slot-scope="scope">
					<div class="block">
						<el-image 
						:src="scope.row.product.productBrand.logo"
						style="width: 80px;height: 80px;"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline" style="font-size: 80px;"></i>
							</div>
						</el-image>
						<div>{{scope.row.product.productBrand.name}}</div>
					</div>
				</template>
			  </el-table-column>
			  
			  <el-table-column
			    label="规格"
			    width="180">
				<template slot-scope="scope">
					<div v-for="(specs,key,index) in JSON.parse(scope.row.productStock.productSpecs)">
						<span v-if="index != 0">
							{{key}}：{{specs}}
						</span>
						
					</div>
				</template>
			  </el-table-column>
			  
			  <el-table-column
			    label="单价"
			    width="80">
			    <template slot-scope="scope">
			  	  <span>￥{{scope.row.cartItem.price}}</span>
				  <span style="margin-left: 1px;">/</span>
				  <span>{{scope.row.product.unit}}</span>
			    </template>
			  </el-table-column>
			  <el-table-column
			    label="商品数量"
			    width="200">
				<template slot-scope="scope">
					<el-input-number size="mini" v-model="scope.row.cartItem.quantity" @change="quantityChange(scope.row,scope.$index)" :min="0" :max="scope.row.productStock.stock" label="描述文字"></el-input-number>
					
				</template>
			  </el-table-column>
			  <el-table-column
			    label="小计"
			    width="80">
			    <template slot-scope="scope">
			  	  <span>￥{{scope.row.cartItem.price * scope.row.cartItem.quantity}}</span>
			    </template>
			  </el-table-column>
			  <el-table-column
			    label="操作"
			    width="80">
			    <template slot-scope="scope">
					<el-button @click="deleteItem(scope.row)" type="warning" size="mini">删除</el-button>
				</template>
			  </el-table-column>
		    </el-table>
			<div style="position: fixed;top: 630px;width: 100%;background-color: lightgoldenrodyellow;">
				<div style="float: right; margin-right: 50px;">
					<span>合计：<span style="color: #F02D2D;">￥{{totalPrices}}</span> </span>
					<el-button @click="settleAccounts()" style="margin-left: 10px;">结算</el-button>
				</div>
			</div>
			
			<div>
		<!-- 提交订单 start -->
		<el-dialog
			:title="orderFormDialog.title"
			:visible.sync="orderFormDialog.show"
			width="1000px"
			@close="orderFormDialogClose"
		>
			<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
				<br />
				<div style="float: left;margin-left: 20px;">
					<i class="el-icon-location" style="margin-right: 5px;font-size: 20px;"></i>
					<span>{{userInfo.name}}</span>
					<span>{{userInfo.phone}}</span>
				</div>
				<br />
				<div style="float: left;margin-left: -172px;">
					<span style="position: relative;left: 35px;">{{userInfo.address}}</span>
				</div>
				<el-button size="small" style="float: right;margin-right: 20px;margin-top: -15px;" @click="editAddressShow()">修改收货地址</el-button>
				<br /><br />
			</div>
			<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
				<el-table
				      :data="selectionCartItems"
				      style="width: 100%"
					  >
					  <el-table-column
					    label="图片"
					    width="100">
						<template slot-scope="scope">
							<div class="block">
								<el-image 
								:src="scope.row.productStock.pic"
								style="width: 80px;height: 80px;"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline" style="font-size: 80px;"></i>
									</div>
								</el-image>
							</div>
						</template>
					  </el-table-column>
					  
				      <el-table-column
				        prop="product.name"
				        label="商品名称"
				        width="180">
				      </el-table-column>
					  
					  <el-table-column
					    label="类型"
					    width="100">
					    <template slot-scope="scope">
					  	  <span>{{scope.row.product.productCategory.parentCategoryName}}/{{scope.row.product.productCategory.name}}</span>
					    </template>
					  </el-table-column>
					  <el-table-column
					    label="品牌"
					    width="100">
						<template slot-scope="scope">
							<div class="block">
								<div>{{scope.row.product.productBrand.name}}</div>
							</div>
						</template>
					  </el-table-column>
					  
					  <el-table-column
					    label="规格"
					    width="110">
						<template slot-scope="scope">
							<div v-for="(specs,key,index) in JSON.parse(scope.row.productStock.productSpecs)">
								<span v-if="index != 0">
									{{key}}：{{specs}}
								</span>
								
							</div>
						</template>
					  </el-table-column>
					  
					  <el-table-column
					    label="单价"
					    width="80">
					    <template slot-scope="scope">
					  	  <span>￥{{scope.row.cartItem.price}}</span>
						  <span style="margin-left: 1px;">/</span>
						  <span>{{scope.row.product.unit}}</span>
					    </template>
					  </el-table-column>
					  <el-table-column
					    label="商品数量"
					    width="200">
						<template slot-scope="scope">
							<el-input-number size="mini" v-model="scope.row.cartItem.quantity" @change="quantityChange(scope.row,scope.$index)" :min="0" :max="scope.row.productStock.stock" label="描述文字"></el-input-number>
						</template>
					  </el-table-column>
					  <el-table-column
					    label="小计"
					    width="80">
					    <template slot-scope="scope">
					  	  <span>￥{{scope.row.cartItem.price * scope.row.cartItem.quantity}}</span>
					    </template>
					  </el-table-column>
					  
				    </el-table>
			</div>
			<div>
				<el-input
				  type="textarea"
				  :autosize="{ minRows: 2, maxRows: 4}"
				  placeholder="订单备注"
				  v-model="orderInfo.note">
				</el-input>
			</div>
			
			<span slot="footer" class="dialog-footer">
				<span style="color: #999999">共{{orderProductCount}}件，</span>
				<span style="margin-right: 20px;">合计：<span style="color: #F02D2D;">￥{{totalPrices}}</span></span>
				<el-button type="primary" @click="submitOrder()">提交订单</el-button>
			</span>
			
			<el-dialog
				:title="editAddressDialog.title"
				:visible.sync="editAddressDialog.show"
				width="300px"
				append-to-body
			>
				<div style="position: relative;top: -20px;margin-bottom: -50px;">
					<el-input v-model="editAddressDialog.address"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" size="mini" @click="editAddress()">确认</el-button>
				</span>
				
				
			</el-dialog>
			
		</el-dialog>
		<!-- 提交订单 end -->
		</div>
	</div>
</template>

<script>
	export default {
		mounted(){
			//alert("购物车")
			//this.isDoLogin()
			this.queryCartItem()
		},
		methods:{
			// isDoLogin(){//判断用户是否在线
			// 	var token = sessionStorage.getItem("token");
			// 	alert(this.$qs.stringify({token:token}))
			// 	this.$http.post('/api/userInfo/isDoLogin',this.$qs.stringify({token:token}))
			// 	.then(request =>{
			// 		console.log(request.data)
			// 		if(request.data.code == '403'){
			// 			this.showLogin();//打开登录界面
			// 		}
			// 	})
			// },
			queryCartItem(){//查询用户的购物车
				var token = sessionStorage.getItem('token');
				this.$http.get('/api/userInfo/info?token='+token)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '403'){//判断是否登录
						this.showLogin();
						return;
					}
					this.userInfo = request.data.data;
					this.$http.get('/api/cartItem/'+this.userInfo.id)
					.then(result => {
						console.log(result.data)
						if(result.data.code == '200'){
							this.cartItems = result.data.data;
						} 
						
					})
				})
			
				
			},
			deleteItem(value){//删除购物车项
				var data = value.cartItem;
				this.$http.delete('/api/cartItem/'+data.id)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '200'){
						this.queryCartItem();
					}
				})
			},
			quantityChange(value,row){ //数量发生改变
				if(value.cartItem.quantity == null){
					this.$message({
						type:'error',
						message:'数量不可为空'
					})
					value.cartItem.quantity = 1;
				}
				var data = value.cartItem;
				if(value.cartItem.quantity == 0){
					this.$http.delete('/api/cartItem/'+data.id)
					.then(request => {
						console.log(request.data)
						if(request.data.code == '200'){
							this.queryCartItem();
						}
					})
					return;
				}
				
				
				this.$http.put('/api/cartItem',data)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '200'){
						for (var i = 0; i < this.selectionCartItems.length; i++) {
							if(value.cartItem.id == this.selectionCartItems[i].cartItem.id){
								this.selectionCartItems[i].cartItem = request.data.data;
								//计算总价
								this.calculateTotalPricesAndCount(this.selectionCartItems);
								return;
							}
						}
						
						
					}
				})
				
			},
			handleSelectionChange(values){//选勾上
				this.selectionCartItems = values;
				this.calculateTotalPricesAndCount(values);
			},
			calculateTotalPricesAndCount(values){//计算总价 与数量
				//计算总价
				var totalPrices = 0;
				var orderProductCount = 0;
				for(var i in values){
					totalPrices += values[i].cartItem.price * values[i].cartItem.quantity;
					orderProductCount += values[i].cartItem.quantity;
				}
				this.totalPrices = totalPrices;
				this.orderProductCount = orderProductCount;
			},
			settleAccounts(){//结算
				if(this.selectionCartItems.length == 0){
					this.$message({
						type:"warning",
						message:"请选择结算商品"
					})
					return;
				}
				for(var i in this.selectionCartItems){
					if(this.selectionCartItems[i].cartItem.quantity == 0){
						this.$message({
							type:"warning",
							message:"商品数量不可为0"
						})
						return;
					}
				}
				
				this.orderFormDialog.show = true;
			},
			orderFormDialogClose(){//关闭确认订单模态框
				this.orderInfo.note = null //订单备注清空
			},
			editAddressShow(){//修改收货地址
				this.editAddressDialog.show = true;
				this.editAddressDialog.address = this.userInfo.address;
			},
			editAddress(){//确认修改地址
				this.userInfo.address = this.editAddressDialog.address;
				this.editAddressDialog.show = false;
			},
			submitOrder(){//提交订单
				var cartItems = [];//所有购物车项
				for(var i in this.selectionCartItems){
					cartItems.push(this.selectionCartItems[i].cartItem)
				} 
				var data={
					orderInfo:{
						userName:this.userInfo.phone, //用户账号（也是电话号码）
						totalAmount:this.totalPrices, //订单总价
						payType : 0, //支付方式（0未支付，1支付宝，2微信）
						status : 0 ,//订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单
						receiverName : this.userInfo.name,//收货人姓名
						receiverPhone : this.userInfo.phone,//收货人电话
						receiverDetailAddress : this.userInfo.address, //收货人地址
						note : this.orderInfo.note, // 订单备注
						confirmStatus : 0 //确认收货状态 0->未确认 1->确认
					},
					cartItems:cartItems
				};
				this.$http.post('/order/addOrderInfo',data)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '200'){
						this.$message({
							type:"success",
							message:"添加订单成功"
						})
						this.orderFormDialog.show = false; //关闭订单框
						this.selectionCartItems = []; //清空选中项
						this.queryCartItem(); //重新查询购物车信息
					}
				})
			}
		},
		data(){
			return {
				cartItems: [], //商品信息 表格数据
				userInfo:{}, //用户信息
				totalPrices:0, //总价
				orderProductCount:0, //订单商品数量
				selectionCartItems:[], //选择的所有商品信息
				orderFormDialog:{//订单模态框
					title:'确认订单',
					show:false
				},
				editAddressDialog:{ //修改商品收货地址
					title:'收货地址:',
					show:false,
					address:null
				},
				orderInfo:{
					note:null
				}
		    }
		},
		inject:['showLogin'],
	}
</script>

<style>
	.el-table td,.el-table th{
		text-align: center !important;/* table里子居中 */
	}
</style>
