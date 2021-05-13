
var baseUrl = 'https://www.jaripon.xyz/'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isChangeTemplate: false,
		active: 1,
		myshow: true,
		// 线属性
		lineRaiuds: 15,
		lineShowDigit: true,
		lineFont: 17,
		lineLegendPosTop: 50,
		lineLegendPosBottom: 50,
		lineLegendPosLeft: 50,
		lineLegendPosRight: 50,
		lineTextColor: 'rgb(0,154,97)', //初始值
		lineTextColorPick: false,
		// 条属性
		barWidth: 20,
		barGap: 20,
		barShowDigit: true,
		barFont: 20,
		barLegendPosTop: 50,
		barLegendPosBottom: 50,
		barLegendPosLeft: 50,
		barLegendPosRight: 50,
		barTextColor: 'rgb(0,154,97)', //初始值
		barTextColorPick: false,
		// 扇形图
		pieRadius: 20,
		piePrecision: 5,
		pieShowPercent: true,
		pieShowLable: false,
		pieTitleFont: 20,
		pieLabelFont: 20,
		pieLegendPosTop: 50,
		pieLegendPosBottom: 50,
		pieLegendPosLeft: 50,
		pieLegendPosRight: 50,
		pieTextColor: 'rgb(0,154,97)', //初始值
		pieTextColorPick: false,
		// 散点图
		scatterShowLine: true,
		scatterShowDigit: true,
		scatterIncrease: false,
		scatterFont: 20,
		scatterLegendPosTop: 50,
		scatterLegendPosBottom: 50,
		scatterLegendPosLeft: 50,
		scatterLegendPosRight: 50,
		scatterTextColor: 'rgb(0,154,97)', //初始值
		scatterTextColorPick: false,
	},
	initLine() {
		var lineColors = [],
			lineColorsValue = 0
		for (var x = 0; x < 10; x++) {
			lineColors.push({
				text: `线条${x}`,
				value: x,
				rgb: 'rgb(0,154,97)',
				show: false
			})
		}
		this.setData({
			lineColors,
			lineColorsValue
		})
	},
	fillZero(str) {
		if (parseInt(str, 16) < 16) {
			return '0' + str
		}
		return str
	},
	transColor(str) {

		const newstr = str.replace(/(rgb\()|(\))/g, '')
		const arr = newstr.split(',')
		let res = '#'
		for (var val of arr) {
			res += this.fillZero(parseInt(val).toString(16))
		}
		return res
	},
	transColors(item) {
		return this.transColor(item.rgb)
	},
	getLineTemplate() {
		var lengendPosList = [
			this.data.lineLegendPosTop||50 + '%', this.data.lineLegendPosBottom||50 + '%', this.data.lineLegendPosLeft||50 + '%', this.data.lineLegendPosRight||50 + '%'].join(',')
		return {
			radius: (this.data.lineRaiuds||20).toString(),
			color: this.data.lineColors.map(this.transColors),
			showDigit: this.data.lineShowDigit,
			font: this.data.lineFont||20,
			legendPos: lengendPosList,
			textColor: this.transColor(this.data.lineTextColor)
		}
	},
	initBar() {
		var barColors = [],
			barColorsValue = 0
		for (var x = 0; x < 10; x++) {
			barColors.push({
				text: `柱图${x}`,
				value: x,
				rgb: 'rgb(0,154,97)',
				show: false
			})
		}
		this.setData({
			barColors,
			barColorsValue
		})
	},
	getBarTemplate() {
		var lengendPosList = [this.data.barLegendPosTop||50 + '%', this.data.barLegendPosBottom||50 + '%', this.data.barLegendPosLeft||50 + '%', this.data.barLegendPosRight||50 + '%'].join(',')
		return {
			width: this.data.barWidth||20 + '%',
			gap: this.data.barGap||20 + '%',
			color: this.data.barColors.map(this.transColors),
			showDigit: this.data.barShowDigit,
			font: this.data.barFont||20,
			legendPos: lengendPosList,
			textColor: this.transColor(this.data.barTextColor)
		}
	},
	initPie() {
		var pieColors = [],
			pieColorsValue = 0
		for (var x = 0; x < 10; x++) {
			pieColors.push({
				text: `饼图${x}`,
				value: x,
				rgb: 'rgb(0,154,97)',
				show: false
			})
		}
		this.setData({
			pieColors,
			pieColorsValue
		})
	},
	getPieTemplate() {
		var lengendPosList = [this.data.pieLegendPosTop||50 + '%', this.data.pieLegendPosBottom||50 + '%', this.data.pieLegendPosLeft||50 + '%', this.data.pieLegendPosRight||50 + '%'].join(',')
		return {
			radius: this.data.pieRadius||20 + "%",
			precision: this.data.piePrecision||5,
			color: this.data.pieColors.map(this.transColors),
			showPercent: this.data.pieShowPercent,
			showLabel: this.data.pieShowLable,
			titleFont: this.data.pieTitleFont||20,
			labelFont: this.data.pieLabelFont||20,
			legendPos: lengendPosList,
			textColor: this.transColor(this.data.barTextColor)
		}
	},
	initSactter() {
		var scatterColors = [],
			scatterColorsValue = 0
		for (var x = 0; x < 10; x++) {
			scatterColors.push({
				text: `点图${x}`,
				value: x,
				rgb: 'rgb(0,154,97)',
				show: false
			})
		}
		this.setData({
			scatterColors,
			scatterColorsValue
		})
	},
	getScatterTemplate() {
		var lengendPosList = [this.data.scatterLegendPosTop||50 + '%', this.data.scatterLegendPosBottom||50 + '%', this.data.scatterLegendPosLeft||50 + '%', this.data.scatterLegendPosRight||50 + '%'].join(',')
		return {
			showLine: this.data.scatterShowLine,
			increate: this.data.scatterIncrease,
			color: this.data.scatterColors.map(this.transColors),
			showDigit: this.data.scatterShowDigit,
			font: this.data.scatterFont||20,
			legendPos: lengendPosList,
			textColor: this.transColor(this.data.scatterTextColor)
		}
	},
	onLoad: function (options) {
		var init = [this.initLine, this.initBar, this.initPie, this.initSactter]
		var title = ['折线图属性', '柱状图属性', '饼状图属性', '散点图属性']
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on("changeTemplate", data => {
			console.log(data);
			var index = data.index;
			init[index]()
			wx.setNavigationBarTitle({
				title: title[index]
			})
			this.setData({
				type: index
			})
		})

	},
	onUnload() {
		if (this.data.isChangeTemplate) {
			var tmeplates = [this.getLineTemplate, this.getBarTemplate, this.getPieTemplate, this.getScatterTemplate]
			var index = this.data.type
			var template = tmeplates[index]()
			console.log(template)
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.emit('back', {
				template: template
			});
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},
	toPick: function (event) {
		var show = event.currentTarget.dataset.show
		console.log(show)
		this.setData({
			[show]: true
		})
	},
	//取色结果回调
	pickColor(e) {
		console.log(e);
		var rgb = e.detail.color;
		var name = e.currentTarget.dataset.color
		console.log(name, rgb)
		this.setData({
			[name]: rgb
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},
	
	itemColorSelect(e) {
		var name = e.currentTarget.dataset.name
		var target = this.data[`${name}`]
		console.log('colorChange', name)
		for (var x of target)
			x.show = false
		this.setData({
			[name]: target
		})
	},
	tabChange(e) {
		console.log(e)
		console.log('waht the fuck', this.data.lineTextColorPick)
		this.setData({
			active: e.detail.index
		})
		console.log(this.data.active)
	},
	changeBool(event) {
		var detail = event.detail
		var name = event.currentTarget.dataset.name
		this.setData({
			[name]: detail
		});
	},
	submit(event) {
		// var tmeplates = [this.getLineTemplate, this.getBarTemplate, this.getPieTemplate, this.getScatterTemplate]
		// var targets = [updateLineTemplate, updateBarTemplate, updatePieTemplate, updateScatterTemplate]
		// var index = this.data.type
		// var template = tmeplates[index]()
		// targets[index](template)
		this.setData({
			isChangeTemplate: true
		});
		wx.showToast({
			title: '设置成功',
			complete: function () {
				// wx.navigateBack({delta: 1})
			}
		})
	},
	stepperChange(event) {
		var name = event.currentTarget.dataset.name
		this.setData({
			[name]: event.detail
		})
	}
})