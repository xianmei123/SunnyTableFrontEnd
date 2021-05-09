// pages/showTemplate/showTemplate.js
import * as echarts from '../../ec-canvas/echarts';
var type = "line" // line or bar or pie or scatter 模板类型
var inputData = [
    ['product', 'Matcha Latte', 'Milk Tea', 'Cheese Cocoa'],
    ['2012', 41.1, 86.5, 24.1],
    ['2013', 30.4, 92.1, 24.1],
    ['2014', 65.7, 85.7, 67.2],
    ['2015', 53.3, 83.1, 86.4]
];

function initChart(canvas, width, height, dpr) {
    var tempChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(tempChart);
    var option = {
        legend: {},
        tooltip: {},
        dataset: {
            source: [
                ['product', 'Matcha Latte', 'Milk Tea', 'Cheese Cocoa'],
                ['2012', 41.1, 86.5, 24.1],
                ['2013', 30.4, 92.1, 24.1],
                ['2014', 65.7, 85.7, 67.2],
                ['2015', 53.3, 83.1, 86.4]
            ]
        },
        xAxis: {
            type: 'category',
            axisTick: {
                interval: 0
            },
            axisLabel: {
                interval: 0
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            // These series are in the first grid.
            {
                type: 'bar',
                seriesLayoutBy: 'row'
            },
            {
                type: 'bar',
                seriesLayoutBy: 'row'
            },
            {
                type: 'bar',
                seriesLayoutBy: 'row'
            }
        ]
    };
    tempChart.setOption(option);
    return tempChart;
}

Page({
    data: {
        templateName: "物理实验模板",
        chart: {
            onInit: initChart
        }
    },



    //生命周期函数--监听页面加载

    onLoad: function (options) {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('openTemplate', (data) => {
            console.log(data);
            this.setData({
                type: 
            });
        });
    },


    //生命周期函数--监听页面初次渲染完成

    onReady: function () {

    },


    //生命周期函数--监听页面显示
    onShow: function () {

    },
})

/**
 * option = {
    legend: {},
    tooltip: {},
    dataset: {
        source: [
            ['product', 'Matcha Latte', 'Milk Tea','Cheese Cocoa'],
             ['2012', 41.1 ,86.5, 24.1],
            ['2013', 30.4,92.1,24.1],
            ['2014',65.7,85.7,67.2 ],
            ['2015', 53.3,83.1,86.4]
        ]
    },
    xAxis: [
        {type: 'category', gridIndex: 0},
        {type: 'category', gridIndex: 1}
    ],
    yAxis: [
        {gridIndex: 0},
        {gridIndex: 1}
    ],
    grid: [
        {bottom: '55%'},
        {top: '55%'}
    ],
    series: [
        // These series are in the first grid.
        {type: 'bar', seriesLayoutBy: 'row'},
        {type: 'bar', seriesLayoutBy: 'row'},
        {type: 'bar', seriesLayoutBy: 'row'}
    ]
};
 */