// app.js
!function(){
  var PageTmp = Page;
 
  Page =function (pageConfig) {
     
    // 设置全局默认分享
    pageConfig = Object.assign({
      onShareAppMessage:function () {
        return {
          title:'Sunny图表',
          path:'/pages/index/index',
          imageUrl:'',
        };
      }
    },pageConfig);
 
    PageTmp(pageConfig);
  };
}();
var trans = async function(url,data,method){
  const res = await new Promise((resolve,reject) =>
  {
    wx.request({
      url: url,
      data:data,
      success:function(res){
        resolve(res)
      }
    })
  })
  return res
}
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    var baseUrl = 'https://www.jaripon.xyz'
    wx.login({
      success: async function(res){
        console.log(res);
        res = await trans(baseUrl + '/wechat/login/' + res.code,""
        )
        console.log(res);
        //res.data.openid = '0' //此处暂时用0标识
        wx.setStorageSync('uid',res.data.openid)
        // var url = baseUrl + '/user/login/'+res.data.openid
        //res = await trans(url)
        //console.log(res)
        wx.setStorageSync('rootId',res.data.fid)
        var url = baseUrl + '/file/dir/open/' + res.data.openid + '/' + wx.getStorageSync('rootId')
        res = await trans(url)
        console.log(res.data)
      }
    })
  },
  globalData: {
    userInfo: null
  },
  onShareAppMessage() {
		return {
			title: "Sunny图表",
			path: '/pages/index/index?id=12',
			success: (res) => {
				console.log("ye");
			}
		}
	}
})
