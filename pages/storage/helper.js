export var trans = async function(url,data,method){
    var res = await new Promise((resolve,reject) =>
    {
      wx.request({
        url: url,
        data:data,
        complete(res){
          console.log(res)
          resolve(res)
        }
      })
    })
    return res
  }
  export var hasError = function (res){
    if((res.data.code && res.data.code!=0) || (res.statusCode&& res.statusCode !=200)){
      wx.showToast({
        title: '操作失败',
        icon:'error'
      })
      return true
    }
    return false
  }