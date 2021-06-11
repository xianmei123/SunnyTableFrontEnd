// index.js
// 获取应用实例
const app = getApp()
var baseUrl = 'https://www.jaripon.xyz'
Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		canIUseGetUserProfile: false,
		active: 'staticData',
		canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
		pics: [{
				name: '折线图',
				pic: ["line1.png", "line2.png", "line3.png"]
			},
			{
				name: '柱状图',
				pic: ['bar1.png', 'bar2.png', 'bar3.png']
			},
			{
				name: '饼状图',
				pic: ['pie1.png', 'pie2.png', 'pie3.png']
			},
			{
				name: '散点图',
				pic: ['scatter1.png', 'scatter2.png', 'scatter3.png']
			}
		]

	},
	onshow: function () {

	},
	// 事件处理函数
	bindViewTap() {
		var nameToIndex = {};
		nameToIndex.name = [1, 2, 3];
		console.log(nameToIndex);
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	goDraw(e) {
		var value =  e.target.dataset.name
		if(value=='折线图') value = 'line'
		else if(value=='柱状图') value = 'bar'
		else if(value=='饼状图') value = 'pie'
		else value ='scatter'
		wx.navigateTo({
			url: '../draw/draw',
			success(result) {
				result.eventChannel.emit("goDraw", {
				  value: value
				})
			  }
		})
	},
	goSelectModel() {
		wx.navigateTo({
			url: '../model_select/model_select'
		})
	},
	onLoad() {
		wx.showShareMenu({
		  withShareTicket: true,
		})
		if (wx.getUserProfile) {
			this.setData({
				canIUseGetUserProfile: true
			})
		}

	},
	showTip() {
		wx.showModal({
			title: '提示',
			content: '数据图表，包括折线图，散点图，饼状图和柱状图',
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定')
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		});
	},
	getUserProfile(e) {
		// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		wx.getUserProfile({
			desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			success: (res) => {
				console.log(res)
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		})
	},
	getUserInfo(e) {
		// 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
		console.log(e)
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	},
	onShareAppMessage(res){
		if(res.from=='button'){

		}
		return {
			title:'duck',
			path:'/pages/storage/storage?uid=' + 5
		}
	}
})