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
})