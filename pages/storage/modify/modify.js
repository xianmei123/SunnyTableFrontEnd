// pages/storage/storage.js
import {
	hasError,
	trans,
	checks
} from '../helper'
var baseUrl = 'https://www.jaripon.xyz'
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
		var root = {
			name: 'root',
			id: wx.getStorageSync('rootId'),
			type: 4,
			createTime: 'xx-xx-xx'
		}
		while (!await this.changeDir(root));
		var dirStack = [root]
		this.setData({
			dirStack
		})
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on("setObj", data => {
			var activeObj = data.item
			var modifyType = data.modifyType
			var baseUrl = data.url
			this.setData({
				activeObj,
				modifyType,
				baseUrl
			})
		})
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
	openDir: function (event) {
		var item = event.currentTarget.dataset.item
		if (item.id == this.data.activeObj.id) {
			wx.showToast({
				title: '无法自复制',
				icon: 'error'
			})
		} else {
			if (!this.changeDir(event.currentTarget.dataset.item)) {
				return false;
			}
			this.data.dirStack.push(item)
			this.setData({
				dirStack: this.data.dirStack
			})
		}
	},

	async changeDir(item) {
		var url = baseUrl + "/file/dir/open" + '/' + wx.getStorageSync('uid') + '/' + item.id
		var res = await trans(url);
		this.data.fileList = res.data
		if (await hasError(res)) return false
		this.setData({
			fileList: this.data.fileList
		})
		return true
	},
	async saveObj() {
		if (!checks(this.data.fileList, this.data.activeObj.name)) {
			wx.showToast({
				title: '已存在同名对象',
				icon: 'error'
			})
		} else {
			var dirStack = this.data.dirStack
			var notify = this.data.modifyType == 0 ? "复制成功" : "移动成功"
			var url = this.data.baseUrl + '/' + dirStack[dirStack.length - 1].id
			var res = await trans(url)
			if (await hasError(res)) return false
			// this.data.fileList.push(this.data.activeObj)
			// this.setData({dirStack,fileList:this.data.fileList})
			wx.showToast({
				title: notify,
				complete: function () {
					wx.navigateBack({
						delta: 1
					})
				}
			})
		}
	},
	touchStart(e) {
		let sx = e.touches[0].pageX
		let sy = e.touches[0].pageY
		this.data.touchS = [sx, sy]
	  },
	  async touchEnd(e) {
		console.log(e)
		let start = this.data.touchS
		let end = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
		var dirStack = this.data.dirStack
		if (start[0] > end[0] + 100 ) {
		  if(dirStack.length > 1)
			 if(await this.changeDir(dirStack[dirStack.length - 2])){
				dirStack.splice(dirStack.length-1,1)
				this.setData({dirStack})
			 }
		}
	  }
})