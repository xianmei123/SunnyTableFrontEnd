// pages/storage/storage.js
class Server{
  trans = async function(url,data,method){
    const res = await new Promise((resolve,reject) =>
    {
      wx.request({
        url: url,
        data:data,
        success:function(res){resolve(res)}
      })
    })
    return res
  }
  constructor(){
    this.root = {name:"根目录",type:0,id:0,createTime:"2021-04-18"}
    this.fileList =   [{name:'最近打开',type:0,id:1,createTime:"2021-04-18"},
                      {name:'物理实验',type:1,id:2,createTime:"2021-04-13"} ]
    this.root.fileList = this.fileList
    this.fileList[0].fileList = [{name:'计算机科学方法论',type:1,id:3,createTime:"2021-04-23"}]
  }
  bfs(fid) {
    //注意此处有耦合，不同数据可以合并到一起
    if(fid==0) return [this.root,this.root]
    var now = [this.root]
    var x ={},top
   while(now.length!=0){
      top = now[0]
      now.splice(0,1)
      if(top.type==1) continue
      for(x of top.fileList){
        now.push(x)
        if( x.id == fid){
          return [top,x]
        }
      }
      now.push(x)
    }
  }
  init(){
    var x = JSON.parse(JSON.stringify(this.root))
    return x
  }
  delObj(fid){
    var items = this.bfs(fid)
    var fa = items[0],son = items[1]
    for(var i = 0;i<fa.fileList.length;i++)
      if(son.id==fa.fileList[i].id){
        fa.fileList.splice(i,1)
        break
      }
  
  }
  addDir(fid,item){
    var items = this.bfs(fid)
    items[1].fileList.push(item)
  }
}
var server = new Server()
var checks =(fileList,name)=>{
  for(var x of fileList){
    if(x.name==name) return false
  }
  return true
}
module.exports.server = server
module.exports.checks = checks
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
    fileList:[],
    dirStack:[],
    // activeObj,
    popShow:false,
    dialogShow:false,
    dialogButton:[{text: '取消'}, {text: '确定'}],
    newDir:"",
    baseUrl:"",
    id:5
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var root = server.init()
    var fileList = root.fileList
    var dirStack = [root]
    this.setData({fileList,dirStack})
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
      this.flush()
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
  // 弹出显示框函数
  showDialog:function(){
    this.setData({
      dialogShow:true
    })
  },
  tapDialogButton:function(event){
    if(event.detail.index==1){
      if(checks(this.data.fileList,this.data.newDir))
        this.createObj(this.data.newDir)
      else{
        wx.showToast({
          title: '已存在同名对象',
          icon: 'error'
        })
     }
    }
    let newDir =""
    this.setData({
      dialogShow:false,
      newDir
    })
  },
// 底部滑出函数
  popUp: function(event){
    console.log(event)
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
  // 文件函数
  cmp:function(obj1,obj2){
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if(!o1 || !o2){/*  判断不是对象  */
        return obj1 === obj2;
    }
    if(Object.keys(obj1).length !== Object.keys(obj2).length){
        return false;
        //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }
    for(var attr in obj1){
        var t1 = obj1[attr] instanceof Object;
        var t2 = obj2[attr] instanceof Object;
        if(t1 && t2){
            return diff(obj1[attr],obj2[attr]);
        }else if(obj1[attr] !== obj2[attr]){
            return false;
        }
    }
    return true;
  },
  crumbChange:function(event){
    var dirStack = this.data.dirStack
    var index  = event.currentTarget.dataset.index +1
    var item  = dirStack[index-1]
    this.changeDir(item)
    dirStack.splice(index,dirStack.length-index)
    this.setData({dirStack})
  },
  updata:function(data){
    console.log(data)
  },
  getFilelist:function(){

  },
  flush:function(){
    var dirStack = this.data.dirStack
    var fileList = server.bfs(dirStack[dirStack.length-1].id)[1].fileList
    this.setData({fileList})
    wx.startPullDownRefresh()
  },
  sortObj:function(event){
    let dropValue = this.data.dropValue
    let fileList = this.data.fileList
    if(dropValue == 0) //名称
       fileList.sort((a,b)=>{ return a.name==b.name?0:a.name<b.name?-1:1})
    else  //时间
      fileList.sort((a,b) => {return a.createTime==b.createTime?0:a.createTime<b.createTime?-1:1}) 
    this.setData({fileList})
  },
  createObj:function(name){
    var url = this.data.baseUrl+ '/file/dir/create/{uid}/{fid}/{name}'
    var data ={uid:"",fid:"",name:""}
    var item = {name:name,type:0,id:this.data.id++,createTime:"2021-05-02",fileList:[]}
    var dirStack = this.data.dirStack
    this.data.fileList.push(item)
    server.addDir(dirStack[dirStack.length-1].id,item)
    this.setData({fileList:this.data.fileList})
  },
  changeDir:function(item){
    var url = this.data.baseUrl + "/file/dir/open/{uid}/{fid}"
    var data = {uid:"",fid:""}
    // console.log(server.root)
    // console.log(item,server.bfs(item.id))
    this.data.dirStack.push(item)
    this.data.fileList = JSON.parse(JSON.stringify(server.bfs(item.id)[1].fileList))
    this.setData({dirStack:this.data.dirStack,fileList:this.data.fileList})

  },
  openDir:function(event){
    this.changeDir(event.currentTarget.dataset.item)
  },
  openObj:function(event){

  },
  delObj:function(event){
    var url = "/file/dir/remove/{srcfid}"
    var data = {srcFid:""}
    var fileList = this.data.fileList
    server.delObj(this.data.activeObj.id)
    // console.log(this.data)
    for(var i =0;i<fileList.length;i++){
      if(fileList[i].id==this.data.activeObj.id){
          fileList.splice(i,1)
          break
      }
    }
    this.setData({
      fileList,
      popShow:false
    })
  },
  copyObj:function(event){
    var url = this.data.baseUrl + "/dir/copy/{srcfid}/{dstfid}"
    var data ={srcFid:"",dstFid:""}
    //必然不会出现在本文件夹，故不用监听
   wx.navigateTo({
     url: 'modify/modify',
     success: (result) => {
       result.eventChannel.emit("setObj",{item:this.data.activeObj,modifyType:0});
       this.setData({
        popShow:false
       })
     },
   })
  },
  moveObj:function(e){
    var url = this.data.baseUrl+"/file/dir/move/{srcfid}/{dstfid}"
    var data = {srcFid:"",dstFid:""}
    wx.navigateTo({
      url: 'modify/modify',
      complete: (result) => {
        result.eventChannel.emit("setObj",{item:this.data.activeObj,modifyType:1});
        this.setData({
         popShow:false,
        })
      },
    })
  }
})