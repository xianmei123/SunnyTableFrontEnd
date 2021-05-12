// const { getCurrentPage } = require("../../miniprogram_npm/@vant/weapp/common/utils")
import {setShowTemplate} from '../showTemplate/showTemplate'
import {convertFromBackTemplate} from '../draw/draw'
import {
  trans,
  hasError
} from './helper'
var baseUrl = 'http://www.jaripon.xyz'
var checks = (fileList, name) => {
  for (var x of fileList) {
    if (x.name == name) return false
  }
  return true
}
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
    ]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
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
    this.flush()
    console.log(getCurrentPages())
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
  flush() {
    var dirStack = this.data.dirStack
    this.changeDir(dirStack[dirStack.length - 1])
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
    var res = await trans(url)
    if (hasError(res)) return false
    var item = res.data
    var dirStack = this.data.dirStack
    this.data.fileList.push(item)
    this.setData({
      fileList: this.data.fileList
    })
    return true
  },
  async changeDir(item) {
    var url = baseUrl + "/file/dir/open" + '/' + wx.getStorageSync('uid') + '/' + item.id
    var res = await trans(url);
    this.data.fileList = res.data
    if (hasError(res)) return false
    this.setData({
      fileList: this.data.fileList
    })
    return true
  },
  openDir(event) {
    if (!this.changeDir(event.currentTarget.dataset.item)) {
      return false;
    }
    this.data.dirStack.push(event.currentTarget.dataset.item)
    this.setData({
      dirStack: this.data.dirStack
    })
  },
  async openGraph(item) {
    var urls = [' chart/barchart/open','/chart/linechart/open','chart/fanchart/open','chart/scatterplot/open']
    var url = baseUrl + '/'+ urls[item.templateType] +'/'+ item.id
    var res  =  trans(url)
    console.log(res)
    wx.navigateTo({
      url: '../showTemplate/showTemplate',
      success(result){
        result.eventChannel.emit("openChart",{
            data: res
        })
      }
    })
  },
  async openData(item) {
    console.log(item)
    var url = baseUrl + '/' + 'data/open' + '/' + item.id
    // var res = await trans(url)
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
    var urls = ['template/barchart/open','template/linechart/open','template/fanchart/open','template/scatterplot/open']
    var type = ['bar','line','pie','scatter']
    var url = baseUrl + '/'+ urls[item.templateType] +'/'+ item.id
    var res = trans(url)
    setShowTemplate(this.data.showData, convertFromBackTemplate(res), 'string', 'number')
      wx.navigateTo({
        url: '../showTemplate/showTemplate',
        success(result){
          result.eventChannel.emit("openTemplate", {
            type: type[item.templateType],
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
    if(item.type == 1)
      this.openGraph(item)
    else if(item.type==2)
      this.openData(item)
    else 
      this.openTemplate(item)
  },
  async delObj(event) {
    var srcfid = this.data.activeObj.id
    var url = baseUrl + "/file/dir/remove" + '/' + srcfid
    var res = await trans(url)
    if (hasError(res)) return false
    var fileList = this.data.fileList
    for (var i = 0; i < fileList.length; i++) {
      if (fileList[i].id == this.data.activeObj.id) {
        fileList.splice(i, 1)
        break
      }
    }
    this.setData({
      fileList,
      popShow: false
    })
    return true
  },
  async renameObj(name) {
    var fid = this.data.activeObj.id
    var url = baseUrl + '/file/dir/rename' + '/' + fid + '/' + name
    var res = await trans(url)
    if (hasError(res)) return false
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
  }
})