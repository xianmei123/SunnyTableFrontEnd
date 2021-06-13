// pages/tutorial/tutorial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [{
        selected: true,
        title: '折线图',
        unique: 'unique_1',
        url: 'https://www.jaripon.xyz/image/t1.jpg'
      },
      {
        selected: false,
        title: '折线图',
        unique: 'unique_1',
        url: 'https://www.jaripon.xyz/image/t2.jpg'
      },
      {
        selected: false,
        title: '折线图',
        unique: 'unique_1',
        url: 'https://www.jaripon.xyz/image/t3.jpg'
      },
      {
        selected: false,
        title: '折线图',
        unique: 'unique_1',
        url: 'https://www.jaripon.xyz/image/t4.jpg'
      },
      {
        selected: false,
        title: '折线图',
        unique: 'unique_1',
        url: 'https://www.jaripon.xyz/image/t5.jpg'
      },
      {
        selected: false,
        title: '折线图',
        unique: 'unique_1',
        url: 'https://www.jaripon.xyz/image/t6.jpg'
      },
      {
        selected: false,
        title: '折线图',
        unique: 'unique_1',
        url: 'https://www.jaripon.xyz/image/t7.jpg'
      },

    ],
    tip: "\ntip:左右滑动查看教程哦~",
  },

  goIndex() {
    wx.switchTab({
      url: '../index/index'
    })
    // wx.navigateTo({
    // 	url: '../index/index',
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isFirst = wx.getStorageSync("isFirst");
    if (!isFirst) {
      wx.switchTab({
        url: '../index/index'
      });
    }

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

  },

  getSelectItem: function (e) {
    var that = this;
    //var itemWidth = e.detail.scrollWidth / 750;//每个商品的宽度
    console.log(e.detail.scrollWidth);
    var scrollLeft = e.detail.scrollLeft; //滚动宽度
    console.log(e.detail.scrollLeft);
    var curIndex = Math.floor((scrollLeft + 160) / 320); //通过Math.round方法对滚动大于一半的位置
    console.log(curIndex);
    //进行进位
    for (var i = 0, len = that.data.pics.length; i < len; ++i) {
      that.data.pics[i].selected = false;
    }
    this.data.pics[curIndex].selected = true;
    that.setData({
      pics: that.data.pics,
    });
  },
})