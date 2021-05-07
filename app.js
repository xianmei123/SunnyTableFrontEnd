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
    var baseUrl = 'http://www.jaripon.xyz'
    wx.login({
      success: async function(res){
        res = await trans('https://api.weixin.qq.com/sns/jscode2session',
          {appid:'wx1051a156c57637ce',
            secret:'f67b9b94f24ed21fa32e1f259cca333e',
            js_code:res.code,grant_type:'authorization_code'}
        )
        res.data.openid = '0' //此处暂时用0标识
        var url = baseUrl + '/user/login/'+res.data.openid
        wx.setStorageSync('uid',res.data.openid)
        res = await trans(url)
        console.log(res)
        wx.setStorageSync('rootId',res.data)
        url = baseUrl + '/file/dir/open/' + 0+ '/' + wx.getStorageSync('rootId')
        res = await trans(url)
        console.log(res.data)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
