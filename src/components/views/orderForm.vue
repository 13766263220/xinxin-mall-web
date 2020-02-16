<template>
	<div>
		<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
			<br />
			<div style="float: left;margin-left: 20px;">
				<i class="el-icon-location" style="margin-right: 5px;font-size: 20px;"></i>
				<span>我的订单</span>
			</div>
			<div style="float: left;margin-top: 30px;">
				<div style="margin-top:10px;">
					<el-badge :value="allOrderFormCount" class="item" style="margin-right: 20px;margin-top: -5px;margin-left: 30px;">
					  <el-button size="medium"  @click="queryOrderForm()">全部订单</el-button>
					</el-badge>
					<el-badge :value="awaitPaymentCount" class="item" style="margin-right: 20px;margin-top: -5px;margin-left: 30px;">
					  <el-button size="medium"  @click="queryOrderFormByStatus(0)">待付款</el-button>
					</el-badge>
					<el-badge :value="awaitShipmentsCount" class="item" style="margin-right: 20px;margin-top: -5px;margin-left: 30px;">
					  <el-button size="medium"  @click="queryOrderFormByStatus(1)">待发货</el-button>
					</el-badge>
					<el-badge :value="awaitTakeDeliveryOfGoodsCount" class="item" style="margin-right: 20px;margin-top: -5px;margin-left: 30px;">
					  <el-button size="medium"  @click="queryOrderFormByStatus(2)">待收货</el-button>
					</el-badge>
					<el-badge :value="afterSaleCount" class="item" style="margin-right: 20px;margin-top: -5px;margin-left: 30px;">
					  <el-button size="medium"  @click="queryOrderFormByStatus(3)">已收货</el-button>
					</el-badge>
				</div>
			</div>
			
			<br /><br /><br /><br /><br />
		</div>
		
		<!-- 订单 表格 start -->
		<div>
			<!-- 表格 start -->
			<el-table
			:data="orderForm"
			border
			align="center"
			style="width: 100%;border-radius: 10px"
			v-loading="orderTable.loading"
			ref="orderTable"
			>
				<el-table-column
				  prop="id"
				  label="编号"
				  width="80">
				</el-table-column>
				<el-table-column
				  prop="orderSn"
				  label="订单编号"
				  width="250">
				</el-table-column>
				<el-table-column
				  prop="createTime"
				  label="提交时间"
				  width="220">
				</el-table-column>
				<el-table-column
				  prop="userName"
				  label="用户账号"
				  width="150">
				</el-table-column>
				<el-table-column
				  prop="totalAmount"
				  label="订单金额"
				  width="120">
				  <template slot-scope="scope">
					<span>￥{{scope.row.totalAmount}}</span>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="payType"
				  label="支付方式"
				  width="140">
				  <template slot-scope="scope">
						<span v-if="scope.row.payType == 0">未支付</span>
						<span v-else-if="scope.row.payType == 1">支付宝</span>
						<span v-else-if="scope.row.payType == 2">微信</span>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="status"
				  label="订单状态"
				  width="140">
				  <template slot-scope="scope">
						<span v-if="scope.row.status == 0">待付款</span>
						<span v-else-if="scope.row.status == 1">待发货</span>
						<span v-else-if="scope.row.status == 2">待收货</span>
						<span v-else-if="scope.row.status == 3">已收货</span>
						<span v-else-if="scope.row.status == 4">已关闭</span>
				  </template>
				</el-table-column>
				<el-table-column
				  label="操作"
				  width="277">
				  <template slot-scope="scope">
						<el-button size="mini" @click="orderFormDialogShow(scope.row)">查看订单</el-button>
						<el-button size="mini" type="danger" @click="deleteOrderForm(scope.row.id)">删除订单</el-button>
				  </template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 订单 表格 end -->
		
		<el-dialog
			:title="orderFormDialog.title"
			:visible.sync="orderFormDialog.show"
			width="1000px"
			@close="orderFormDialogClose"
		>
			<el-steps :active="this.orderFormActive.active" align-center finish-status="success">
			  <el-step title="提交订单" :description="this.orderFormActive.createTime"></el-step>
			  <el-step title="支付订单" :description="this.orderFormActive.paymentTime"></el-step>
			  <el-step title="平台发货" :description="this.orderFormActive.deliveryTime"></el-step>
			  <el-step title="确认收货" :description="this.orderFormActive.receiveTime"></el-step>
			</el-steps>
			<br />
			<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
				
				<div style="background-color: #f2f6fc;width: 100%;height: 60px;">
					<br />
					<span style="font-size: 15px;float: left;margin-left: 30px;color: #f56c6c;">
						<span class="el-icon-warning"></span>
						<span>当前订单状态：</span>
						<span v-if="this.orderFormActive.active == 1">待付款</span>
						<span v-if="this.orderFormActive.active == 2">待发货</span>
						<span v-if="this.orderFormActive.active == 3">待收货</span>
						<span v-if="this.orderFormActive.active == 4">已收货</span>
					</span>
					<div style="float: right;margin-right: 30px;margin-top: -3px;">
						<el-button v-if="this.orderFormActive.active == 1" @click="paymentShow()" size="mini">订单付款</el-button>
						<el-button v-if="this.orderFormActive.active == 3" @click="confirmReceipt()" size="mini">确认收货</el-button>
						<el-button v-if="this.orderFormActive.active == 4" @click="colseOrderForm()" type="danger" size="mini">关闭订单</el-button>
						
					</div>
					
					<!-- 订单付款 对话框 start -->
					<el-dialog
						:title="paymentDialog.title"
						:visible.sync="paymentDialog.show"
						width="400px"
						@close="paymentDialogClose"
						append-to-body
					>	
						<el-radio-group v-model="paymentDialog.paymentTypeRadio">
						      <el-radio-button label="2">微信</el-radio-button>
						      <el-radio-button label="1">支付宝</el-radio-button>
						    </el-radio-group>
						<span slot="footer" class="dialog-footer" style="">
							<span style="font-size: 20px;margin-right: 10px;">金额：<span style="color: #f56c6c;">￥{{calculateTotalPricesAndCount}}</span> </span>
							<el-button type="primary" @click="payment()" size="mini">确认付款</el-button>
						</span>
					</el-dialog>
					<!-- 订单付款 对话框 end -->
				</div>
				<br />
				<div style="">
					<span style="font-size: 15px;float: left;margin-left: 30px;">
						<span class="el-icon-collection-tag"></span>
						<span>基本信息</span>
					</span>
					<br /><br />
					<div style="margin-left: 50px;margin-right: 50px;">
						<el-table
						  :data="orderFormDialog.orderFormBasic"
						  :header-cell-style="{background:'#eef1f6'}" 
						  border=""
						  >
						  <el-table-column
						    prop="orderSn"
						    label="订单编号"
						    width="200">
						  </el-table-column>
						  <el-table-column
						    prop="createTime"
						    label="提交时间"
						    width="180">
						  </el-table-column>
						  <el-table-column
						    prop="userName"
						    label="用户账号"
						    width="180">
						  </el-table-column>
						  <el-table-column
						    prop="totalAmount"
						    label="订单金额"
						    width="150">
						    <template slot-scope="scope">
						  	<span>￥{{scope.row.totalAmount}}</span>
						    </template>
						  </el-table-column>
						  <el-table-column
						    prop="payType"
						    label="支付方式"
						    width="147">
						    <template slot-scope="scope">
						  		<span v-if="scope.row.payType == 0">未支付</span>
						  		<span v-else-if="scope.row.payType == 1">支付宝</span>
						  		<span v-else-if="scope.row.payType == 2">微信</span>
						    </template>
						  </el-table-column>
						</el-table>
					</div>
					<br />
					<span style="font-size: 15px;float: left;margin-left: 30px;">
						<span class="el-icon-collection-tag"></span>
						<span>收货人信息</span>
					</span>
					<br /><br />
					<div style="margin-left: 50px;margin-right: 50px;">
						<el-table
						  :data="orderFormDialog.userInfo"
						  :header-cell-style="{background:'#eef1f6'}" 
						  border=""
						  >
						  <el-table-column
							prop="name"
							label="收货人"
							width="250">
						  </el-table-column>
						  <el-table-column
							prop="phone"
							label="手机号码"
							width="250">
						  </el-table-column>
						  <el-table-column
							prop="address"
							label="收货地址"
							width="357">
						  </el-table-column>
						</el-table>
					</div>
					<br />
					<span style="font-size: 15px;float: left;margin-left: 30px;">
						<span class="el-icon-collection-tag"></span>
						<span>商品信息</span>
					</span>
					<br /><br />
					<div style="margin-left: 50px;margin-right: 50px;">
						<el-table
						  :data="orderFormDialog.productList"
						  :header-cell-style="{background:'#eef1f6'}" 
						  border=""
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
						    label="类型/品牌"
						    width="157">
						    <template slot-scope="scope">
								类型：<span>{{scope.row.product.productCategory.parentCategoryName}}/{{scope.row.product.productCategory.name}}</span>
								<br />
								品牌：<span>{{scope.row.product.productBrand.name}}</span>
							</template>
						  </el-table-column>
						  
						  
						  <el-table-column
						    label="属性"
						    width="160">
							<template slot-scope="scope">
								<div v-for="(specs,key,index) in JSON.parse(scope.row.productStock.productSpecs)">
									<span v-if="index != 0">
										{{key}}：{{specs}}
									</span>
									
								</div>
							</template>
						  </el-table-column>
						  
						  <el-table-column
						    label="价格"
						    width="100">
						    <template slot-scope="scope">
						  	  <span>￥{{scope.row.cartItem.price}}</span>
							  <span style="margin-left: 1px;">/</span>
							  <span>{{scope.row.product.unit}}</span>
						    </template>
						  </el-table-column>
						  <el-table-column
						    label="商品数量"
						    width="80">
							<template slot-scope="scope">
								<span>{{scope.row.cartItem.quantity}}</span>
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
						<br />
						<span style="float: right;font-size: 20px;">合计：<span style="color: #f56c6c;">￥{{calculateTotalPricesAndCount}}</span> </span>
					</div>
				</div>
				
				
				<br /><br />
			</div>
			
			
			
		</el-dialog>
		
		
	</div>
