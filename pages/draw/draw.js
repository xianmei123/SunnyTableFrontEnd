// pages/draw/draw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '柱状图', value: 'bar' },
      { text: '折线图', value: 'line' },
      { text: '饼状图', value: 'pie' },
    ],
    option2: [
      { text: '表格', value: 'excel' },
      { text: '文字', value: 'text' },
    ],
    value1:'bar',
    value2:'excel'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})