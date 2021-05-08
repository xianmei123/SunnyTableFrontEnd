var trans = require('../storage/storage').server.trans
var hasError = require('../storage/storage').hasError
var baseUrl = 'http://www.jaripon.xyz/template/chart/display'
import {pie,line,bar,scatter} from '../draw/draw.js' 
Page({
  data: {
    mainActiveIndex: 0,
    activeId: [null,null,null,null],
    items:[
        { text: '折线图',children:[]},
        { text: '柱状图',children:[]},
        {text: '饼状图',children:[]},
        {text:'散点图',children:[] }
    ],
    id:0,
    maxnum:10,
  },
  onload:function(){
    console.log('fuck')
  },
  async onLoad(){
    //1--bar,2--line,3--pie,4-scatter
    var map = [1,0,2,3]
    var url =  baseUrl  + '/' + 'evigel' + '/' + this.data.maxnum
    var res =  await trans(url)
    // var bars = this.data.items[1], line= this.data.items[0],pie=this.data.items[2],scatter=this.data.items[3]
    for(var x of res.data){
      var cata = this.data.items[map[x.type-1]].children
      cata.push({text:x.name,id:x.fid})
    }
    this.setData({items:this.data.items})
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
async goDraw(event){
	var funcs=[line.setLineTemplate,bar.setBarTemplate,pie.setPieTemplate,scatter.setScatterTemplate]
	var urls = ['/template/linechart/open/','/template/barchart/open/' , '/template/fanchart/open/' , '/template/scatterplot/open/']
	console.log(this.data.activeId)
	for(var x =0;x<4;x++){
		var res = await trans('http://www.jaripon.xyz'+urls[x] + this.data.activeId[x])
		if(hasError(res))
			return false	
		funcs[x](res.data)
	}
	wx.redirectTo({
		url: '/pages/draw/draw',
	})
},
  onClickItem({ detail = {} }) {
    var activeId = this.data.activeId,index = this.data.mainActiveIndex;
    activeId[index] = activeId[index] === detail.id ? null : detail.id;
    this.setData({ activeId });
  },
});