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
  onShow(){
    wx.getUserProfile({
      desc:"用于获取您的后台信息",
      complete: (res)=>{
        var data = JSON.parse(res.rawData)
        this.setData({userName:data.nickName,userLogo:data.avatarUrl})
      }
    }
    )

  },
  onLoad: function (options) {


    this.setData({userName:wx.getStorageSync('userName'),userLogo:wx.getStorageSync('userLogo')})
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
  aboutUs: function(event){
    wx.showModal({
    title: 'Sunny',
    content: 'duck! 当然是BUAA Sunny团队啦~',
    })
  },
  prefer(){
    wx.showToast({
      title: '敬请期待鸭~',
    })
  },
  goTutorial(){
    wx.setStorageSync('goTutorial', true)
    wx.navigateTo({
      url: '/pages/tutorial/tutorial',
    })
  }
})