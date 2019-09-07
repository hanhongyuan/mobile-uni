<template>
	<view>
		<!-- 收货地址 -->
		<view class="addr" @tap="selectAddress">
			<view class="icon">
				<image src="../../static/img/addricon.png" mode=""></image>
			</view>
			<view class="right">
				<view class="tel-name">
					<view class="name">
						{{addressData.name}}
					</view>
					<view class="tel">
						{{addressData.phoneNumber}}
					</view>
				</view>
				<view class="addres">
					{{addressData.detailAddress}} {{addressData.region}}
				</view>
			</view>
		</view>
		<!-- 购买商品列表 -->
		<view class="buy-list">
			<view class="row" v-for="(row,index) in cartPromotionItemList" :key="index">
				<view class="goods-info">
					<view class="img">
						<image :src="row.productPic"></image>
					</view>
					<view class="info">
						<view class="title">{{row.productName}}</view>
						<view class="spec">选择{{row.productAttr}} 数量:{{row.quantity}}</view>
						<view class="price-number">
							<view class="price">￥{{row.price*row.quantity}}</view>
							<view class="number">
								
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 提示-备注 -->
		<view class="order">
			<view class="row">
				<view class="left">
					积分 :
				</view>
				<view class="right">
					已扣除0积分抵扣{{deduction|toFixed}}元
				</view>
			</view>
			<view class="row">
				<view class="left">
					备注 :
				</view>
				<view class="right">
					<input placeholder="选填,备注内容" v-model="desc" />
				</view>
			</view>
		</view>
		<!-- 明细 -->
		<view class="detail">
			<view class="row">
				<view class="nominal">
					商品金额
				</view>
				<view class="content">
					￥{{calcAmount.totalAmount|toFixed}}
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					运费
				</view>
				<view class="content">
					￥+{{freight|toFixed}}
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					积分抵扣
				</view>
				<view class="content">
					￥-{{deduction|toFixed}}
				</view>
			</view>
		</view>
		<view class="blck">
			
		</view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{calcAmount.payAmount|toFixed}}</view></view>
				<view class="btn" @tap="toPay">提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
