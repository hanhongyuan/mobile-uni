<template>
	<view>
		<view class="block">
			<view class="content">
				<view class="orderinfo">
					<view class="row">
						<view class="nominal">订单编号:</view><view class="text">{{orderInfo.orderSn}}</view>
					</view>
					<view class="row">
						<view class="nominal">订单金额:</view><view class="text">{{orderInfo.payAmount}}元</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">
					<view class="row" @tap="payType='1'">
							<view class="left">
								<image src="/static/img/alipay.png"></image>
							</view>
							<view class="center">
								支付宝支付
							</view>
							<view class="right">
								<radio :checked="payType=='1'" color="#f06c7a" />
							</view>
					</view>
					<view class="row" @tap="paytype='2'">
							<view class="left">
								<image src="/static/img/wxpay.png"></image>
							</view>
							<view class="center">
								微信支付
							</view>
							<view class="right">
								<radio :checked="payType=='2'" color="#f06c7a" />
							</view>
					</view>
					<view class="row" @tap="payType='3'">
                    							<view class="left">
                    								<image src="/static/img/wxpay.png"></image>
                    							</view>
                    							<view class="center">
                    								余额支付
                    								<text>可用余额 ¥{{orderInfo.blance}}</text>
                    							</view>
                    							<view class="right">
                    								<radio :checked="payType=='3'" color="#f06c7a" />
                    							</view>
                    					</view>
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" @tap="doDeposit">立即支付</view>
			<view class="tis">
				点击立即支付，即代表您同意<view class="terms">
					《条款协议》
				</view>
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
				amount:0,
				orderName:'',
                id:0,
				payType: 3,
                				orderInfo: {}
			};
		},
		   async onLoad(options) {
		   this.id = options.id;
                    let params = {'id':options.id};
                    this.orderInfo = await Api.apiCall('get',Api.order.orderDetail,params);
        		},
		methods:{
		async	doDeposit(){
			  if (this.payType ==2){
                                /**
                                 * 微信小程序支付,仅支持微信支付(后续可能集成网页支付宝支付web-view)
                                 *
                                 * @param : provider(String) ->付款商家
                                 * @param : timeStamp(String) ->时间戳(当前支付时间)
                                 * @param : nonceStr(String) ->支付密匙
                                 * @param : packages(String) ->支付id
                                 * @param : signType(String) ->加密方式(默认MD5)
                                 * @param : paySign(String)
                                 *
                                 *
                                 *
                                 * 小程序支付调用
                                 *
                                 * wePay(provider, timeStamp, nonceStr, packages, signType, paySign,res=>{},fail=>{})
                                 */


                                let params = {'orderId':this.orderInfo.id};
                                let res = await Api.apiCall('get',Api.order.weixinAppletPay,params);
                                console.log(res);
                                if (res) {
                                    uni.requestPayment({
                                        timeStamp: res.timeStamp,
                                        nonceStr: res.nonceStr,
                                        package: res.package,
                                        signType: res.signType,
                                        paySign: res.paySign,
                                        success(datas) {
                                            console.log(datas);
                                            uni.redirectTo({
                                               url:'/pages/pay/success/success?id='+this.id
                                            })
                                        },
                                        fail(err) {
                                        uni.showToast({title: JSON.stringify(err),icon:"none"});

                                        }
                                    });

                                }else {
                                uni.showToast({title:res,icon:"none"});

                                }
                            }else if (this.payType ==3){
                                let params1 = {'payAmount':this.orderInfo.payAmount,'balance':userInfo.blance,'orderId':this.orderInfo.id};
                                let data1 = await Api.apiCall('post',Api.order.balancePay,params1);
                                 console.log(data1);
                                if (data1) {
                                    uni.redirectTo({
                                       url:'/pages/pay/success/success?id='+this.id
                                    })
                                }else {
                                   uni.showToast({title: data1,icon:"none"});
                                }
                            }


			}
		}
	}
</script>

<style lang="scss">
.block{
		width: 94%;
		padding: 0 3% 40upx 3%;
		.title{
			width: 100%;
			font-size: 34upx;
		}
		.content{
			.orderinfo{
				width: 100%;
				border-bottom: solid 1upx #eee;
				.row{
					width: 100%;
					height: 90upx;
					display: flex;
					align-items: center;
					.nominal{
						flex-shrink: 0;
						font-size: 32upx;
						color: #7d7d7d;
					}
					.text{
						width: 70%;
						margin-left: 10upx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						font-size: 32upx;
					}
				}
			}
			.pay-list{
				width: 100%;
				border-bottom: solid 1upx #eee;
				.row{
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;
					.left{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;
						image{
							width: 80upx;
							height: 80upx;
						}
					}
					.center{
						width: 100%;
						font-size: 30upx;
					}
					.right{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}
	.pay{
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.btn{
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #f06c7a;
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.2);
		}
		.tis{
			margin-top: 10upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;
			.terms{
				color: #5a9ef7;
			}
		}
	}
</style>
