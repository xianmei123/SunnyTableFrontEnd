// pages/storage/storage.js
var storage = require('../storage')
console.log(storage)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dropOption: [
      { text: '按名称排序', value: 0 },
      { text: '按时间排序', value: 1 },
    ],
    dropValue: 0,
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
    var root = storage.server.init()
    var fileList = root.fileList
    var dirStack = [root]
    this.setData({fileList,dirStack})
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("setObj",data=>{
      console.log(data)
      var activeObj = data.item
      var modifyType = data.modifyType
      this.setData({activeObj,modifyType})
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openDir:function(event){
    var item = event.currentTarget.dataset.item
    if(item.id==this.data.activeObj.id){
      wx.showToast({
        title: '无法自复制',
        icon:'error'
      })
    }else{
      this.changeDir(item)
    }
  },
  changeDir:function(item){
    var url = this.data.baseUrl + "/file/dir/open/{uid}/{fid}"
    var data = {uid:"",fid:""}
    // console.log(server.root)
    // console.log(item,server.bfs(item.id))
    this.data.dirStack.push(item)
    this.data.fileList = JSON.parse(JSON.stringify(storage.server.bfs(item.id)[1].fileList))
    this.setData({dirStack:this.data.dirStack,fileList:this.data.fileList})

  },
  saveObj:function(){
    // var 
    if(!storage.checks(this.data.fileList,this.data.activeObj.name)){
        wx.showToast({
          title: '已存在同名对象',
          icon: 'error'
        })
      }else {
        var dirStack = this.data.dirStack
        var notify = this.data.modifyType==0?"复制成功":"移动成功"
        console.log(storage.server.root)
        if(this.data.modifyType==1){
          storage.server.delObj(this.data.activeObj.id)
          console.log(storage.server.root)
        }
        this.data.fileList.push(this.data.activeObj)
        storage.server.addDir(dirStack[dirStack.length-1].id,this.data.activeObj)
        this.setData({dirStack,fileList:this.data.fileList})
        console.log(storage.server.root)
        wx.showToast({
          title: notify,
          complete:function(){
          wx.navigateBack({delta: 1})
          }
        })
      }
    }
})