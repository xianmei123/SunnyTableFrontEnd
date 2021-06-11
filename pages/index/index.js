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
	onShareAppMessage(res) {
		if (res.from == 'button') {

		}
		return {
			title: 'duck',
			path: '/pages/storage/storage?uid=' + 5
		}
	},
	updateTemplate() {
		updateTemp();
	}

})

function updateTemp() {
	var lineTemplate = {
		name: "line",
		json: {
		"id": null,
		"name": "折线图默认模板",
		"userId": null,
		"radius": "20",
		"point": [],
		"line": [],
		"color": [
			"#c1232b",
			"#27727b",
			"#fcce10",
			"#e87c25",
			"#b5c334",
			"#fe8463",
			"#9bca63",
			"#fad860",
			"#f3a43b",
			"#60c0dd",
			"#d7504b",
			"#c6e579",
			"#f4e001",
			"#f0805a",
			"#26c0c0",
		],
		"showDigit": "true",
		"font": 14,
		"legendPos": "30%,null,80%,null,vertical",
		"textColor": "#1e90ff",
		"isVisible": "true",
		// 以上是旧attr

		// 以下新属性
		// update
		"showSymbol": "true",
		//

		"smooth": "true", // (string)
		"areaStyle": "#c1232b #27727b #fcce10 #e87c25 #b5c334 #fe8463 #9bca63 #fad860 #f3a43b #60c0dd #d7504b #c6e579 #f4e001 #f0805a #26c0c0", // (string[]), 表示每条线下面的区域的颜色，默认为空，需要设置开关来判断是否使用
		"showArea": "false false", // 数组的每一项表示某条线是否使用是否使用area
		"showEmphasis": "false false", // 是否使用聚焦,
		"showMinMarkPoint": "false false", // 是否展示最小值标记点
		"showMaxMarkPoint": "false false", // 是否展示最大值标记点
		"markPointSize": 20, // 标记点大小
		"markPointStyle": 0, // 标记点的种类
		"showAverageMarkLine": "false false", // 是否展示平均值标记线,
		"showGradient": "false", // 是否展示渐变
		"showXGradient": "false", // x轴渐变
		"showYGradient": "false", // y轴渐变
		"gradientColor": "#4d80e6", // 渐变的颜色
		"colorLightness": "0.1 0.5", //颜色的明暗度，参见 HSL。
		"colorSaturation": "0.1 0.5", //颜色的饱和度，参见 HSL。
		"colorHue": "0.1 0.5", // 颜色的色调
		"stack": "", //stack值相同的线可以在前一条线的基础上增加，当stack与areaStyle一起使用时会出现堆叠图

	}
}

	var barTemplate = {
		name: "bar",
		json: {
		"id": null,
		"name": "柱状图默认模板",
		"userId": null,
		"width": 0.25,
		"gap": 0.0,
		"color": [
			"#c1232b",
			"#27727b",
			"#fcce10",
			"#e87c25",
			"#b5c334",
			"#fe8463",
			"#9bca63",
			"#fad860",
			"#f3a43b",
			"#60c0dd",
			"#d7504b",
			"#c6e579",
			"#f4e001",
			"#f0805a",
			"#26c0c0",
		],
		"showDigit": "true",
		"transpose": "true",
		"font": 14,
		"legendPos": "30%,null,80%,null,vertical",
		"textColor": "#1e90ff",
		"isVisible": "true",

		// 以上是旧模板属性

		//下面是新增模板属性
		"showEmphasis": "false false", // 是否使用聚焦,
		"showMinMarkPoint": "false false", // 是否展示最小值标记点
		"showMaxMarkPoint": "false false", // 是否展示最大值标记点
		"markPointSize": 20, // 标记点大小
		"markPointStyle": 0, // 标记点的种类
		"showAverageMarkLine": "false false", // 是否展示平均值标记线,
		"stack": "", //stack值相同的线可以在前一条柱的基础上增加，也即分层式

	}
}

	var pieTemplate = {
		name: "pie",
		json: {
		"id": null,
		"name": "饼状图默认模板",
		"userId": null,

		"precision": 2,
		"color": [
			"#c1232b",
			"#27727b",
			"#fcce10",
			"#e87c25",
			"#b5c334",
			"#fe8463",
			"#9bca63",
			"#fad860",
			"#f3a43b",
			"#60c0dd",
			"#d7504b",
			"#c6e579",
			"#f4e001",
			"#f0805a",
			"#26c0c0",
		],
		"showLabel": "true",
		"showPercent": "true",
		"titleFont": 20,
		"labelFont": 10,
		"legendPos": "30%,null,80%,null,vertical",
		"textColor": "#b22222",
		"isVisible": "true",

		"radius": "40% 80%", // 希望改为一个字符串数组，长度最多为2.
		"borderRadius": 8, //扇形圆角
		"showRing": "false", // 为真时，需要强制输入两个radius,且强制showLabel属性为false,且此时的labelFont为圆环中心的label的字体大小
		"showRose": "false", //是否使用玫瑰图
		"roseType": "radius", //玫瑰图类型，两个取值 "radius" || "area"
	}
}

	var scatterTemplate = {
		name: "scatter",
		json: {
		"id": null,
		"name": "散点图默认模板",
		"userId": "",
		"point": [],
		"color": [
			"#c1232b",
			"#27727b",
			"#fcce10",
			"#e87c25",
			"#b5c334",
			"#fe8463",
			"#9bca63",
			"#fad860",
			"#f3a43b",
			"#60c0dd",
			"#d7504b",
			"#c6e579",
			"#f4e001",
			"#f0805a",
			"#26c0c0",
		],
		"showLine": "true",
		"showDigit": "false",
		"increase": "false",
		"font": 12,
		"legendPos": "30%,null,80%,null,vertical",
		"textColor": "#0000ff",
		"isVisible": "true",
		//新属性
		"useRegression": "false",
		"indexRegression": 0 // 四种：线性回归，指数回归，对数回归，多项式回归
	}
}
	var sb = [lineTemplate, barTemplate, pieTemplate, scatterTemplate];
	for (var i of sb) {
		wx.request({
			url: baseUrl + '/template/' +  i.name === "pie" ? 'fan' : i.name + '/updateAll',
			data: i.json,
			success: res => {
				console.log(res);
			}
		});
	}
}
