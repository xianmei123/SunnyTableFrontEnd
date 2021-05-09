// pages/attribute/attribute.js
// import {pie,line,bar,scatter} from '../draw/draw.js' 
var baseUrl = 'http://www.jaripon.xyz/'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 线属性
    lineRaiuds: null,
    lineShowDigit: true,
    lineFont: 17,
    lineLegendPosTop: null,
    lineLegendPosBottom: null,
    lineLegendPosLeft: null,
    lineLegendPosRight: null,
    lineTextColor: 'rgb(0,154,97)', //初始值
    lineTextColorPick: false,
    // 条属性
    barWidth: null,
    barGap: null,
    barShowDigit: true,
    barFont: null,
    barLegendPosTop: null,
    barLegendPosBottom: null,
    barLegendPosLeft: null,
    barLegendPosRight: null,
    barTextColor: 'rgb(0,154,97)', //初始值
    barTextColorPick: false,
    // 扇形图
    pieRadius: null,
    piePrecision: null,
    pieShowPercent: true,
    pieShowLable: false,
    pieTitleFont: null,
    pieLabelFont: null,
    pieLegendPosTop: null,
    pieLegendPosBottom: null,
    pieLegendPosLeft: null,
    pieLegendPosRight: null,
    pieTextColor: 'rgb(0,154,97)', //初始值
    pieTextColorPick: false,
    // 散点图
    scatterShowLine: true,
    scatterShowDigit: true,
    scatterIncrease: false,
    scatterFont: null,
    scatterLegendPosTop: null,
    scatterLegendPosBottom: null,
    scatterLegendPosLeft: null,
    scatterLegendPosRight: null,
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
    if(parseInt(str, 16) < 16) {
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
  getlineTemplate() {
    var lengendPosList = [this.data.lineLegendPosTop+'%', this.data.lineLegendPosBottom+'%', this.data.lineLegendPosLeft+'%', this.data.lineLegendPosRight+'%'].join(',')
    return {
      radius: this.data.lineRaiuds.toString(),
      color: this.data.lineColors.map(this.transColors),
      showDigit: this.data.lineShowDigit,
      font: this.data.lineFont,
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
    var lengendPosList = [this.data.barLegendPosTop+'%', this.data.barLegendPosBottom+'%', this.data.barLegendPosLeft+'%', this.data.barLegendPosRight+'%'].join(',')
    return {
      width: this.data.barWidth+'%',
      gap: this.data.barGap+'%',
      color: this.data.barColors.map(this.transColors),
      showDigit: this.data.barShowDigit,
      font: this.data.barFont,
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
    var lengendPosList = [this.data.pieLegendPosTop+'%', this.data.pieLegendPosBottom+'%', this.data.pieLegendPosLeft+'%', this.data.pieLegendPosRight+'%'].join(',')
    return {
      radius: this.data.pieRadius+"%",
      precision: this.data.piePrecision,
      color: this.data.pieColors.map(this.transColors),
      showPercent: this.data.pieShowPercent,
      showLabel: this.data.pieShowLable,
      titleFont: this.data.pieTitleFont,
      labelFont: this.data.pieLabelFont,
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
    var lengendPosList = [this.data.scatterLegendPosTop+'%', this.data.scatterLegendPosBottom+'%', this.data.scatterLegendPosLeft+'%', this.data.scatterLegendPosRight+'%'].join(',')
    return {
      showLine: this.data.scatterShowLine,
      increate: this.data.scatterIncrease,
      color: this.data.scatterColors.map(this.transColors),
      showDigit: this.data.scatterShowDigit,
      font: this.data.scatterFont,
      legendPos: lengendPosList,
      textColor: this.transColor(this.data.scatterTextColor)
    }
  },
  onLoad: function (options) {
    this.initLine()
    this.initBar()
    this.initPie()
    this.initSactter()
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
  changeBool(event) {
    var detail = event.detail
    var name = event.currentTarget.dataset.name
    this.setData({
      [name]: detail
    });
  },
  submit(event) {
    var lineTemplate = this.getlineTemplate()
    var barTemplate = this.getBarTemplate()
    var pieTemplate = this.getPieTemplate()
    var scatterTemplate = this.getScatterTemplate()
    console.log(lineTemplate)
    console.log(barTemplate)
    console.log(pieTemplate)
    console.log(scatterTemplate)
    // line.updateLineTemplate(lineTemplate)
    // bar.updateBarTemplate(barTemplate)
    // pie.updatePieTemplate(pieTemplate)
    // scatter.updateScatterTemplate(scatterTemplate)
    wx.showToast({
      title: '设置成功',
      complete: function () {
        // wx.navigateBack({delta: 1})
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