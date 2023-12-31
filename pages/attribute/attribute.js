var baseUrl = 'https://www.jaripon.xyz/'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		lineActiveNames: ['1'],
		barActiveNames: ['1'],
		pieActiveNames: ['1'],
		scatterActiveNames: ['1'],
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
		linePosVertical: false,
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
		barPosVertical: false,
		// 扇形图
		pieRadius: 20,
		piePrecision: 5,
		pieShowPercent: true,
		pieShowLabel: false,
		pieTitleFont: 20,
		pieLabelFont: 20,
		pieLegendPosTop: 50,
		pieLegendPosBottom: 50,
		pieLegendPosLeft: 50,
		pieLegendPosRight: 50,
		pieTextColor: 'rgb(0,154,97)', //初始值
		pieTextColorPick: false,
		piePosVertical: false,
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
		scatterPosVertical: false,
		scatterUseRegression:false,
		defaulteTemplate: [] //传入的默认template
	},
	getTotAttribute(template, name) {
		var legendPos = template.legendPos.split(',')
		var verical = legendPos[4]
		legendPos = legendPos.slice(0, 4).map(
			(res) => {
				var x = parseInt(res.split('%')[0])
				return isNaN(x) ? null : x
			}
		)
		legendPos.push(verical == 'vertical' ? true : false)
		var colors = this.transArrColor(template, name)
		return [legendPos, colors]
	},
	initLine() {
		var template = this.data.defaulteTemplate
		var [legendPos, lineColors] = this.getTotAttribute(template, '线图')
		var [lineLegendPosTop, lineLegendPosBottom, lineLegendPosLeft, lineLegendPosRight, linePosVertical] = legendPos
		var lineAreaStyle = this.transArrColor(template, '区域颜色')
		var uses = []
		for(var x =0;x< this.data.count;x++) uses.push(x+1)
		console.log('模板!', template)
		console.log('uese!',this.data.uses)
		this.setData({
			lineRaiuds: template.radius,
			lineShowDigit: template.showDigit,
			lineFont: template.font,
			lineTextColor: this.hex2rgb(template.textColor), //初始值
			lineTextColorPick: false,
			lineModelName: template.name,
			lineLegendPosTop,
			lineLegendPosBottom,
			lineLegendPosLeft,
			lineLegendPosRight,
			linePosVertical,
			lineColors,
			lineShowSymbol: template.showSymbol,
			lineSmooth: template.smooth,
			lineAreaStyle,
			lineShowArea: this.transArray(template.showArea),
			lineShowEmphasis: this.transArray(template.showEmphasis),
			lineShowMinMarkPoint: this.transArray(template.showMinMarkPoint),
			lineShowMaxMarkPoint: this.transArray(template.showMaxMarkPoint),
			lineMarkPointSize: template.markPointSize,
			lineMarkPointStyle: template.markPointStyle,
			lineShowAverageMarkLine: this.transArray(template.showAverageMarkLine),
			lineShowGradient: template.showGradient,
			lineShowXGradient: template.showXGradient,
			lineShowYGradient: template.showYGradient,
			lineStack: template.stack==""?uses:this.transArray(template.stack)
			// barStack: this.transArray(template.stack)
			// lineStack: this.transArray(template.stack)
		})
		console.log('test',this.data.lineShowXGradient,this.data.lineShowYGradient)
		console.log('test',typeof(template.showXGradient))
	},
	fillZero(str) {
		if (parseInt(str, 16) < 16) {
			return '0' + str
		}
		return str
	},
	hex2rgb(str) {
		if (str == 'red') return 'rgb(50,50,50)'
		var ans = 'rgb' + '(' + parseInt(str.substr(1, 2), 16) + ',' +
			parseInt(str.substr(3, 2), 16) + ',' + parseInt(str.substr(5, 2), 16) + ')'
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
	transSinglePercent(item) {
		return parseInt(item.split("%")[0]);
	},
	transSigleColor(item) {
		return this.rgb2hex(item.rgb)
	},
	transArrColor(template, name) {
		var colors = []
		for (var x = 0; x < template.color.length; x++) {
			colors.push({
				text: name + `${x}`,
				value: x,
				rgb: this.hex2rgb(template.color[x]),
				show: false
			})
		}
		return colors
	},
	transArray(arr) {
		return arr.split(" ").map(item => {
			if (item == "") return null;
			else return JSON.parse(item)
		})
	},
	wrapArrToDrop(arr) {
		var droparr = []
		for (var x = 0; x < arr.length; x++) {
			droparr.push({
				text: name + "545"
			})
		}
	},
	transNullToPercent(res){
		console.log('check res is',res,typeof(res),res=="")
		return res==""? 'null':res + '%'
	},
	getLineTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos, lineColors] = this.getTotAttribute(template, '线图')
		var [lineLegendPosTop, lineLegendPosBottom, lineLegendPosLeft, lineLegendPosRight, linePosVertical] = legendPos
		var lengendPosList = [
			this.transNullToPercent(this.data.lineLegendPosTop ), this.transNullToPercent(this.data.lineLegendPosBottom ), this.transNullToPercent(this.data.lineLegendPosLeft), this.transNullToPercent(this.data.lineLegendPosRight ), this.data.linePosVertical ? 'vertical' : 'horizon'
		].join(',')
		console.log(lengendPosList)
		var stack = []
		for (var x = 0; x < this.data.count; x++) {
			if(template.stack.length <= x)
				stack.push(this.data.lineStack[x])
			else 
				stack.push(this.data.lineStack[x] || template.stack[x])
		}
		return {
			radius: (this.data.lineRaiuds || template.radius).toString(),
			color: this.data.lineColors.map(this.transSigleColor),
			showDigit: this.data.lineShowDigit,
			showSymbol:this.data.lineShowSymbol,
			font: this.data.lineFont || template.font,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.lineTextColor),
			name: this.data.lineModelName || template.name,
			smooth: this.data.lineSmooth,
			areaStyle: this.data.lineAreaStyle.map(this.transSigleColor).join(' '),
			showArea: this.data.lineShowArea.map(item => {
				return item.toString()
			}).join(' '),
			showEmphasis: this.data.lineShowEmphasis.map(item => {
				return item.toString()
			}).join(' '),
			showMinMarkPoint: this.data.lineShowMinMarkPoint.map(item => {
				return item.toString()
			}).join(' '),
			showMaxMarkPoint: this.data.lineShowMaxMarkPoint.map(item => {
				return item.toString()
			}).join(' '),
			markPointSize: this.data.lineMarkPointSize,
			markPointSize: this.data.linkeMarkPointStyle,
			showAverageMarkLine: this.data.lineShowAverageMarkLine.map(item => {
				return item.toString()
			}).join(' '),
			showGradient: this.data.lineShowGradient,
			showXGradient: this.data.lineShowXGradient,
			showYGradient: this.data.lineShowYGradient,
			stack: stack.join(' '),
		}
	},
	initBar() {
		var template = this.data.defaulteTemplate
		var [legendPos, barColors] = this.getTotAttribute(template, '柱图')
		var [barLegendPosTop, barLegendPosBottom, barLegendPosLeft, barLegendPosRight, barPosVertical] = legendPos
		console.log('bar!', template)
		var uses = []
		for(var x =0;x<this.data.count;x++)  uses.push(x+1)
		this.setData({
			barWidth: this.transSinglePercent(template.width),
			barGap: this.transSinglePercent(template.gap),
			barFont: template.font,
			barLegendPosTop,
			barLegendPosBottom,
			barLegendPosLeft,
			barLegendPosRight,
			barTextColor: this.hex2rgb(template.textColor), //初始值
			barTextColorPick: false,
			barModelName: template.name,
			barPosVertical,
			barColors,
			barShowDigit:template.showDigit,
			barShowEmphasis: this.transArray(template.showEmphasis),
			barShowMinMarkPoint: this.transArray(template.showMinMarkPoint),
			barShowMaxMarkPoint: this.transArray(template.showMaxMarkPoint),
			barMarkPointSize: template.markPointSize,
			barMarkPointStyle: template.markPointStyle,
			barShowAverageMarkLine: this.transArray(template.showAverageMarkLine),
			barShowGradient: template.showGradient,
			// barStack: this.transArray(template.stack)
			barStack: template.stack==""?uses:this.transArray(template.stack)
		})
		console.log(this.data.barStack)
	},
	getBarTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos, barColors] = this.getTotAttribute(template, '柱图')
		var [barLegendPosTop, barLegendPosBottom, barLegendPosLeft, barLegendPosRight, barPosVertical] = legendPos
		var lengendPosList = [this.transNullToPercent(this.data.barLegendPosTop ), this.transNullToPercent(this.data.barLegendPosBottom ), this.transNullToPercent(this.data.barLegendPosLeft ), this.transNullToPercent(this.data.barLegendPosRight ), this.data.barPosVertical ? 'vertical' : 'horizon'].join(',')
		var stack = []
		for (var x = 0; x < this.data.count; x++) {
			if(template.stack.length <= x)
				stack.push(this.data.barStack[x])
			else 
				stack.push(this.data.barStack[x] || template.stack[x])
		}
		return {
			width: this.data.barWidth || template.width + '%',
			gap: this.data.barGap || template.gap + '%',
			color: this.data.barColors.map(this.transSigleColor),
			showDigit: this.data.barShowDigit,
			font: this.data.barFont || template.font,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.barTextColor),
			name: this.data.barModelName || template.name,
			showEmphasis: this.data.barShowEmphasis.map(item => {
				return item.toString()
			}).join(' '),
			showMinMarkPoint: this.data.barShowMinMarkPoint.map(item => {
				return item.toString()
			}).join(' '),
			showMaxMarkPoint: this.data.barShowMaxMarkPoint.map(item => {
				return item.toString()
			}).join(' '),
			markPointSize: this.data.barMarkPointSize,
			markPointSize: this.data.linkeMarkPointStyle,
			showAverageMarkLine: this.data.barShowAverageMarkLine.map(item => {
				return item.toString()
			}).join(' '),
			stack: stack.join(' ')
		}
	},
	initPie() {
		var template = this.data.defaulteTemplate
		console.log(template)
		var [legendPos, pieColors] = this.getTotAttribute(template, '饼图')
		var [pieLegendPosTop, pieLegendPosBottom, pieLegendPosLeft, pieLegendPosRight, piePosVertical] = legendPos
		var pieColorsValue = 0
		console.log(typeof(template.borderRadius))
		this.setData({
			piePrecision: template.precisions,
			pieShowPercent: template.showPercent,
			pieShowLabel: template.showLabel,
			pieTitleFont: template.titleFont,
			pieLabelFont: template.labelFont,
			pieLegendPosTop,
			pieLegendPosBottom,
			pieLegendPosLeft,
			pieLegendPosRight,
			pieTextColor: this.hex2rgb(template.textColor), //初始值
			pieTextColorPick: false,
			pieModelName: template.name,
			piePosVertical,
			pieColors,
			pieColorsValue,
			pieRadius: template.radius.split(" ").map(this.transSinglePercent),
			pieBorderRadius: template.borderRadius,
			pieShowRing: template.showRing,
			pieShowRose: template.showRose,
			pieRoseType: template.pieRoseType == 'radius' ? '0' : '1'
		})
		console.log(this.data.pieTextColor)
	},
	getPieTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos, pieColors] = this.getTotAttribute(template, '饼图')
		var [pieLegendPosTop, pieLegendPosBottom, pieLegendPosLeft, pieLegendPosRight, piePosVertical] = legendPos
		var lengendPosList = [this.transNullToPercent(this.data.pieLegendPosTop ), this.transNullToPercent(this.data.pieLegendPosBottom ), this.transNullToPercent(this.data.pieLegendPosLeft ), this.transNullToPercent(this.data.pieLegendPosRight ),  this.data.piePosVertical ? 'vertical' : 'horizon'].join(',')
		var radius = [this.data.pieRadius[0] ? this.data.pieRadius[0] + "%" : template.radius[0], this.data.pieRadius[1] ? this.data.pieRadius[1] + "%" : template.radius]
		return {
			radius: radius.join(' '),
			precisions: this.data.piePrecision || template.precisions,
			color: this.data.pieColors.map(this.transSigleColor),
			showPercent: this.data.pieShowPercent,
			showLabel: this.data.pieShowLabel,
			titleFont: this.data.pieTitleFont || template.titleFont,
			labelFont: this.data.pieLabelFont || template.labelFont,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.barTextColor),
			name: this.data.pieModelName || template.name,
			borderRadius: this.data.pieBorderRadius || template.borderRadius,
			showRing: this.data.pieShowRing || template.showRing,
			showRose: this.data.pieShowRose || template.showRose,
			roseType: this.data.pieRoseType == '0' ? 'radius' : 'area'
		}
	},
	initScatter() {
		var template = this.data.defaulteTemplate
		console.log(template)
		var [legendPos, scatterColors] = this.getTotAttribute(template, '散图')
		var [scatterLegendPosTop, scatterLegendPosBottom, scatterLegendPosLeft, scatterLegendPosRight, scatterPosVertical] = legendPos
		var scatterColorsValue = 0
		this.setData({
			scatterShowLine: template.showLine,
			scatterShowDigit: template.showDigit,
			scatterIncrease: template.increase,
			scatterFont: template.font,
			scatterLegendPosTop,
			scatterLegendPosBottom,
			scatterLegendPosLeft,
			scatterLegendPosRight,
			scatterTextColor: this.hex2rgb(template.textColor), //初始值
			scatterTextColorPick: false,
			scatterModelName: template.name,
			scatterPosVertical,
			scatterColors,
			scatterColorsValue,
			scatterUseRegression: template.useRegression,
			scatterIndexRegression: template.indexRegression.toString()
		})
		console.log(typeof(this.data.scatterUseRegression))
	},
	getScatterTemplate() {
		var template = this.data.defaulteTemplate
		var [legendPos, scatterColors] = this.getTotAttribute(template, '散点图')
		var [scatterLegendPosTop, scatterLegendPosBottom, scatterLegendPosLeft, scatterLegendPosRight, scatterPosVertical] = legendPos
		var lengendPosList = [this.transNullToPercent(this.data.scatterLegendPosTop ), this.transNullToPercent(this.data.scatterLegendPosBottom ), this.transNullToPercent(this.data.scatterLegendPosLeft ), this.transNullToPercent(this.data.scatterLegendPosRight ), this.data.scatterPosVertical ? 'vertical' : 'horizon'].join(',')
		console.log('scatter', template)
		return {
			showLine: this.data.scatterShowLine,
			increase: this.data.scatterIncrease,
			color: this.data.scatterColors.map(this.transSigleColor),
			showDigit: this.data.scatterShowDigit,
			font: this.data.scatterFont || tmeplate.font,
			legendPos: lengendPosList,
			textColor: this.rgb2hex(this.data.scatterTextColor),
			name: this.data.scatterModelName || template.name,
			useRegression: this.data.scatterUseRegression,
			indexRegression: this.data.scatterIndexRegression
		}
	},
	onLoad: function (options) {
		var init = [this.initLine, this.initBar, this.initPie, this.initScatter]
		var title = ['折线图属性', '柱状图属性', '饼状图属性', '散点图属性']
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on("changeTemplate", data => {
			console.log('data~', data);
			var index = data.index;
			wx.setNavigationBarTitle({
				title: title[index]
			})
			this.setData({
				type: index,
				defaulteTemplate: data.template,
				count: data.count
			})
			init[index]()
			var uses = []
			for (var x = 0; x < data.count; x++)
				uses.push(x)
			this.setData({
				uses:uses
			})
			console.log('uses',this.data.uses)
		})

	},
	onUnload() {
		var tmeplates = [this.getLineTemplate, this.getBarTemplate, this.getPieTemplate, this.getScatterTemplate]
		var index = this.data.type
		var template = this.data.defaulteTemplate
		var mtemplate = tmeplates[index]()
		Object.assign(template, mtemplate)
		console.log('back',template)
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.emit('back', {
			template: template
		});

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
	changeSingleItem(event) {
		var detail = event.detail
		var name = event.currentTarget.dataset.name
		if (name == 'pieShowRing') {
			this.setData({
				pieShowLabel: !detail
			})
		}
		this.setData({
			[name]: detail
		});
	},
	modifySingleItem(event) {
		console.log(event)
		var {
			name,
			value
		} = event.currentTarget.dataset
		this.setData({
			[name]: value
		})
	},
	submit(event) {
		this.setData({
			isChangeTemplate: true
		});
		wx.showToast({
			title: '设置成功',
			complete: function () {
				// wx.navigateBack({delta: 1})
			}
		})
	}
})