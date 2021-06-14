export var trans = async function (url, data, method) {
	var res = await new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: data,
			complete(res) {
				resolve(res)
			}
		})
	}).catch((err) => {
		console.log(err)
	})
	return res
}
export var hasError = function (res) {
	if ((res.data.code && res.data.code != 0) || (res.statusCode && res.statusCode != 200)) {
		wx.showToast({
			title: '服务器繁忙',
			icon: 'error'
		})
		return true
	}
	return false
}
export var checks = (fileList, name) => {
	for (var x of fileList) {
		if (x.name == name) return false
	}
	return true
}

module.exports.trans = trans;
module.exports.hasError = hasError;
module.exports.checks = checks