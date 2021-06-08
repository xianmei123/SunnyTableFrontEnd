// pages/analyse/analyse.js
import * as echarts from '../../ec-canvas/echarts';

var graph = require('../draw/class');
var bar = new graph.BarGraph("bar");
var pie = new graph.PieGraph("pie");

var inputData = [
    ['ppp', 'qqq'],
    ['1月', 20],
    ['2月', 45],
    ['3月', 26],
    ['4月', 63],
    ['5月', 43],
    ['6月', 30],
    ['7月', 25],
    ['8月', 71],
    ['9月', 98],
    ['10月', 52],
    ['11月', 64],
    ['12月', 85],
];

function initBarChart(canvas, width, height, dpr) {
    var barChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    bar.chart = barChart;
    barChart.on('click', res => {
        clickBar(res);
    });
    canvas.setChart(barChart);
    barChart.setOption(setBarOption());
    return barChart;
}

function setBarOption() {
    var option = {
        grid: {
            bottom: "8%",
        },
        dataset: {
            source: inputData
        },
        dataZoom: [{
                type: "inside",
                xAxisIndex: 0,
                filterMode: 'none',
                height: 0,
                start: 50
            },
            {
                type: "inside",
                yAxisIndex: 0,
                filterMode: 'none',
                width: 0
            }
        ],
        title: {
            text: "账单分析",
            textStyle: {
                fontSize: 15,
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0
            },
        },
        yAxis: {
            type: 'value',
        },
        tooltip: {
            // trigger: 'axis',
            // axisPointer: {
            //     type: 'shadow'
            // }
        },
        series: [{
            type: 'bar',
            barWidth: "50%"
        }],

    };
    return option;
}

function clickBar(param) {
    //两种做法
    // 暂时作为更新pieChart
    pie.setInpuData(param.name, getMonthData(param.index));
    pie.chart.setOption(setPieOption());
}

/**
 * TODO
 * 得到一个柱子对应的这个月的数据，并对这个月的账单信息进行分类汇总，
 * 并处理为data类型的数据，便于画饼状图
 * @param {int} index 此index代表点击的第几个柱子，柱子从0开始 
 * @returns data是一个数组，类似[["a", 1], ["b", 2], ["c", 3]]
 */
function getMonthData(index) {
    var data = [
        ["支付宝", 500],
        ["微信", 200]
    ];
    return data;
}

function initPieChart(canvas, width, height, dpr) {
    var pieChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    pie.chart = pieChart;
    pie.init("string", "number");
    pie.setInpuData("", []);
    canvas.setChart(pieChart);
    pieChart.setOption(setPieOption());
    pieChart.on('click', res => {
        clickPie(res);
    });
    return pieChart;
}

function setPieOption() {
    var option = {
        title: {
            text: "支出分布",
            textStyle: {
                fontSize: 15
            }
        },
        legend: {
            right: '0%',
            top: '16%',
            orient: "vertical",
        },
        series: [{
            name: pie.name,
            type: 'pie',
            radius: ["50%", "75%"],
            data: convert(pie.pieData, 0),
            label: {
                show: false,
            },
            emphasis: {
                label: {
                    show: true,
                    formatter: function (params) {
                        return params.name + "\n" + params.percent + "%(" + parseFloat(params.value).toFixed(1) + ")";
                    }
                }
            },
        }],
    };
    return option;
}

/**
 * TODO
 * 此方法应该可以在点击一类花费之后，显示此类花费在此月中的全部账单信息，方便进行账单的列表展示。
 * 使用此方法来展示条目。
 * @param {JSON} param 点击之后传进来的参数 
 */
function clickPie(param) {
    console.log(param);
}

function convert(tempData, index) {
    var resultArr = [];
    for (var i in tempData) {
        var tempJson = {};
        tempJson.name = tempData[i][index];
        tempJson.value = tempData[i][1 - index];
        resultArr.push(tempJson);
    }
    return resultArr;
}

/**
 * 修改某一时间数据
 * @param [array] 
 * sample: ['7月', 50]
 */
function modifyMonth(data) {
    var time = data[0];
    for (var x in inputData) {
        if (x[0] === time) {
            x = data;
            return;
        }
    }
    wx.showToast({
      title: '没有符合条件的时间',
    });
}

/**
 * 在最前面添加数据
 * @param [array] 
 * sample: [50， 60]（不包括时间）
 */
function addDataBefore(data) {
    var firstDate = inputData[1][0];
    if (firstDate.substring(firstDate.length - 2, firstDate.length) == '月') {
        var month = firstDate.substring(0, firstDate.length - 2);
        if (month == '1') {
            wx.showToast({
              title: '不能在前面添加',
            });
            return;
        }
        inputData.splice(1, 0, data.unshift((parseInt(month) - 1) + '月'));
    }
    else {
        var time = firstDate.substring(0, firstDate.length - 2);
        inputData.splice(1, 0, '' + data.unshift((parseInt(time) - 1) + firstDate.substring(firstDate.length - 2, firstDate.length)));
    }
}

/**
 * 在最后面添加数据
 * @param [array] 
 * sample: [50， 60]（不包括时间）
 */
function addDataAfter(data) {
    var firstDate = inputData[1][0];
    if (firstDate.substring(firstDate.length - 2, firstDate.length) == '月') {
        var month = firstDate.substring(0, firstDate.length - 2);
        if (month == '12') {
            wx.showToast({
              title: '不能在后面添加',
            });
            return;
        }
        inputData.splice(1, 0, data.unshift((parseInt(month) + 1) + '月'));
    }
    else {
        var time = firstDate.substring(0, firstDate.length - 2);
        inputData.splice(1, 0, '' + data.unshift((parseInt(time) + 1) + firstDate.substring(firstDate.length - 2, firstDate.length)));
    }
}

/**
 * 删除最前面数据
 */
function deleteBefore() {
    if (inputData.length <= 2) {
        wx.showToast({
          title: '不能删了',
        });
        return;
    }
    inputData.splice(1, 1);
}

/**
 * 删除最后面数据
 */
function deleteAfter() {
    if (inputData.length <= 2) {
        wx.showToast({
          title: '不能删了',
        });
        return;
    }
    inputData.pop();
}

/**
 * 在最前面添加数据
 */
function addMonthBefore(data) {
    var firstDate = inputData[1][0];
    if (firstDate.substring(firstDate.length - 2, firstDate.length) == '月') {
        var month = firstDate.substring(0, firstDate.length - 2);
        if (month == '1') {
            wx.showToast({
              title: '不能在前面添加',
            });
            return;
        }
        inputData.splice(1, 0, data.unshift((parseInt(month) - 1) + '月'));
    }
    else {
        var time = firstDate.substring(0, firstDate.length - 2);
        inputData.splice(1, 0, '' + data.unshift((parseInt(time) - 1) + firstDate.substring(firstDate.length - 2, firstDate.length)));
    }
}

Page({
    data: {
        barChart: {
            onInit: initBarChart
        },
        pieChart: {
            onInit: initPieChart
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})