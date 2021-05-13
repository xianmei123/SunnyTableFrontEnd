var helper;
var draw;
var baseUrl = 'https://www.jaripon.xyz'
Page({
	data: {
		mainActiveIndex: 0,
		activeId: [null, null, null, null],
		items: [{
				text: '折线图',
				children: []
			},
			{
				text: '柱状图',
				children: []
			},
			{
				text: '饼状图',
				children: []
			},
			{
				text: '散点图',
				children: []
			}
		],
		id: 0,
		maxnum: 10,
	},
	onload: function () {
		console.log('fuck')
	},
	async onLoad() {
		helper = require('../storage/helper');
		draw = require('../draw/draw');
		//1--bar,2--line,3--pie,4-scatter
		var map = [1, 0, 2, 3]
		var url = baseUrl + '/template/chart/display/' + wx.getStorageSync('uid') + '/' + 10
		console.log(url)
		var res = await helper.trans(url)
		console.log('返回',res)
		for (var x of res.data) {
			var cata = this.data.items[map[x.type - 1]].children
			cata.push({
				text: x.name,
				id: x.fid
			})
		}
		this.setData({
			items: this.data.items
		})
	},
	onClickNav({
		detail = {}
	}) {
		this.setData({
			mainActiveIndex: detail.index || 0,
		});
	},
	async goDraw(event) {
		var templates = [];
		var urls = ['/template/linechart/open/', '/template/barchart/open/', '/template/fanchart/open/', '/template/scatterplot/open/']
		for (var x = 0; x < 4; x++) {
			var res = await helper.trans('https://www.jaripon.xyz' + urls[x] + this.data.activeId[x])
			if (helper.hasError(res))
				return false
			templates.push(res.data)
		}
		draw.line.setTemplate(templates[0]);
		draw.bar.setTemplate(templates[1]);
		draw.pie.setTemplate(templates[2]);
		draw.scatter.setTemplate(templates[3]);
		wx.navigateTo({
			url: '/pages/draw/draw',
		})
	},
	onClickItem({
		detail = {}
	}) {
		var activeId = this.data.activeId,
			index = this.data.mainActiveIndex;
		activeId[index] = activeId[index] === detail.id ? null : detail.id;
		this.setData({
			activeId
		});
	},
});