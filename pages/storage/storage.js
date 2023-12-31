import {checks} from 'helper'
var helper;
var baseUrl = 'https://www.jaripon.xyz'
var dateTrans = function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
	var date = new Date(time);
	var year = date.getFullYear(),
		month = date.getMonth() + 1, //月份是从0开始的
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes(),
		sec = date.getSeconds();
	var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
		return '0' + index;
	}); //开个长度为10的数组 格式为 ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"]

	var newTime = format.replace(/YY/g, year)
		.replace(/MM/g, preArr[month] || month)
		.replace(/DD/g, preArr[day] || day)
		.replace(/hh/g, preArr[hour] || hour)
		.replace(/mm/g, preArr[min] || min)
		.replace(/ss/g, preArr[sec] || sec);
	return newTime;
}
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		dropOption: [{
				text: '按名称排序',
				value: 0
			},
			{
				text: '按时间排序',
				value: 1
			},
		],
		dropValue: 0,
		fileList: [],
		dirStack: [],
		// activeObj,
		popShow: false,
		dialogShow: false,
		dialogButton: [{
			text: '取消'
		}, {
			text: '确定'
		}],
		newDir: "",
		baseUrl: "",
		id: 5,
		popTitleList: ["新建文件夹", "文件夹重命名"],
		showData: [
			["x", 'a', 'b', 'c', 'd', 'e'],
			["y", 1, 2, 3, 4, 5]
    ],
    touchS: [0, 0],
    touchE: [0, 0]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.getSystemInfo({
      success: (res)=>{
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let changeHeight = 750 / clientWidth;
        let height = clientHeight * changeHeight;
        this.setData({
          screenHeight: height
        })
      }})
    console.log(options)
    helper = require('./helper');
    var root = {
      name: 'root',
      id: wx.getStorageSync('rootId'),
      type: 4,
      createTime: 'xx-xx-xx'
    }
    while (!this.changeDir(root));
    var dirStack = [root]
    this.setData({
      dirStack
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await this.flush()
  },
  // 弹出显示框函数
  showDialog(event) {
    var dialogType = event.currentTarget.dataset.index
    var popTitle = this.data.popTitleList[event.currentTarget.dataset.index]
    this.setData({
      popTitle,
      dialogType,
      dialogShow: true
    })
  },
  tapDialogButton(event) {
    if (event.detail.index == 1) {
      if (checks(this.data.fileList, this.data.newDir)) {
        if (this.data.dialogType == 0)
          this.createObj(this.data.newDir)
        else
          this.renameObj(this.data.newDir)
      } else {
        wx.showToast({
          title: '已存在同名对象',
          icon: 'error'
        })
      }
    }
    let newDir = ""
    this.setData({
      dialogShow: false,
      newDir
    })
  },
  // 底部滑出函数
  popUp: function (event) {
    this.setData({
      popShow: true,
      activeObj: event.currentTarget.dataset.item
    })
  },
  popDown(event) {
    this.setData()
    this.setData({
      popShow: false,
    })
  },
  // 文件函数
  cmp(obj1, obj2) {
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if (!o1 || !o2) {
      /*  判断不是对象  */
      return obj1 === obj2;
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
      //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }
    for (var attr in obj1) {
      var t1 = obj1[attr] instanceof Object;
      var t2 = obj2[attr] instanceof Object;
      if (t1 && t2) {
        return diff(obj1[attr], obj2[attr]);
      } else if (obj1[attr] !== obj2[attr]) {
        return false;
      }
    }
    return true;
  },
  crumbChange(event) {
    var dirStack = this.data.dirStack
    var index = event.currentTarget.dataset.index + 1
    var item = dirStack[index - 1]
    if (!this.changeDir(item)) return false
    dirStack.splice(index, dirStack.length - index)
    this.setData({
      dirStack
    })
  },
  async flush(show) {
    var dirStack = this.data.dirStack
    await this.changeDir(dirStack[dirStack.length - 1])
    if (show)
      wx.showToast({
        title: '刷新成功',
      })
    // var fileList = JSON.parse(JSON.stringify(server.bfs(dirStack[dirStack.length-1].id)[1].fileList))
    // this.setData({fileList})
  },
  sortObj(event) {
    let dropValue = this.data.dropValue
    let fileList = this.data.fileList
    if (dropValue == 0) //名称
      fileList.sort((a, b) => {
        return a.name == b.name ? 0 : a.name < b.name ? -1 : 1
      })
    else //时间
      fileList.sort((a, b) => {
        return a.createTime == b.createTime ? 0 : a.createTime < b.createTime ? -1 : 1
      })
    this.setData({
      fileList
    })
  },
  async createObj(name) {
    var faFid = this.data.dirStack[this.data.dirStack.length - 1].id
    var url = baseUrl + '/file/dir/create' + '/' + wx.getStorageSync('uid') + '/' + faFid + '/' + name
    var res = await helper.trans(url)
    if (await helper.hasError(res)) return false
    this.flush(false)
    // var item = res.data
    // this.data.fileList.push(item)
    // this.setData({
    //   fileList: this.data.fileList
    // })
    return true
  },
  async changeDir(item) {
    var url = baseUrl + "/file/dir/open" + '/' + wx.getStorageSync('uid') + '/' + item.id
    console.log(url)
    var res = await helper.trans(url);
    console.log(res)
    this.data.fileList = res.data
    if (await helper.hasError(res)) {
      console.log('errors!:', res)
      return false
    }
    this.setData({
      fileList: this.data.fileList
    })
    return true
  },
  async openDir(event) {
    if (!await this.changeDir(event.currentTarget.dataset.item)) {
      return false;
    }
    var dirStack = this.data.dirStack
    if (dirStack.length == 0 || dirStack[dirStack.length - 1].id != event.currentTarget.dataset.item.id)
      this.data.dirStack.push(event.currentTarget.dataset.item)
    this.setData({
      dirStack: this.data.dirStack
    })
  },
  async openGraph(item) {
	var urls = [' chart/barchart/open', '/chart/linechart/open', 'chart/fanchart/open', 'chart/scatterplot/open']
    var url = baseUrl + '/' + urls[item.templateType-1] + '/' + item.id
    var res = await helper.trans(url)
    console.log(res)
    wx.navigateTo({
      url: '../draw/draw',
      success(result) {
        result.eventChannel.emit("openChart", {
          data: res
        })
      }
    })
  },
  async openData(item) {
    var url = baseUrl + '/' + 'data/open' + '/' + item.id
    wx.request({
      url: url,
      complete: (res) => {
        wx.navigateTo({
          url: '/pages/display_data/display_data',
          success(result) {
            console.log('res.data', res.data)
            result.eventChannel.emit("openData", {
              data: res.data
            });
          }
        })
      }
    })
  },
  async openTemplate(item) {
	var urls = ['template/barchart/open', 'template/linechart/open', 'template/fanchart/open', 'template/scatterplot/open']
    var type = ['bar', 'line', 'pie', 'scatter']
    var url = baseUrl + '/' + urls[item.templateType-1] + '/' + item.id
    var res = await helper.trans(url)
    var draw = require('../draw/draw');
    var showTemplate = require('../showTemplate/showTemplate');
	console.log(res);
    showTemplate.setShowTemplate(this.data.showData, draw.convertFromBackTemplate(res.data, type[item.templateType-1]), 'string', 'number');
    wx.navigateTo({
      url: '../showTemplate/showTemplate',
      success: (result) => {
        result.eventChannel.emit("openTemplate", {
          type: type[item.templateType - 1],
          xName: "x",
          yName: "y",
          name: item.name,
          showTemplate: res,
          showData: this.data.showData
        });
      }
    })
  },
  async openObj(event) {
    var item = event.currentTarget.dataset.item
    if (item.type == 1)
      this.openGraph(item)
    else if (item.type == 2)
      this.openData(item)
    else
      this.openTemplate(item)
  },
  async delObj(event) {
    this.setData({
      popShow: false,
    })
    var srcfid = this.data.activeObj.id
    var fileList = this.data.fileList
    for (var i = 0; i < fileList.length; i++) {
      if (fileList[i].id == srcfid) {
        if(fileList[i].type==4&&fileList[i].templateType!=0){
          wx.showToast({
            title: '无法删默认目录',
            icon:'error'
          })
          return false
        }
        var url = baseUrl + "/file/dir/remove" + '/' + srcfid
        var res = await helper.trans(url)
        if (await helper.hasError(res)) return false
        fileList.splice(i, 1)
        this.setData({fileList:fileList})
        break
      }
    }
    return true
  },
  async delAll(event){
    if(this.data.dirStack.length==1){
      wx.showToast({
        title: '无法清空根目录',
        icon:'error'
      })
      return false;
    }
    var fileList = JSON.parse(JSON.stringify(this.data.fileList))
    for(var x of fileList){
      var url = baseUrl + "/file/dir/remove" + '/' + x.id 
      var res = await helper.trans(url)
      if (await helper.hasError(res)) break ;
      this.data.fileList.splice(0,1)
    }
    if(fileList.length==0){
      wx.showToast({
        title: '清空成功',
        icon: 'success'
      })
    }else {
      wx.showToast({
        title: '服务器繁忙',
        icon:'error'
      })
    }
      this.setData({fileList:this.data.fileList})
    // this.setData({fileList:[]})
  },
  async renameObj(name) {
    if(this.data.activeObj.type==4 && this.data.activeObj.templateType ==0){
      wx.showToast({
        title: '无法重命名默认目录',
        icon:'error'
      })
      return false;
    }
    var fid = this.data.activeObj.id
    var url = baseUrl + '/file/dir/rename' + '/' + fid + '/' + name
    var res = await helper.trans(url)
    if (await helper.hasError(res)) return false
    for (var x of this.data.fileList) {
      if (x.id == this.data.activeObj.id)
        x.name = name
    }
    this.setData({
      fileList: this.data.fileList,
      popShow: false
    })
    return true
  },
  async copyObj(event) {
    var url = baseUrl + "/dir/copy/{srcfid}/{dstfid}"
    var data = {
      srcFid: "",
      dstFid: ""
    }
    //必然不会出现在本文件夹，故不用监听
    wx.navigateTo({
      url: 'modify/modify',
      success: (result) => {
        result.eventChannel.emit("setObj", {
          url,
          item: this.data.activeObj,
          modifyType: 0,
          changeDir: this.changeDir,
        });
        this.setData({
          popShow: false
        })
      },
    })
  },
  async moveObj(e) {
    if(this.data.activeObj.type==4&&this.data.activeObj.templateType!=0){
      this.setData({
        popShow: false,
      })
      wx.showToast({
        title: '无法移动默认目录',
        icon:'error'
      })
      return false;
    }
    var url = baseUrl + "/file/dir/move" + '/' + this.data.activeObj.id
    wx.navigateTo({
      url: 'modify/modify',
      complete: (result) => {
        result.eventChannel.emit("setObj", {
          item: this.data.activeObj,
          modifyType: 1,
          url,
        });
        this.setData({
          popShow: false,
        })
      },
    })
  },
  onShareAppMessage(res){
    var path =  '/pages/index/index?id=' + this.data.activeObj.id 
    console.log(path)
    return {
      title: '分享模板  '+ this.data.activeObj.name,
      path:path
      // path:'/pages/index/index?id=0&'
       }
  },
  async onPullDownRefresh(){
    await this.flush(true)
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },
  touchStart(e) {
    console.log(e)
    console.log("fuck")
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
  },
  async touchEnd(e) {
    console.log(e)
    let start = this.data.touchS
    let end = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
    var dirStack = this.data.dirStack
    if (start[0] > end[0] + 100 || end[0] > start[0] + 100) {
      if(dirStack.length > 1)
         if(await this.changeDir(dirStack[dirStack.length - 2])){
            dirStack.splice(dirStack.length-1,1)
            this.setData({dirStack})
         }
    }
  }
})