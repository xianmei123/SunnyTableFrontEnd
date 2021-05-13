var baseUrl = 'https://www.jaripon.xyz/'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isChangeTemplate: false,
		active: 1,
		myshow: true,
		lineRaiuds: 15,
		lineShowDigit: true,
		lineFont: 17,
		lineLegendPosTop: 50,
		lineLegendPosBottom: 50,
		lineLegendPosLeft: 50,
		lineLegendPosRight: 50,
		lineTextColor: 'rgb(0,154,97)', //初始值
		lineTextColorPick: false,
		linePosVertical:false,
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
		barPosVertical:false,
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
		piePosVertical:false,
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
		scatterPosVertical:false,
		defaulteTemplate:[] //传入的默认template
	},
	getTotAttribute(template,name){
		var legendPos = template.legendPos.split(',')
		var verical = legendPos[4]
		legendPos = legendPos.slice(0,4).map(
			(res)=>{
				var x = parseInt(res.split('%')[0])
				return isNaN(x)?null:x
			}
		)		
		legendPos.push(verical=='vertical'?true:false)
		var colors = []
		for (var x = 0; x<template.color.length; x++) {
			console.log(x)
			colors.push({
				text: name+`${x}`,
				value: x,
				rgb: this.hex2rgb(template.color[x]),
				show: false
			})
		}
		return [legendPos,colors]
	},
	initLine() {
		var template = this.data.defaulteTemplate
		var [legendPos,lineColors] = this.getTotAttribute(template,'线图')
		var [lineLegendPosTop,lineLegendPosBottom,lineLegendPosLeft,lineLegendPosRight,linePosVertical] = legendPos
		console.log(linePosVertical)
		var lineColorsValue = 0
		this.setData({
			lineRaiuds: template.radius,
			lineShowDigit: template.showDigit,
			lineFont: template.font,
			lineTextColor: this.hex2rgb(template.textColor), //初始值
			lineTextColorPick: false,
			lineModelName: template.name,
			lineLegendPosTop,lineLegendPosBottom,lineLegendPosLeft,lineLegendPosRight,
			linePosVertical,
			lineColors,
			lineColorsValue
		})
		console.log('colors',this.data.lineTextColor,this.data.lineColors)
		console.log(this.data.lineColors)
	},
	fillZero(str) {
		if (parseInt(str, 16) < 16) {
			return '0' + str
		}
		return str
	},
	hex2rgb(str){
		if(str=='red') return 'rgb(50,50,50)'
		var ans = 'rgb' + '(' + parseInt(str.substr(1,2),16) +','
		+ parseInt(str.substr(3,2),16) + ','+ parseInt(str.substr(5,2),16) +')' 
		return ans
	},
	rgb2hex(str) {
		const newstr = str.replace(/(rgb\()|(\))/g, '')
		const arr = newstr.split(',')
		let res = '#'
		for (var val of arr) {
			res += this.fillZero(parseInt(val).toString(16))
		}
		return res
	},
	transColors(item) {
		return this.rgb2hex(item.rgb)
	},
	getLineTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos,lineColors] = this.getTotAttribute(template,'线图')
		var [lineLegendPosTop,lineLegendPosBottom,lineLegendPosLeft,lineLegendPosRight,linePosVertical] = legendPos
		// console.log(lineLegendPosTop,this.data.lineLegendPosTop,this.data.lineLegendPosTop||lineLegendPosTop + '%')
		var lengendPosList = [
			(this.data.lineLegendPosTop||lineLegendPosTop) + '%', (this.data.lineLegendPosBottom||lineLegendPosBottom) + '%', (this.data.lineLegendPosLeft||lineLegendPosLeft) + '%', (this.data.lineLegendPosRight||lineLegendPosRight) + '%' + linePosVertical?'vetical':'horizon'].join(',')
			console.log(lengendPosList)
		return {
			radius: (this.data.lineRaiuds||template.radius).toString(),
			color: this.data.lineColors.map(this.transColors),
			showDigit: this.data.lineShowDigit,
			font: this.data.lineFont||template.font,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.lineTextColor),
			name:this.data.lineModelName||template.name
		}
	},
	initBar() {
		var template = this.data.defaulteTemplate
		var [legendPos,barColors] = this.getTotAttribute(template,'柱图')
		var [barLegendPosTop,barLegendPosBottom,barLegendPosLeft,barLegendPosRight,barPosVertical] = legendPos
		var barColorsValue = 0
		this.setData({
			barWidth: template.width,
			barGap: template.gap,
			barFont: template.font,
			barLegendPosTop,barLegendPosBottom,barLegendPosLeft,barLegendPosRight,
			barTextColor: this.hex2rgb(template.textColor), //初始值
			barTextColorPick: false,
			barModelName: template.name,
			barPosVertical,
			barColors,
			barColorsValue
		})
	},
	getBarTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos,barColors] = this.getTotAttribute(template,'柱图')
		var [barLegendPosTop,barLegendPosBottom,barLegendPosLeft,barLegendPosRight,barPosVertical] = legendPos
		var lengendPosList = [(this.data.barLegendPosTop||barLegendPosTop )+ '%', (this.data.barLegendPosBottom||barLegendPosBottom )+ '%', (this.data.barLegendPosLeft||barLegendPosLeft )+ '%', (this.data.barLegendPosRight||barLegendPosRight )+ '%'+ barPosVertical?'vetical':'horizon'].join(',')
		return {
			width: this.data.barWidth||template.width + '%',
			gap: this.data.barGap||template.gap + '%',
			color: this.data.barColors.map(this.transColors),
			showDigit: this.data.barShowDigit,
			font: this.data.barFont||template.font,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.barTextColor),
			name:this.data.barModelName||template.name
		}
	},
	initPie() {
		var template = this.data.defaulteTemplate
		console.log(template)
		var [legendPos,pieColors] = this.getTotAttribute(template,'饼图')
		var [pieLegendPosTop,pieLegendPosBottom,pieLegendPosLeft,pieLegendPosRight,piePosVertical] = legendPos
		var pieColorsValue = 0
		this.setData({
			pieRadius: template.radius,
			piePrecision: template.precision,
			pieShowPercent: template.showPercent,
			pieShowLable: template.showLabel,
			pieTitleFont: template.titleFont,
			pieLabelFont: template.pieLabelFont,
			pieLegendPosTop,pieLegendPosBottom,pieLegendPosLeft,pieLegendPosRight,
			pieTextColor: this.hex2rgb(template.textColor), //初始值
			pieTextColorPick: false,
			pieModelName: template.name,
			piePosVertical,
			pieColors,
			pieColorsValue
		})
		console.log(this.data.pieTextColor)
	},
	getPieTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos,pieColors] = this.getTotAttribute(template,'饼图')
		var [pieLegendPosTop,pieLegendPosBottom,pieLegendPosLeft,pieLegendPosRight,piePosVertical] = legendPos
		var lengendPosList = [(this.data.pieLegendPosTop||pieLegendPosTop )+ '%', (this.data.pieLegendPosBottom||pieLegendPosBottom )+ '%', (this.data.pieLegendPosLeft||pieLegendPosLeft )+ '%', (this.data.pieLegendPosRight||pieLegendPosRight )+ '%'+ piePosVertical?'vetical':'horizon'].join(',')
		return {
			radius: this.data.pieRadius||template.radius + "%",
			precision: this.data.piePrecision||template.precision,
			color: this.data.pieColors.map(this.transColors),
			showPercent: this.data.pieShowPercent,
			showLabel: this.data.pieShowLable,
			titleFont: this.data.pieTitleFont||template.titleFont,
			labelFont: this.data.pieLabelFont||template.labelFont,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.barTextColor),
			name:this.data.pieModelName||template.name
		}
	},
	initScatter() {
		var template = this.data.defaulteTemplate
		console.log(template)
		var [legendPos,scatterColors] = this.getTotAttribute(template,'散图')
		var [scatterLegendPosTop,scatterLegendPosBottom,scatterLegendPosLeft,scatterLegendPosRight,scatterPosVertical] = legendPos
		var scatterColorsValue = 0
		this.setData({
			scatterShowLine: template.showLine,
			scatterShowDigit: template.showDigit,
			scatterIncrease: template.increase,
			scatterFont: template.font,
			scatterLegendPosTop,scatterLegendPosBottom,scatterLegendPosLeft,scatterLegendPosRight,
			scatterTextColor: this.hex2rgb(template.textColor), //初始值
			scatterTextColorPick: false,
			scatterModelName: template.name,
			scatterPosVertical,
			scatterColors,
			scatterColorsValue
		})
	},
	getScatterTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos,scatterColors] = this.getTotAttribute(template,'散点图')
		var [scatterLegendPosTop,scatterLegendPosBottom,scatterLegendPosLeft,scatterLegendPosRight,scatterPosVertical] = legendPos
		var lengendPosList = [this.data.scatterLegendPosTop||scatterLegendPosTop + '%', this.data.scatterLegendPosBottom||scatterLegendPosBottom + '%', this.data.scatterLegendPosLeft||scatterLegendPosLeft + '%', this.data.scatterLegendPosRight||scatterLegendPosRight + '%'+ scatterPosVertical?'vetical':'horizon'].join(',')
		return {
			showLine: this.data.scatterShowLine,
			increate: this.data.scatterIncrease,
			color: this.data.scatterColors.map(this.transColors),
			showDigit: this.data.scatterShowDigit,
			font: this.data.scatterFont||tmeplate.font,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.scatterTextColor),
			name:this.data.scatterModelName||template.name
		}
	},
	onLoad: function (options) {
		var init = [this.initLine, this.initBar, this.initPie, this.initScatter]
		var title = ['折线图属性', '柱状图属性', '饼状图属性', '散点图属性']
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on("changeTemplate", data => {
			console.log('data~',data);
			var index = data.index;
			wx.setNavigationBarTitle({
				title: title[index]
			})
			this.setData({
				type: index,
				defaulteTemplate:data.template
			})
			init[index]()
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