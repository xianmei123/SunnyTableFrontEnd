// pages/storage/storage.js
var storage = require('../storage')
var baseUrl = 'http://www.jaripon.xyz'
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
    var root = {name:'root',id:wx.getStorageSync('rootId'),type:4,createTime:'xx-xx-xx'}
    while(!this.changeDir(root));
    var dirStack = [root]
    this.setData({dirStack})
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("setObj",data=>{
      var activeObj = data.item
      var modifyType = data.modifyType
      var baseUrl = data.url
      this.setData({activeObj,modifyType,baseUrl})
    })
  },
  crumbChange(event){
    var dirStack = this.data.dirStack
    var index  = event.currentTarget.dataset.index +1
    var item  = dirStack[index-1]
    if(!this.changeDir(item)) return false
    dirStack.splice(index,dirStack.length-index)
    this.setData({dirStack})
  },
  openDir:function(event){
    var item = event.currentTarget.dataset.item
    if(item.id==this.data.activeObj.id){
      wx.showToast({
        title: '无法自复制',
        icon:'error'
      })
    }else{
      if(!this.changeDir(event.currentTarget.dataset.item)){
        return false;
      }
      this.data.dirStack.push(item)
      this.setData({dirStack:this.data.dirStack})
    }
  },

  async changeDir(item){
    var url = baseUrl + "/file/dir/open" + '/' +wx.getStorageSync('uid') + '/' + item.id
    var res = await storage.server.trans(url);
    this.data.fileList = res.data
   if(storage.hasError(res)) return false
    this.setData({fileList:this.data.fileList})
    return true
  },
  async saveObj(){
    // var 
    if(!storage.checks(this.data.fileList,this.data.activeObj.name)){
        wx.showToast({
          title: '已存在同名对象',
          icon: 'error'
        })
      }else {
        var dirStack = this.data.dirStack
        var notify = this.data.modifyType==0?"复制成功":"移动成功"
        var url = this.data.baseUrl + '/' + dirStack[dirStack.length-1].id 
        var res = await storage.server.trans(url)
        if(storage.hasError(res)) return false
        // this.data.fileList.push(this.data.activeObj)
        // this.setData({dirStack,fileList:this.data.fileList})
        wx.showToast({
          title: notify,
          complete:function(){
          wx.navigateBack({delta: 1})
          }
        })
      }
    }
})