// pages/storage/storage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    value1: 0,
    fileList:[
      {name:'最近打开',type:0,id:"0",createTime:"2021-04-12"},
      {name:'物理实验',type:1,id:"1",createTime:"2021-04-13"}
    ],
    dirstack:[
      {name:"/",type:0,id:0,createTime:"2021-04-01"},
      
    ],
    // activeObj,
    popShow:false
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

  },

  onclick:function(event){
      console.log("aa")
  },
  popUp: function(event){
    this.setData(
      {
        popShow:true,
        activeObj:event.currentTarget.dataset.item
      }
    )
  },
  popDown:function(event){
    this.setData()
    this.setData({
      popShow:false,
    })
  },
  updata:function(data){
    console.log(data)
  },
  openObj:function(event){

  },
  delObj:function(event){
    console.log("cool")
    wx.request({
      url: 'https://test.com/getinfo',
      data:['delte',this.data.activeObj],
      method:"POST",
      // success: function(res) {
      //   console.log(res)// 服务器回包信息
      //   this.update(rese.data);
      // },
      // fail:function(){

      // },
      success:function(res){
        console.log(res)
      },
      complete:function(res){
        console.log(5);
        this.update(5);
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  copyObj:function(event){
    console.log("cool")
  },
  moveObj:function(e){

  }
})