import Api from '@/common/api';
 let userInfo = uni.getStorageSync('userInfo');
	export default {
		data() {
			return {
			freight:0,
			deduction:0,
			desc: '', //备注
            				payType: 1, //1微信 2支付宝
            				type:1,
            				groupType:'',
            				goodsId:0,
            				mgId:1,
            				cartId:'',
                            cartIds:'',
                            addressId:'',
                            couponId:'',
            				memberReceiveAddressList: [],
            				cartPromotionItemList: [],
            				calcAmount:{
                                totalAmount: 0,
                                freightAmount: 0,
                                promotionAmount: 0,
                                payAmount: 0
                            },
            				couponList: [

            				],
            				addressData: {
                                name: null,
                                phoneNumber: '',
                                detailAddress: '',
                                region: ''
                            }
			};
		},
		onShow() {
			//页面显示时，加载订单信息

		},
		onHide() {
			
		},
		async onLoad(option){
                let data ;

                if(option.groupType && option.groupType!=undefined){
                this.groupType = option.groupType;
                this.goodsId = option.id;
                this.mgId=option.mgid;
                    if(undefined==option.groupId){
                    option.groupId=0;
                    }
                	if(option.skuId){
                					 let params = {'groupId':option.groupId,'goodsId':option.id,'skuId':option.skuId,'memberId':userInfo.id};
                                       data = await Api.apiCall('post',Api.order.addGroup,params);

                				}else{
                					let params = {'groupId':option.groupId,'goodsId':option.id,'memberId':userInfo.id};
                                      data = await Api.apiCall('post',Api.order.addGroup,params);


                				}
                }else{
                if(option.type==1) {
                                this.cartId = option.id;
                                let params = {'groupId':0,'cartId':option.id,'type':option.type};
                                 data = await Api.apiCall('get',Api.order.preOrder,params);
                            }else if(option.type==2){
                                let params = {'groupId':0,'cartIds':option.cartIds,'type':option.type};
                                 data = await Api.apiCall('get',Api.order.preOrder,params);
                                this.cartIds = option.cartIds;
                			}
                }

        		        this.type = option.type;
                        if(data){
                        this.addressData=data.address;
                                				if(this.addressData){
                                                    this.addressId =this.addressData.id;
                                				}

                                				this.couponList=data.couponHistoryDetailList;
                                				this.memberReceiveAddressList=data.memberReceiveAddressListaddress;
                                				this.cartPromotionItemList=data.cartPromotionItemList;
                                				this.calcAmount=data.calcAmount;
                        }else{
                           uni.showToast({title: '订单已提交',icon:"none"});
                           	setInterval(() => {
                           	 uni.switchTab({
                                                                                           url: '/pages/tabBar/home/home'
                                                                                       })
                           	}, 1000);

                        }

        		},
		onBackPress() {
			//页面后退时候，清除订单信息
			// this.clearOrder();
		},
		filters: {
			toFixed:function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		methods: {

		async	toPay(){
				//商品列表
				 let data;
                                if(!this.addressId){
                                    this.$api.msg('请选择收货地址');
                                    return;
                                }

                                  if(this.groupType){
                                  if(!this.mgId){
                                    this.mgId=1;
                                  }

                                    let params = {mgId:this.mgId,groupType:this.groupType,'type':1,'goodsId':this.goodsId,'addressId':this.addressId,'couponId':this.couponId,
                                                    						'memberId':userInfo.id,'content':this.desc};
                                                                        data = await Api.apiCall('post',Api.order.acceptGroup,params);
                                  }else{
                                  if(this.type==1){
                                                      let params = {'type':1,'cartId':this.cartId,'addressId':this.addressId,'couponId':this.couponId,
                                  						'memberId':userInfo.id,'content':this.desc};
                                                      data = await Api.apiCall('post',Api.order.bookOrder,params);
                                  				}
                                                  if(this.type==2){
                                                      let params = {'type':2,'cartIds':this.cartIds,'addressId':this.addressId,'couponId':this.couponId,
                                                          'memberId':userInfo.id,'content':this.desc};
                                                      data = await Api.apiCall('post',Api.order.bookOrder,params);
                                                  }
                                  }


                                if (data && data.order) {
                                    let id = data.order.id;
                                    let url =`/pages/pay/payment/payment?id=${id}`;


                                    uni.navigateTo({
                                        url: url
                                    })
                                }else {
                                  	uni.showToast({title: data,icon:"none"});
                				}


				
			},
			//选择收货地址
			selectAddress(){
				uni.navigateTo({
					url:'/pages/user/address/address?type=select'
				})
			}
		}
	}
</script>

<style lang="scss">
.addr{
	width: 86%;
	padding: 20upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	display: flex;
	.icon{
		width: 80upx;
		height: 80upx;
		display: flex;
		align-items: center;
		image{
			width: 60upx;
			height: 60upx;
		}
	}
	.tel-name{
		width: 100%;
		display: flex;
		font-size: 32upx;
		.tel{
			margin-left: 40upx;
		}
	}
	.addres{
		width: 100%;
		font-size: 26upx;
		color: #999;
	}
}
.buy-list{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		margin: 30upx 0;
		.goods-info{
			width: 100%;
			display: flex;
			.img{
				width: 22vw;
				height: 22vw;
				border-radius: 10upx;
				overflow: hidden;
				flex-shrink: 0;
				margin-right: 10upx;
				image{
					width: 22vw;
					height: 22vw;
				}
			}
			.info{
				width: 100%;
				height: 22vw;
				overflow: hidden;
				display: flex;
				flex-wrap: wrap;
				position: relative;
				.title{
					width: 100%;
					font-size: 28upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					// text-align: justify;
					overflow: hidden;
				}
				.spec{
					font-size: 22upx;
					background-color: #f3f3f3;
					color: #a7a7a7;
					height: 40upx;
					display: flex;
					align-items: center;
					padding: 0 10upx;
					border-radius: 20upx;
					margin-bottom: 20vw;
				}
				.price-number{
					position: absolute;
					width: 100%;
					bottom: 0upx;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					font-size: 28upx;
					height: 40upx;
					.price{
						color: #f06c7a;
					}
					.number{
						display: flex;
						justify-content: center;
						align-items: center;
						
					}
				}
			}
		}
	}
}
.order{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		margin: 20upx 0;
		height: 40upx;
		display: flex;
		.left{
			font-size: 28upx;
		}
		.right{
			margin-left: 40upx;
			font-size: 26upx;
			color: #999;
			input{
				font-size: 26upx;
				color: #999;
			}
		}
	}
}
.blck{
	width: 100%;
	height: 100upx;
}
.footer{
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;
		
		.settlement{
			width: 80%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum{
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				.money{
					font-weight: 600;
				}
			}
			.btn{
				padding: 0 30upx;
				height: 60upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}
.detail{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.nominal{
			font-size: 28upx;
		}
		.content{
			font-size: 26upx;
			color: #f06c7a;
		}
	}
}
</style>