</template>

<script>
	export default{
		mounted() {
			this.queryOrderForm();
		},
		methods:{
			queryOrderForm(){//查询用户所有订单信息
				var token = sessionStorage.getItem('token');
				this.$http.get('/api/userInfo/info?token='+token)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '403'){//判断是否登录
						this.showLogin();
						return;
					}
					this.userInfo = request.data.data;
					
					//查询该用户所有订单
					this.orderTable.loading = true;
					this.$http.get('/order/getByPhone',{
						params: {
						  phone: this.userInfo.phone
						}
					})
					.then(result => {
						console.log(result.data)
						if(result.data.code == '200'){
							this.orderFormList = result.data.data;
							this.orderForm = this.orderFormList;
						}
					})
					.catch(error => {
						//弹出消息框
						this.$message({
							message: '服务器异常',
							type: 'error'
						});
					})
					.finally(() => {
						this.orderTable.loading = false;
					});
				})
			},
			computeOrderFormCount(status){//计算订单数量
				var count = 0;
				for(var i in this.orderFormList){
					if(this.orderFormList[i].status == status){
						count ++;
					}
				}
				if(count == 0){
					return null;
				}
				return count;
			},
			queryOrderFormByStatus(status){//按照订单状态查询订单信息
				var token = sessionStorage.getItem('token');
				this.$http.get('/api/userInfo/info?token='+token)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '403'){//判断是否登录
						this.showLogin();
						return;
					}
					this.userInfo = request.data.data;
					
					//查询该用户所有订单
					this.orderTable.loading = true;
					this.$http.get('/order/getByPhoneAndStatus',{
						params: {
						  phone: this.userInfo.phone,
						  status : status
						}
					})
					.then(result => {
						console.log(result.data)
						if(result.data.code == '200'){
							this.orderForm = result.data.data;
						}
					})
					.catch(error => {
						//弹出消息框
						this.$message({
							message: '服务器异常',
							type: 'error'
						});
					})
					.finally(() => {
						this.orderTable.loading = false;
					});
				})
			},
			deleteOrderForm(){//删除订单
				
			},
			orderFormDialogClose(){//关闭订单对话框
				this.orderFormDialog.userInfo = [] 
				this.orderFormDialog.orderFormBasic = []

				//清空时间
				this.orderFormActive.createTime = null
				this.orderFormActive.paymentTime = null
				this.orderFormActive.deliveryTime = null
				this.orderFormActive.receiveTime = null

			},
			orderFormDialogShow(orderForm){//打开订单对话框
				this.orderFormDialog.show = true;
				
				
				//订单基本星系
				this.orderFormDialog.orderFormBasic.push(orderForm);
				
				
				//添加用户信息
				this.orderFormDialog.userInfo.push({
					name : orderForm.receiverName ,//收货人姓名
					phone : orderForm.receiverPhone,//电话
					address : orderForm.receiverDetailAddress//收货地址
				})
				
				//查询商品信息
				this.$http.get('/api/cartItem',{
					params:{
						orderId:orderForm.id
					}
				}).then(request => {
					console.log(request.data)
					if(request.data.code =='200'){
						this.orderFormDialog.productList = request.data.data
					}
				})
				
				
				if(orderForm.status == 0){//提交订单
					this.orderFormActive.active = 1;
				}else if(orderForm.status == 1){//订单支付
					this.orderFormActive.active = 2;
				}else if(orderForm.status == 2){//平台发货
					this.orderFormActive.active = 3;
				}else if(orderForm.status == 3){//确认收货
					this.orderFormActive.active = 4;
				}else if(orderForm.status == 4){//已关闭
					this.orderFormActive.active = 4
				}
				//时间
				this.orderFormActive.createTime = orderForm.createTime
				this.orderFormActive.paymentTime = orderForm.paymentTime
				this.orderFormActive.deliveryTime = orderForm.deliveryTime
				this.orderFormActive.receiveTime = orderForm.receiveTime
				
				
			},
			paymentShow(){//打开订单付款对话框
				this.paymentDialog.show = true;
			},
			paymentDialogClose(){//关闭订单付款对话框
				this.paymentDialog.paymentTypeRadio = 2;
			},
			payment(){//确认付款
				var data = this.orderFormDialog.orderFormBasic[0];
				console.log(data)
				//修改支付方式
				data.payType = this.paymentDialog.paymentTypeRadio;
				//修改订单状态
				data.status = 1;//待发货
				this.$http.put('/order/editOrderInfo',data)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '200'){
						this.$message({
							message: '支付成功',
							type: 'success'
						});
						//关闭支付对话框
						this.paymentDialog.show = false;
						//关闭订单对话框
						this.orderFormDialog.show = false;
						//刷新一遍
						this.queryOrderForm();
					}
				})
			},
			confirmReceipt(){//确认收货
				var data = this.orderFormDialog.orderFormBasic[0];
				//修改订单状态
				data.status = 3;//确认收货
				this.$http.put('/order/editOrderInfo',data)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '200'){
						this.$message({
							message: '收货成功',
							type: 'success'
						});
						//关闭支付对话框
						this.paymentDialog.show = false;
						//关闭订单对话框
						this.orderFormDialog.show = false;
						//刷新一遍
						this.queryOrderForm();
					}
				})
			},
			colseOrderForm(){//关闭订单
				var data = this.orderFormDialog.orderFormBasic[0];
				//修改订单状态
				data.status = 4;//确认收货
				this.$http.put('/order/editOrderInfo',data)
				.then(request => {
					console.log(request.data)
					if(request.data.code == '200'){
						this.$message({
							message: '订单已关闭',
							type: 'success'
						});
						//关闭支付对话框
						this.paymentDialog.show = false;
						//关闭订单对话框
						this.orderFormDialog.show = false;
						//刷新一遍
						this.queryOrderForm();
					}
				})
			}
		},
		data(){
			return{
				userInfo:{},//用户信息
				orderForm:[], //订单信息(暂存)
				orderFormList:[],//订单所有信息（长期存放）
				orderTable:{
					loading:false //订单表格是否在加载中
				},
				orderFormDialog:{ //订单对话框信息
					title:'订单信息',
					show:false,
					orderFormBasic:[],//订单基本信息
					userInfo:[],//收货人信息
					productList:[] //商品信息
				},
				orderFormActive:{ //订单步骤
					active:0, //第几步
					createTime:null ,//提交订单时间
					paymentTime:null,//支付时间
					deliveryTime:null,//发货时间
					receiveTime:null //确认收货时间
				},
				paymentDialog:{
					title:'付款',
					show:false,
					paymentTypeRadio:2 //付款方式 1支付宝 2微信
				}
				
			};
		},
		computed: {
			allOrderFormCount:function(){//所有订单数量
				// if(this.orderFormList.length == 0){
				// 	return null;
				// }
				// return this.orderFormList.length;
				return null;
			},
			awaitPaymentCount:function(){//等待付款数量
				return this.computeOrderFormCount(0);
			},
			awaitShipmentsCount:function(){//等待发货数量
				return this.computeOrderFormCount(1);
			},
			awaitTakeDeliveryOfGoodsCount:function(){//等待收货数量
				return this.computeOrderFormCount(2);
			},
			afterSaleCount:function(){//已收货数量
				return this.computeOrderFormCount(3);
			},
			calculateTotalPricesAndCount:function(){//计算商品总价
				if(this.orderFormDialog.productList.length == 0){
					return null;
				}
				
				var totalPrices = 0;
				for(var i in this.orderFormDialog.productList){
					totalPrices += this.orderFormDialog.productList[i].cartItem.price * this.orderFormDialog.productList[i].cartItem.quantity;
				}
				return totalPrices;
			}
			
		},
		inject:['showLogin']
	}
</script>

<style>
	.el-table td,.el-table th{
		text-align: center !important;/* table里子居中 */
	}
</style>
