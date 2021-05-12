// app.js
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
        res = await trans(baseUrl + '/',
          {'code': res}
        )
        //res.data.openid = '0' //此处暂时用0标识
        wx.setStorageSync('uid',res.openid)
        // var url = baseUrl + '/user/login/'+res.data.openid
        //res = await trans(url)
        //console.log(res)
        wx.setStorageSync('rootId',res.fid)
        url = baseUrl + '/file/dir/open/' + res.openid + '/' + wx.getStorageSync('rootId')
        res = await trans(url)
        console.log(res.data)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
