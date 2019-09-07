import store from '../store/index';
export default {

      BASEURI:'http://www.yjlive.cn:8085/api/',
    //  BASEURI:'http://localhost:8085/api/',
     ESURI:'http://localhost:8081/api/',

     es: {
      searchList: 'search',
     },
	/**
	 * 接口名称
	 */
	index: {
        appletLogin_by_weixin: 'applet/login_by_weixin', 		// 登录(手机号:phone 密码:password)
		login: 'single/home/login', 		// 登录(手机号:phone 密码:password)
        simpleReg: 'single/home/simpleReg', 		// 登录(手机号:phone 密码:password)
		home: 'single/home/content',
        updatePassword: 'single/home/updatePassword',
        loginByCode: 'single/home/loginByCode', // 手机和验证码登录
        reg: 'single/home/reg', // 注册
        sendCodes: 'single/home/sms/codes', // 获取验证码
	},
    member: {
      storeList: 'single/user/store/list', 		// 查询学校列表
        storeDetail: 'single/user/storeDetail', 		// 查询拼团商品详情信息
    schoolList: 'single/user/school/list', 		// 查询学校列表
     schoolDetail: 'single/user/schoolDetail', 		// 查询拼团商品详情信息
    getAreaByPid: 'single/user/getAreaByPid', // 根据pid查询区域
    bindSchool: 'single/user/bindSchool', // 会员绑定学校
    bindArea: 'single/user/bindArea', // 会员绑定区域

    },
    goods: {
     groupGoodsDetail: 'single/pms/goodsGroup/detail', 		// 查询拼团商品详情信息
            groupGoodsList: 'single/pms/groupGoods/list', // 查询拼团商品列表
   groupHotGoodsList: 'single/pms/groupHotGoods/list', // 查询生效拼团商品列表
        giftDetail: 'single/pms/gift/detail', 		// 查询商品详情信息
            giftList: 'single/pms/gift/list', // 查询商品列表
    typeGiftList:  'single/pms/typeGiftList',//查询商品类型下的商品列表
     addView: 'single/pms/addView', 		// 查询商品详情信息
      viewList: 'single/pms/viewList', // 查询商品列表

        goodsDetail: 'single/pms/goods/detail', 		// 查询商品详情信息
        goodsList: 'single/pms/goods/list', // 查询商品列表
        categoryList: 'single/pms/productCategory/list', // 查询商品分类列表
        createGoods: 'single/pms/createGoods', //创建商品
        brandList: 'single/pms/brand/list', // 根据条件查询所有品牌表列表
        consultList: 'single/pms/consult/list', // 取某个商品的评价
        categoryAndGoodsList: 'single/pms/categoryAndGoodsList/list', // 查询商品分类列表(带商品)
        typeGoodsList: 'single/pms/typeGoodsList',//查询商品类型下的商品列表
        typeList: 'single/pms/typeList',//查询商品类型下的商品列表

        recommendBrand: 'single/pms/recommendBrand/list', // 查询首页推荐品牌
        newProductList: 'single/pms/newProductList/list', //查询首页新品
        hotProductList: 'single/pms/hotProductList/list', // 查询热销商品
		listCollect: 'collection/listCollect', // 显示关注列表
		deleteCollect: 'collection/delete', // 删除收藏中的某个商品
		favoriteSave: 'collection/favoriteSave', // 添加/商品收藏
        listAddress: 'address/list', // 显示所有收货地址
        deleteAddress: 'address/delete', // 删除
        addressSave: 'address/save', // 添加
        setDefaultAddress: 'address/address-set-default', // 设为默认地址

    },
    order: {
      addGroup: 'single/oms/addGroup', // 发起拼团
      acceptGroup: 'single/oms/acceptGroup', // 提交拼团
        orderList: 'single/oms/order/list', 		// 查询订单列表
        orderDetail: 'single/oms/detail', 		// 查询订单列表
        preOrder: 'single/oms/submitPreview', // 预览订单
        closeOrder: 'single/oms/closeOrder', // 关闭订单
        bookOrder: 'single/oms/generateOrder',//  生成订单
        addCart: 'cart/addCart', // 添加商品到购物车
        cartList: 'cart/list', 		// 获取某个会员的购物车列表
        promotionCartList: 'cart/list/promotion', 		// 获取某个会员的购物车列表,包括促销信息
        updateQuantity: 'cart/update/quantity', //修改购物车中某个商品的数量
        deleteCart: 'cart/delete', // 删除购物车中的某个商品
        clearCart: 'cart/clear', // 清空购物车
        jifenPay: 'pay/jifenPay', // 余额支付
        balancePay: 'pay/balancePay', // 余额支付
        weixinAppletPay: 'pay/weixinAppletPay', // 微信小程序支付
        aliPay: 'pay/aliPay', // 支付宝支付

    },
    cms: {
        subjectList: 'single/cms/subject/list', 		//  查询文章列表
        subjectCategoryList: 'single/cms/subjectCategory/list', 		//  查询文章分类列表
        subjectCommentList: 'single/cms/subjectComment/list', 		//  查询文章评论列表
        recommendSubjectList: 'single/cms/recommendSubjectList/list',  //查询首页推荐文章
        topicList: 'single/cms/topic/list', 		//  查询专题列表
        topicDetail: 'single/cms/topic/detail', 		// 专题详情
        subjectDetail: 'single/cms/subject/detail', 		// 文章详情
        createSubject: 'single/cms/createSubject', 		// 创建文章
    },

	/**
	 * 封装请求（async await 封装uni.request）
	 * method	   post/get		
	 * endpoint    接口方法名
	 * data		   所需传递参数	
	 * load		   是否需要loading
	 */
	async apiCall(method, endpoint, data,load) {
		if (!load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}
		let fullurl = this.BASEURI + endpoint;
		let Authorization ;
		 const userToken = uni.getStorageSync('userToken');
		  const userInfo = uni.getStorageSync('userInfo');
		if(userInfo){
			data.memberId = userInfo.id ;
			Authorization = userToken;

		}

        		let [error, res] = await uni.request({
        			url: fullurl,
        			data: data,
        			method: method,
        			header: {
        			 'storeId' :1 ,
        				'Content-Type': 'application/x-www-form-urlencoded',
        				// 'content-type': 'application/json',
        				'Authorization':  Authorization || ''
        			},
        		});
		if (!load) {
			uni.hideLoading();
		}
		if(res.data.message=='User token expired!'){
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			uni.navigateTo({
					url: `/pages/public/login`
				})
		}
		if(res.data.message=='请先登录'){
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			uni.navigateTo({
					url: `/pages/public/login`
				})
		}
		if (res.data.code == 200) {
			return res.data.data;
		}else{
			uni.showToast({
				title: res.data.msg,
				icon: 'none'
			});	
		}
	},
	/**
    	 * 封装请求（async await 封装uni.request）
    	 * method	   post/get
    	 * endpoint    接口方法名
    	 * data		   所需传递参数
    	 * load		   是否需要loading
    	 */
    	async apiEsCall(method, endpoint, data,load) {
    		if (!load) {
    			uni.showLoading({
    				title: '请稍候',
    				mask: true
    			});
    		}

    		let fullurl = this.BASEURI + endpoint;
        		let Authorization ;
        		 const userToken = uni.getStorageSync('userToken');
        		  const userInfo = uni.getStorageSync('userInfo');
        		if(userInfo){
        			data.memberId = userInfo.id ;
        			Authorization = userToken;

        		}
    		let [error, res] = await uni.request({
    			url: fullurl,
    			data: data,
    			method: method,
    			header: {
    			 'storeId' :1 ,
    				'Content-Type': 'application/x-www-form-urlencoded',
    				// 'content-type': 'application/json',
    				'Authorization':  Authorization || ''
    			},
    		});
    		console.log(error);
    		if (!load) {
    			uni.hideLoading();
    		}
            return res;

    	},
}
