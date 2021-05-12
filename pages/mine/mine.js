// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  login(e){
      wx.getUserProfile({
        desc:"用于获取您的后台信息",
        complete: (res)=>{
          var data = JSON.parse(res.rawData)
          this.setData({userName:data.nickName,userLogo:data.avatarUrl})
        }
      }
      )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  showTips: function(event){
    console.log(event)
    // wx.showModal({
    //   title: '提示',
    //   content: 'test test',
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // });
  }
})