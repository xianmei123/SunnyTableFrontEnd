// pages/draw/draw.js

import * as echarts from '../../ec-canvas/echarts';
import ecStat from 'echarts-stat';
echarts.registerTransform(ecStat.transform.regression);

const baseUrl = 'https://www.jaripon.xyz';
// var inputData = [
//     ['pro', 'sb'],
//     ["2000-06-05", 116],
//     ["2000-06-06", 129],
//     ["2000-06-07", 135],
//     ["2000-06-08", 86],
//     ["2000-06-09", 73],
//     ["2000-06-10", 85],
//     ["2000-06-11", 73],
//     ["2000-06-12", 68],
//     ["2000-06-13", 92],
//     ["2000-06-14", 130],
//     ["2000-06-15", 245],
//     ["2000-06-16", 139],
//     ["2000-06-17", 115],
//     ["2000-06-18", 111],
//     ["2000-06-19", 309],
//     ["2000-06-20", 206],
//     ["2000-06-21", 137],
//     ["2000-06-22", 128],
//     ["2000-06-23", 85],
//     ["2000-06-24", 94],
//     ["2000-06-25", 71],
//     ["2000-06-26", 106],
//     ["2000-06-27", 84],
//     ["2000-06-28", 93],
//     ["2000-06-29", 85],
//     ["2000-06-30", 73],
//     ["2000-07-01", 83],
//     ["2000-07-02", 125],
//     ["2000-07-03", 107],
//     ["2000-07-04", 82],
//     ["2000-07-05", 44],
//     ["2000-07-06", 72],
//     ["2000-07-07", 106],
//     ["2000-07-08", 107],
//     ["2000-07-09", 66],
//     ["2000-07-10", 91],
//     ["2000-07-11", 92],
//     ["2000-07-12", 113],
//     ["2000-07-13", 107],
//     ["2000-07-14", 131],
//     ["2000-07-15", 111],
//     ["2000-07-16", 64],
//     ["2000-07-17", 69],
//     ["2000-07-18", 88],
//     ["2000-07-19", 77],
//     ["2000-07-20", 83],
//     ["2000-07-21", 111],
//     ["2000-07-22", 57],
//     ["2000-07-23", 55],
//     ["2000-07-24", 60]
// ];


// var inputData = [
//     ['product', 'sb', 'lsp'],
//     ['sb1', 41.1, 86.5],
//     ['sb2', 30.4, 92.1],
//     ['sb3', 22, 182],
//     ['sb4', 75, 25],
//     ['sb5', 78, 25],
//     ['sb6', 33, 66],
// ]; // 输入数据
// var inputData = [
//     ['product', 'sb', 'lsp'],
//     [78, 41.1, 86.5],
//     [52, 30.4, 92.1],
//     [85, 22, 182],
//     [86, 75, 25],
//     [42, 78, 25],
//     [36, 33, 66],
// ]; // 输入数据
var inputData = [];
var graph = require('./class');
// var xType = "string"; // 输入数据x轴类型
// var yType = "number"; // 输入数据y轴类型
var xType; // 输入数据x轴类型
var yType;
var line = new graph.LineGraph("line");
var bar = new graph.BarGraph("bar");
var pie = new graph.PieGraph("pie");
var scatter = new graph.ScatterGraph("scatter");
var draftId = null;

var draftNum = 0;
var graphName = ""; // 在图的最上方显示的标题
var xName = "";
var yName = "";
var indexToGraph = [line, bar, pie, scatter];
var typeToIndex = new Map([
    ["line", 0],
    ["bar", 1],
    ["pie", 2],
    ["scatter", 3]
]);

var indexToSymbol = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none']

var templates = {
    "lineTemplates": [],
    "barTemplates": [],
    "pieTemplates": [],
    "scatterTemplates": [],
};

var tempIdToTemplate = new Map();

function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function convertNum(val) {
    console.log(val);
    if (val == "" || val == null || val == undefined) {
        return "";
    } else if (isNumber(val)) {
        console.log("trrr");
        return parseFloat(val);
    }
    return val;
}

/**
 * 初始化折线图
 * 
 * 初始化折线图画图对象
 */
function initLineChart(canvas, width, height, dpr) {
    line.init(xType, yType);
    var lineChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    line.chart = lineChart;
    canvas.setChart(lineChart);
    if (isShowLineChart()) {
        line.chart = setLineOption(line.chart, line.template);
    } else {
        getPage().setData({
            showLineChart: false
        });
    }
    console.log("init LineGraph Success!!");
    return lineChart;
}

function getSplit(tempArr) {
    return tempArr.split(" ").map(item => {
        return JSON.parse(item);
    });
}

/**
 * 设置折线图画图option
 * 
 * 传入需要被设置option的lineChart
 * 对此对象进行设置option
 * @param {*} lineChart 
 * @returns 设置option成功后的lineChart
 */
function setLineOption(lineChart, template) {
    lineChart.clear();
    var series = [];
    var option;
    var areaStyle = template.areaStyle.split(" ");
    var showArea = getSplit(template.showArea);
    var showEmphasis = getSplit(template.showEmphasis);
    var showMinMarkPoint = getSplit(template.showMinMarkPoint);
    var showMaxMarkPoint = getSplit(template.showMaxMarkPoint);
    var showAverageMarkLine = getSplit(template.showAverageMarkLine);
    var stack = template.stack.split(" ");

    if (template.stack != "" && xType === "number" && !isSetStack) {
        getPage().setData({
            errorLineChart: '请输入数据进行画图'
        });
    }

    for (var i = 1; i < inputData[0].length; i++) {
        var name = inputData[0][i];
        var tempJson = {
            name: name,
            type: "line",
            smooth: template.smooth,
            symbolSize: template.radius,
            showSymbol: template.showSymbol,
            markPoint: {
                symbol: indexToSymbol[template.markPointStyle],
                symbolSize: template.markPointSize,
                data: [],
                label: {
                    show: true
                }
            },
            markLine: {
                data: []
            },
            stack: stack[i - 1],
            color: template.color[i - 1],
            encode: {
                x: 0,
                y: i
            }
        };
        if (showArea[i - 1]) {
            tempJson.areaStyle = {
                color: areaStyle[i - 1]
            };
        }

        if (showEmphasis[i - 1]) {
            tempJson.emphasis = {
                foucs: "series"
            }
        }
        if (showMinMarkPoint[i - 1]) {
            tempJson.markPoint.data.push({
                type: 'min'
            });
        }
        if (showMaxMarkPoint[i - 1]) {
            tempJson.markPoint.data.push({
                type: 'max'
            });
        }
        if (showAverageMarkLine[i - 1]) {
            tempJson.markLine.data.push({
                type: 'average'
            });
        }
        series.push(tempJson);
    }
    option = {
        dataset: {
            source: inputData
        },
        dataZoom: [{
                type: "inside",
                xAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: "inside",
                yAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: "slider",
                xAxisIndex: 0,
                filterMode: 'none',
                show: false,
                height: 0
            },
            {
                type: "slider",
                yAxisIndex: 0,
                filterMode: 'none',
                show: false,
                width: 0
            }
        ],
        grid: {
            bottom: "10%",
            left: '0%',
            containLabel: true
        },
        title: {
            text: graphName,
            left: "center",
            textStyle: {
                color: template.textColor,
                fontSize: template.font
            }
        },
        xAxis: {
            name: xName,
            type: line.xType == "string" ? 'category' : 'value',
            boundaryGap: !(line.xType === "string"),
            axisLine: {
                onZero: false,
            }
        },
        yAxis: {
            name: yName,
            type: line.yType == "string" ? 'category' : 'value',
            boundaryGap: !(line.yType === "string"),
            axisLine: {
                onZero: false
            },
        },
        legend: {
            right: '0%',
            top: '16%',
            orient: "vertical",
        },
        series: series
    };
    console.log(option);
    setToolBox(option);
    setLegendOption(option, template.legendPos);
    lineChart.setOption(option); // 
    if (template.showGradient) {
        option.visualMap = {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            inRange: {
                color: ["#839d14"],
                colorLightness: template.colorLightness.split(" ").map(item => {
                    return parseFloat(item)
                }),
                colorSaturation: template.colorSaturation.split(" ").map(item => {
                    return parseFloat(item)
                }),
                colorHue: template.colorHue.split(" ").map(item => {
                    return parseFloat(item)
                })
            }
        }
        if (template.showXGradient) {
            if (xType === "string") {
                option.visualMap.min = 0;
                option.visualMap.max = (inputData.length - 2);
            } else if (xType === "number") {
                option.visualMap.min = lineChart.getModel().getComponent('xAxis', 0).axis.scale._extent[0];
                option.visualMap.max = lineChart.getModel().getComponent('xAxis', 0).axis.scale._extent[1];
            }
            option.visualMap.dimension = 0
        }
        if (template.showYGradient) {
            if (yType === "string") {
                option.visualMap.min = 0;
                option.visualMap.max = inputData.length - 1;
            } else if (yType === "number") {
                option.visualMap.min = lineChart.getModel().getComponent('yAxis', 0).axis.scale._extent[0];
                option.visualMap.max = lineChart.getModel().getComponent('yAxis', 0).axis.scale._extent[1];
            }
        }
        lineChart.setOption(option);
    }
    if (template.showDigit) {
        lineChart.setOption({
            tooltip: {
                trigger: 'axis',
                // formatter: function (params) {
                //     console.log(params);
                //     var xstr = line.xType === "string" ? params[0].data[0] : parseFloat(params[0].data[0]).toFixed(2);
                //     var ystr = line.yType === "string" ? params[0].data[1] : parseFloat(params[0].data[1]).toFixed(2);
                //     return 'X: ' +
                //         xstr +
                //         '\nY: ' +
                //         ystr;
                // }
            },
        });
    }
    return lineChart;
}

/**
 * 
 * 初始化条形图
 * 初始化条形图画图对象
 * @returns 
 */
function initBarChart(canvas, width, height, dpr) {
    bar.init(xType, yType);
    var barChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    bar.chart = barChart;
    canvas.setChart(barChart);
    if (isShowBarChart()) {
        barChart = setBarOption(barChart, bar.template);
    } else {
        getPage().setData({
            showBarChart: false
        });
    }
    console.log("init BarGraph Success!!");
    return barChart;
}
/**
 * 设置条形图画图option
 * 
 * 传入需要被设置option的barChart
 * 对此对象进行设置option
 * @param {} barChart 
 * @returns 设置option成功后的barChart
 */
function setBarOption(barChart, template) {
    barChart.clear();
    var showEmphasis = getSplit(template.showEmphasis);
    var showMinMarkPoint = getSplit(template.showMinMarkPoint);
    var showMaxMarkPoint = getSplit(template.showMaxMarkPoint);
    var showAverageMarkLine = getSplit(template.showAverageMarkLine);
    var stack = template.stack.split(" ");
    var series = [];
    var option;
    for (var i = 1; i < inputData[0].length; i++) {
        var name = inputData[0][i];
        var tempJson = {
            name: name,
            type: "bar",
            barWidth: template.width,
            barGap: template.gap,
            color: template.color[i - 1],
            markPoint: {
                symbol: indexToSymbol[template.markPointStyle],
                symbolSize: template.markPointSize,
                data: [],
                label: {
                    show: true
                }
            },
            markLine: {
                data: []
            },
            stack: stack[i - 1],
            color: template.color[i - 1],
            encode: {
                x: 0,
                y: i
            }
        };
        if (showEmphasis[i - 1]) {
            tempJson.emphasis = {
                focus: 'series'
            }
        }
        if (showMinMarkPoint[i - 1]) {
            tempJson.markPoint.data.push({
                type: 'min'
            });
        }
        if (showMaxMarkPoint[i - 1]) {
            tempJson.markPoint.data.push({
                type: 'max'
            });
        }
        if (showAverageMarkLine[i - 1]) {
            tempJson.markLine.data.push({
                type: 'average'
            });
        }
        series.push(tempJson);
    }
    option = {
        dataset: {
            source: inputData
        },
        grid: {
            bottom: "10%",
            left: '0%',
            containLabel: true
        },
        dataZoom: [{
                type: "inside",
                xAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: "slider",
                xAxisIndex: 0,
                filterMode: 'none',
                show: false,
                height: 0
            },
            {
                type: "slider",
                yAxisIndex: 0,
                filterMode: 'none',
                show: false,
                width: 0,
            }
        ],
        title: {
            text: graphName,
            left: "center",
            textStyle: {
                color: template.textColor,
                fontSize: template.font
            }
        },
        xAxis: [{
            name: xName,
            type: xType === "string" ? 'category' : 'value',
            // axisLine: {
            //     onZero: false
            // }
        }],
        yAxis: [{
            name: yName,
            type: yType === "string" ? 'category' : 'value',
            // axisLine: {
            //     onZero: false
            // }
        }],
        series: series
    };
    setToolBox(option);
    setLegendOption(option, template.legendPos);
    barChart.setOption(option);
    if (template.showDigit) {
        barChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            // tooltip: {
            //     trigger: "item"
            // }
        });
    }
    return barChart;
}

/**
 * 初始化饼状图
 * 
 * 初始化饼状图画图对象
 */
function initPieChart(canvas, width, height, dpr) {
    // 由于pie图无法进行拖拽，直接从全局输入数据中取数据即可，对象中不需要保存。
    var pieChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    pie.chart = pieChart;
    canvas.setChart(pieChart);
    if (isShowPieChart()) {
        pieChart = setPieOption(pieChart, pie.template);
    } else {
        getPage().setData({
            showPieChart: false
        });
    }
    console.log("init PieGraph Success!!");
    return pieChart;
}
/**
 * 设置饼状图画图option
 * 
 * 传入需要被设置option的pieChart
 * 对此对象进行设置option
 * @param {} pieChart 
 * @returns 设置option成功后的pieChart
 */
function setPieOption(pieChart, template) {
    pieChart.clear();
    var option;
    var series = [];
    var legendArr = template.legendPos.split(",");
    var tempJson = {
        name: pie.name,
        type: 'pie',
        radius: template.radius,
        avoidLabelOverlap: true,
        label: {
            show: template.showLabel,
            fontSize: template.labelFont
        },
        itemStyle: {
            borderRadius: template.borderRadius
        },
        data: pie.convertToPieData(pie.pieData, )
    };

    var tempJsonRing = {
        name: pie.name,
        type: 'pie',
        radius: template.radius.split(" "),
        avoidLabelOverlap: false,
        label: {
            show: template.showLabel,
            position: 'center'
        },
        emphasis: {
            label: {
                show: true,
                fontSize: template.labelFont,
                fontWeight: 'bold'
            }
        },
        itemStyle: {
            borderRadius: template.borderRadius
        },
        data: pie.convertToPieData(pie.pieData)
    }
    series.push(template.showRing ? tempJsonRing : tempJson);
    if (template.showRose) {
        series[0].roseType = template.roseType;
    }
    option = {
        grid: {
            bottom: "10%",
            left: '0%',
            containLabel: true
        },
        title: {
            text: graphName,
            left: 'center',
            textStyle: {
                color: template.textColor,
                fontSize: template.titleFont
            }
        },
        tooltip: {
            trigger: 'item',
            textStyle: {
                fontSize: template.labelFont
            },
            formatter: function (params) {
                var result;
                if (template.showPercent) {
                    result = params.name + ": " + params.percent + "%(" + parseFloat(params.value).toFixed(template.precision) + ")";
                } else {
                    result = params.name + ": " + parseFloat(params.value).toFixed(template.precision);
                }
                return result;
            }
        },
        series: series
    };
    setLegendOption(option, template.legendPos);
    setToolBox(option);
    pieChart.setOption(option);
    return pieChart;
}

/**
 * 初始化散点图
 * 
 * 初始化散点图画图对象
 */
function initScatterChart(canvas, width, height, dpr) {
    scatter.init(inputData, xType, yType);
    var scatterChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    scatter.chart = scatterChart;
    canvas.setChart(scatterChart);
    if (isShowScatterChart()) {
        getPage().setData({
            showScatterChart: true
        });
        scatterChart = setScatterOption(scatterChart, scatter.template);
    } else {
        getPage().setData({
            showScatterChart: false
        });
    }
    console.log("init ScatterGraph Success!!");
    return scatterChart;

}
/**
 * 设置散点图画图option
 * 
 * 传入需要被设置option的scatterChart
 * 对此对象进行设置option
 * @param {} scatterChart 
 * @returns 设置option成功后的scatterChart
 */
function setScatterOption(scatterChart, template) {
    scatterChart.clear();
    var series = [];
    for (var i = 1; i < inputData[0].length; i++) {
        var name = inputData[0][i];
        var tempJson = {
            name: name,
            type: "scatter",
            // symbolSize: template.increase ? function (data, params) {
            //     return Math.sqrt(data[1]) * 7; // 开方 此函数不能处理负数
            // } : 15,
            symbolSize: 15,
            itemStyle: {
                color: template.color[i - 1],
            },
            encode: {
                x: 0,
                y: i
            }
        };
        series.push(tempJson);
    }

    var option = {
        dataset: [{
            source: inputData
        }],

        dataZoom: [{
                type: "inside",
                xAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: "inside",
                yAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: "slider",
                xAxisIndex: 0,
                filterMode: 'none',
                height: 0,
                show: false,
            },
            {
                type: "slider",
                yAxisIndex: 0,
                filterMode: 'none',
                width: 0,
                show: false,
            }
        ],
        grid: {
            bottom: "10%",
            left: '0%',
            containLabel: true
        },
        title: {
            text: graphName,
            left: 'center',
            textStyle: {
                color: template.textColor,
                fontSize: template.font
            }
        },
        xAxis: {
            name: xName,
            type: scatter.xType === "string" ? "category" : "value",
            boundaryGap: xType === "string" ? false : true,

        },
        yAxis: {
            name: yName,
            type: scatter.yType === "string" ? "category" : "value",
            boundaryGap: yType === "string" ? false : true
        },
        tooltip: {
            trigger: 'item'
        },
        series: series,
    };
    var indexToTransform = [{
            transform: {
                type: 'ecStat:regression'
            }
        },
        {
            transform: {
                type: 'ecStat:regression',
                config: {
                    method: 'exponential',
                }
            }
        },
        {
            transform: {
                type: 'ecStat:regression',
                config: {
                    method: 'logarithmic'
                }
            }
        },
        {
            transform: {
                type: 'ecStat:regression',
                config: {
                    method: 'polynomial',
                    order: 3
                }
            }
        }
    ]
    if (JSON.parse(template.useRegression)) {
        // if (JSON.parse("true")) {
        option.dataset.push(indexToTransform[parseInt(template.indexRegression)]);
        option.series.push({
            type: 'line',
            smooth: true,
            datasetIndex: option.dataset.length - 1,
            symbolSize: 0.1,
            symbol: 'circle',
            label: {
                show: true,
                fontSize: 16
            },
            labelLayout: {
                dx: -20
            },
            encode: {
                label: 2,
                tooltip: 1
            }
        });
    }
    setToolBox(option);
    setLegendOption(option, template.legendPos);
    scatterChart.setOption(option);
    return scatterChart;
}

Page({
    data: {
        /**0 表示 为竖屏，1表示为横屏*/
        screenDirection: wx.getStorageSync('system'),
        actionSheetHidden: true,
        graphName: "", // 在图的最上方显示的标题
        xName: "",
        yName: "",
        option1: [{
                text: '折线图',
                value: 'line'
            },
            {
                text: '柱状图',
                value: 'bar'
            },
            {
                text: '饼状图',
                value: 'pie'
            },
            {
                text: '散点图',
                value: 'scatter',
            }
        ],
        option2: [{
                text: '表格',
                value: 'excel'
            },
            {
                text: '文字',
                value: 'text'
            },
        ],
        value1: 'line',
        value2: 'excel',
        showLineChart: true,
        showBarChart: true,
        showPieChart: true,
        showScatterChart: true,
        errorLineChart: "请您输入数据进行画图。",
        errorBarChart: "请您输入数据进行画图。",
        errorPieChart: "请您输入数据进行画图，并在下方选择您要画的饼图序号。",
        errorScatterChart: "请您输入数据进行画图。\ntip：散点图只能绘制横纵坐标全为数值的图。",

        /**是否战术输入模板名字 */
        showInputTemplateName: false,
        inputTemplateName: "",
        /**是否展示底部保存的上拉列表 */
        showSaveSheet: false,
        showEditSheet: false,
        editTableOptions: [{
            name: "增加行",
            value: 0
        }, {
            name: "增加列",
            value: 1
        }, {
            name: "删除行",
            value: 2
        }, {
            name: "删除列",
            value: 3
        }, {
            name: "求和",
            value: 4
        }, {
            name: "计算均值",
            value: 5
        }, {
            name: "计算方差",
            value: 6
        }],
        saveSheetOptions: [{
            name: "保存模板",
            value: 0
        }, {
            name: "保存图表",
            value: 1
        }, {
            name: "导出到.xls文件",
            value: 2
        }, {
            name: "保存图到相册",
            value: 3,
        }],

        showNewSheet: false,
        newSheetOptions: [{
                name: "创建新的图",
                value: 0
            },
            {
                name: "导入数据",
                value: 1,
            }
        ],

        /**是否展示表格 */
        isHideTabel: "block",
        lineChart: {
            onInit: initLineChart
        },
        barChart: {
            onInit: initBarChart
        },
        pieChart: {
            onInit: initPieChart
        },
        scatterChart: {
            onInit: initScatterChart
        },
        iterator1: [1, 2],
        iterator2: [1, 2],
        datas: [
            ["", ""],
            ["", ""]
        ], //每一行是同一数据组
        xValues: [
            "", ""
        ],
        groupName: ["", ""],
        groupNum: 2,
        x1: 0, //数据组
        y1: 0, //横坐标
        x2: 0,
        y2: 0,
        currentCell: "",
        defaultRegion: true, //是否选过
        region: [0, 0],
        pieChartNo: 0,
        average: [],
        variance: [],
        placeData: "" //第一行显示
    },
    changeChart(event) {
        var value = event.detail;
        var newFirstHolder = (value == "line") ? "折线" :
            (value == "bar") ? "柱" :
            (value == "pie") ? "饼" :
            (value == "scatter") ? "散点组" : "";
        // 更换图的时候，更新此图模板的数据
        var newOption2 = [];
        for (var template of templates[value + 'Templates']) {
            newOption2.push({
                text: template.name,
                value: template.id
            });
        }
        this.setData({
            option2: newOption2,
            value2: newOption2[0].value,
            placeData: newFirstHolder
        });
    },
    changeTemplate(event) {
        //console.log(tempIdToTemplate.get(event.detail));
        updateTemplate(typeToIndex.get(this.data.value1), tempIdToTemplate.get(event.detail));
    },
    reGetTemplate() {
        var newOption2 = [];
        for (var template of templates[this.data.value1 + 'Templates']) {
            newOption2.push({
                text: template.name,
                value: template.id
            });
        }
        this.setData({
            option2: newOption2,
        });
    },
    actionEditTable() {
        this.setData({
            showEditSheet: !this.data.showEditSheet
        })
    },
    actionSheetbindchange() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    onCloseInputTempName() {
        this.setData({
            showInputTemplateName: false,
            inputTemplateNameL: ""
        });
    },
    isSaveTemplate() {
        this.setData({
            showInputTemplateName: true
        })
    },
    onInputName(event) {
        this.setData({
            inputTemplateName: event.detail
        });
    },
    onCloseEditTable() {
        this.setData({
            showEditSheet: false
        });
    },
    onSelectEditTable(event) {
        var funs = [this.addX, this.addDataGroup, this.delX, this.delGroup, this.calculateSum, this.calculateAverage, this.calculateVariance];
        funs[event.detail.value]();
    },
    onCloseSaveSheet() {
        this.setData({
            showSaveSheet: false
        });
    },
    onSelectSaveOption(event) {
        var funs = [this.isSaveTemplate, this.saveChart, this.exportToCSV, saveImage];
        funs[event.detail.value]();
    },
    beginShowSaveSheet() {
        this.setData({
            showSaveSheet: true
        })
    },

    beginShowNewSheet() {
        this.setData({
            showNewSheet: true
        })
    },
    onCloseNewSheet() {
        this.setData({
            showNewSheet: false
        })
    },
    onSelectNewOption(event) {
        if (event.detail.value == 0) {
            wx.redirectTo({
                url: '../index/index'
            })
        } else if (event.detail.value == 1) {
            wx.chooseMessageFile({
                count: 1,
                type: 'file',
                extension: ['xls', 'xlsx'],
                success: res => {
                    console.log("success");
                    console.log(res);
                    const path = res.tempFiles[0].path;
                    wx.uploadFile({
                        url: 'https://www.jaripon.xyz/data/readFile/' + wx.getStorageSync('uid'),
                        filePath: path,
                        name: 'file',
                        success: res => {
                            var data = JSON.parse(res.data);
                            /**
                             * TODO
                             * data 为 dataset的对象，需要填到表格中
                             */
                            var newGroupName = [];
                            var newDatas = [];
                            var dataArray = data["dataArray"];
                            var i;
                            console.log(dataArray);
                            for (i = 1; i < dataArray.length; i++) {
                                newGroupName.push(dataArray[i]["name"]);
                                newDatas.push(dataArray[i]["lineData"]);
                            }
                            var ni1 = []
                            var ni2 = []
                            for (var i = 0; i < newGroupName.length; i++) {
                                ni2.push(i + 1);
                            }
                            for (var i = 0; i < dataArray[0]["lineData"].length; i++) {
                                ni1.push(i + 1);
                            }
                            this.setData({
                                iterator1: ni1,
                                iterator2: ni2,
                                xValues: dataArray[0]["lineData"],
                                datas: newDatas,
                                groupName: newGroupName,
                                groupNum: newDatas.length
                            })
                            console.log(this.data.xValues);
                        },
                        fail: res => {
                            console.log("falied")
                            console.log(res);
                        }
                    })
                }
            })
        }
    },
    async onLoad() {
        var hepler = require('../storage/helper');
        var types = ["barTemplates", "lineTemplates", "pieTemplates", "scatterTemplates"];
        var urls = ['/template/barchart/open/', '/template/linechart/open/', '/template/fanchart/open/', '/template/scatterplot/open/']
        var res = await hepler.trans(baseUrl + '/template/chart/display/' + wx.getStorageSync('uid') + '/' + 65535);
        for (var i of res.data) {
            var url = baseUrl + urls[i.type - 1] + i.fid;
            var template = await hepler.trans(url);
            var tempData = convertFromBackTemplate(template.data, types[i.type - 1].split("Template")[0])
            templates[types[i.type - 1]].push(tempData);
            tempIdToTemplate.set(i.fid, tempData);
            //console.log(tempIdToTemplate.get(i.fid));
        }
        console.log("tempIdToTemplate", tempIdToTemplate);
        line.template = templates["lineTemplates"][0];
        bar.template = templates["barTemplates"][0];
        pie.template = templates["pieTemplates"][0];
        scatter.template = templates["scatterTemplates"][0];

        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel) {
            eventChannel.on("openData", res => {
                this.openData(res.data)
            });
            eventChannel.on("openChart", res => {
                this.openChart(res.data)
            })
            eventChannel.on("goDraw", res => {
                var value = res.value;
                var newOption2 = [];
                for (var template of templates[value + 'Templates']) {
                    newOption2.push({
                        text: template.name,
                        value: template.id
                    });
                }
                this.setData({
                    value1: value,
                    option2: newOption2,
                    value2: newOption2[0].value,
                    placeData: (value == "line") ? "折线" : (value == "bar") ? "柱" : (value == "pie") ? "饼" : (value == "scatter") ? "散点组" : ""
                });
            });
        }
    },
    hideTabel() {
        this.setData({
            isHideTabel: this.data.isHideTabel === "none" ? "block" : "none"
        });
        resetCharts(this.data.value1);
    },
    setChartName(event) {
        this.data.graphName = event.detail;
        graphName = event.detail;
    },
    setXName(event) {
        this.data.xName = event.detail;
        xName = event.detail;
    },
    setYName(event) {
        this.data.yName = event.detail;
        yName = event.detail;
    },
    changeRegion: function (event) {
        var newRegion = [event.target.dataset.a, event.target.dataset.b];
        console.log("现在是" + newRegion[0] + newRegion[1]);
        this.setData({
            region: newRegion
        });
    },
    getXValue: function (event) {
        var index = event.target.dataset.a;
        var newXValue = this.data.xValues;
        newXValue[index - 1] = event.detail;
        console.log(newXValue[index - 1]);
        this.setData({
            xValues: newXValue
        })
        this.changeCurrentX(event);
    },
    changeCurrent(event) {
        var groupId = event.target.dataset.a;
        var dataId = event.target.dataset.b;
        var newData = this.data.datas;
        this.setData({
            currentCell: newData[groupId - 1][dataId - 1]
        });
    },
    changeCurrentGroupName(event) {
        var groupId = event.target.dataset.a + 1;
        this.setData({
            currentCell: this.data.groupName[groupId - 1]
        });

    },
    changeCurrentX(event) {
        var dataId = event.target.dataset.a;
        this.setData({
            currentCell: this.data.xValues[dataId - 1]
        });

    },
    getData: function (event) {
        var groupId = event.target.dataset.a;
        var dataId = event.target.dataset.b;
        var newDatas = this.data.datas;
        newDatas[groupId - 1][dataId - 1] = event.detail;
        this.setData({
            datas: newDatas,
        });
        this.changeCurrent(event);
    },
    addDataGroup: function () {
        if (this.data.groupNum == 10) {
            wx.showToast({
                title: '最多10列',
                icon: "error"
            });
            return;
        }
        var newIterator2 = this.data.iterator2;
        var newDatas = this.data.datas;
        var newGroupName = this.data.groupName;
        newDatas.push([]);
        newIterator2.push(newIterator2.length + 1);
        newGroupName.push("");
        this.setData({
            datas: newDatas,
            iterator2: newIterator2,
            groupName: newGroupName,
            groupNum: this.data.groupNum + 1
        })

    },
    setGroupName: function (event) {
        var index = event.target.dataset.a;
        var newGroupName = this.data.groupName;
        newGroupName[index] = event.detail;
        this.setData({
            groupName: newGroupName
        })
        this.changeCurrentGroupName(event);
    },
    addX: function () {
        if (this.data.xValues.length == 20) {
            wx.showToast({
                title: '最多20个横坐标',
                icon: "error"
            });
            return;
        }
        var newIterator1 = this.data.iterator1;
        var newXValues = this.data.xValues;
        newIterator1.push(newIterator1.length + 1);
        newXValues.push("");
        this.setData({
            iterator1: newIterator1,
            xValues: newXValues
        })
    },
    delGroup: function () {
        var newIterator2 = this.data.iterator2;
        var newDatas = this.data.datas;
        var newGroupName = this.data.groupName;
        newGroupName.splice(this.data.region[0], 1);
        newDatas.splice(this.data.region[0], 1);
        newIterator2.pop();
        this.setData({
            datas: newDatas,
            groupName: newGroupName,
            iterator2: newIterator2,
            groupNum: this.data.groupNum - 1,
            currentCell: ""
        })

    },
    delX: function () {
        var newIterator1 = this.data.iterator1;
        var newXValues = this.data.xValues;
        var newDatas = this.data.datas;
        newIterator1.pop();
        newXValues.pop();
        var i;
        for (i = 0; i < newDatas.length; i++) {
            newDatas[i].pop();
        }
        this.setData({
            iterator1: newIterator1,
            xValues: newXValues,
            datas: newDatas,
            currentCell: ""
        })

    },
    giveData: function (givenData) {
        this.setData({
            datas: givenData
        })

    },
    judgeXType: function () {
        var i;
        for (i = 0; i < this.data.xValues.length; i++) {
            if (this.data.xValues[i] == "") {
                return "error";
            }
            if (!isNumber(this.data.xValues[i])) {
                return "string";
            }
        }
        return "number";
    },
    judgeYType: function () {
        var i, j;
        for (i = 0; i < this.data.groupNum; i++) {
            for (j = 0; j < this.data.xValues.length; j++) {
                if (this.judgeColumnType(this.data.datas[i]) == 0) {
                    continue;
                }
                if (this.judgeColumnType(this.data.datas[i]) == -1) {
                    return "error";
                }
                if (!isNumber(this.data.datas[i][j])) {
                    return "string";
                }
            }
        }
        return "number";
    },
    judgeColumnType(column) { //返回 -1 错误 0 空 1 正确
        for (var i = 0; i < column.length; i++) {
            if (column[i] == "") {
                if (i == 0) {
                    for (var j = 1; j < column.length; j++) {
                        if (column[j] != "") {
                            return -1;
                        }
                    }
                    return 0;
                } else {
                    return -1;
                }
            }
        }
        return 1;
    },
    convertPaintData: function () { //转化所需数据
        var ret = [];
        var flag = [];
        var i;
        var j;
        for (i = 0; i < this.data.groupNum; i++) {
            if (this.judgeColumnType(this.data.datas[i]) == 0) {
                flag.push(i);
            }
        }
        var group = [];
        group.push("");
        for (i = 0; i < this.data.groupNum; i++) {
            if (flag.indexOf(i) < 0) {
                group.push(this.data.groupName[i]);
            }
        }
        ret.push(group);
        for (i = 0; i < this.data.xValues.length; i++) {
            var tmp = [];
            tmp.push(convertNum(this.data.xValues[i]));
            for (j = 0; j < this.data.groupNum; j++) {
                if (flag.indexOf(j) < 0) {
                    tmp.push(convertNum(this.data.datas[j][i]));
                }
            }
            ret.push(tmp);
        }
        console.log(ret);
        return ret;
    },
    resetData: function (newData) {
        if (this.data.defaultRegion) {
            this.data.x1 = 1;
            this.data.x2 = this.data.groupNum;
            this.data.y1 = 1;
            this.data.y2 = this.data.xValues.length;
        }
        for (var i = this.data.x1 - 1; i < this.data.x2; i++) {
            var reset = this.data.datas;
            for (var j = this.data.y1 - 1; j < this.data.y2; j++) {
                reset[i][j] = newData[this.data.groupName[i]][j][1];
            }
        }
        this.setData({
            datas: reset
        })
    },
    choosePieChart(event) {
        this.setData({
            pieChartNo: event.detail - 1
        });
    },
    repaint: function () {
        inputData = this.convertPaintData();
        xType = this.judgeXType();
        console.log(xType);
        yType = this.judgeYType();
        console.log(yType);
        updateShow();
        switch (this.data.value1) {
            case "line":
                updateLineData(inputData);
                break;
            case "bar":
                updateBarData(inputData);
                break;
            case "pie":
                var dat = [];
                for (var i = 0; i < this.data.xValues.length; i++) {
                    dat.push([this.data.xValues[i], this.data.datas[this.data.pieChartNo][i]]);
                }
                updatePieData(this.data.groupName[this.data.pieChartNo], dat);
                console.log(this.data.groupName[this.data.pieChartNo], dat)
                break;
            case "scatter":
                updateScatterData(inputData);
                break;
        }
    },
    goAttribute() {
        var index;
        switch (this.data.value1) {
            case "line":
                index = 0;
                break;
            case "bar":
                index = 1;
                break;
            case "pie":
                index = 2;
                break;
            case "scatter":
                index = 3;
                break;
        }
        var groupName = getPage().data.groupNum
        wx.navigateTo({
            url: '../attribute/attribute',
            events: {
                back: (backData) => {
                    getPage().setData({
                        screenDirection: wx.getStorageSync('system'),
                    });
                    console.log(backData.template);
                    updateTemplate(index, backData.template);

                }
            },
            success(result) {
                console.log(index, indexToGraph[index].template);
                result.eventChannel.emit("changeTemplate", {
                    index: index,
                    template: indexToGraph[index].template,
                    count: groupName
                });
            },

        });
    },
    //导出csv
    exportToCSV() {
        wx.showLoading({
            title: '保存中',
        })
        var i;
        var dataArray = [];
        dataArray.push({
            "name": "xLabel",
            "cid": null,
            "lineData": this.data.xValues,
        });
        for (i = 0; i < this.data.groupNum; i++) {
            var obj = {
                "name": this.data.groupName[i],
                "cid": null,
                "lineData": this.data.datas[i]
            }
            dataArray.push(obj);
        }
        wx.request({
            url: "https://www.jaripon.xyz/data/export/" + wx.getStorageSync('uid') + "/" + "1",
            data: {
                "id": null,
                "name": graphName,
                // "userId": wx.getStorageSync('uid'),
                "type": "csv",
                "dataArray": dataArray
            },
            method: "POST",
            success: function (res) {
                console.log(res);
                wx.downloadFile({
                    url: "https://www.jaripon.xyz/data/getFile/" + wx.getStorageSync('uid') + "/" + "1",
                    filePath: wx.env.USER_DATA_PATH + '/table.xls',
                    success: function (res) {
                        wx.hideLoading()
                        wx.showToast({
                            title: "保存成功",
                            duration: 500
                        })
                        setTimeout(function () {
                            wx.showLoading({
                                title: '正在打开',
                            })
                        }, 500)
                        setTimeout(function () {
                            wx.hideLoading()
                            var filePath = res.filePath
                            wx.openDocument({
                                filePath: filePath,
                                showMenu: true //表示右上角是否有转发按钮
                            })
                        }, 1000)

                    },
                    fail: function () {
                        wx.hideLoading()
                        wx.showToast({
                            title: "保存失败",
                            icon: "error"
                        })
                    }
                })
            },
            fail: function () {
                wx.hideLoading()
                wx.showToast({
                    title: "保存失败",
                    icon: "error"
                })
            }
        });
    },
    //打开数据
    openData: function (data) {
        var newGroupName = [];
        var newDatas = [];
        var dataArray = data["dataArray"];
        var i;
        for (i = 1; i < dataArray.length; i++) {
            newGroupName.push(dataArray[i]["name"]);
            newDatas.push(dataArray[i]["lineData"]);
        }
        console.log('newDatas', newDatas)
        this.setData({
            xValues: dataArray[0]["lineData"],
            datas: newDatas,
            groupName: newGroupName
        })
    },
    //导出数据
    exportData() {
        var i;
        var dataArray = [];
        for (i = 0; i < this.data.groupNum; i++) {
            var obj = {
                "name": this.data.groupName[i],
                "cid": null,
                "lineData": this.data.datas[i]
            }
            dataArray.push(obj);
        }
        wx.request({
            url: "https://www.jaripon.xyz/data/export/" + this.judgeXType(),
            data: {
                "id": null,
                "name": null,
                "userId": wx.getStorageSync('uid'),
                "dataArray": dataArray
            },
            method: "POST",
            success: function (res) {
                console.log(res);
            },
            fail: function () {
                console.log("error");
            }
        });
    },
    //保存图表
    saveChart() {
        var ret = {};
        ret["id"] = null;
        console.log(graphName);
        ret["name"] = graphName;
        ret["xlabel"] = xName;
        ret["ylabel"] = yName;
        ret["xid"] = 0;
        ret["yid"] = [0, 0];
        ret["xbegin"] = (this.data.defaultRegion) ? 0 :
            (this.data.x1 > this.data.x2) ? this.data.x2 : this.data.x1;
        ret["ybegin"] = (this.data.defaultRegion) ? 0 :
            (this.data.y1 > this.data.y2) ? this.data.y2 : this.data.y1;
        ret["length"] = 3;
        ret["width"] = 4;
        var data = {};
        data["id"] = null;
        data["name"] = graphName;
        data['userId'] = wx.getStorageSync('uid');
        var i;
        var dataArray = [];
        dataArray.push({
            "name": "xLabel",
            "cid": null,
            "lineData": this.data.xValues
        });
        for (i = 0; i < this.data.groupNum; i++) {
            var obj = {
                "name": this.data.groupName[i],
                "cid": null,
                "lineData": this.data.datas[i]
            }
            dataArray.push(obj);
        }
        data["dataArray"] = dataArray;
        ret["data"] = data;
        var url;
        if (this.data.value1 == "bar") {
            bar.template.isVisible = "false";
            bar.template.userId = wx.getStorageSync('uid');
            ret["barChart"] = convertToBackTemplate(bar.template, "bar");
            ret["barChart"]["name"] = Date.now();
            url = "https://www.jaripon.xyz/chart/barchart/save";
        }
        if (this.data.value1 == "line") {
            line.template.isVisible = "false";
            line.template.userId = wx.getStorageSync('uid');
            ret["lineChart"] = convertToBackTemplate(line.template, "line");
            ret["lineChart"]["name"] = Date.now();
            url = "https://www.jaripon.xyz/chart/linechart/save"
        }
        if (this.data.value1 == "pie") {
            pie.template.isVisible = "false";
            pie.template.userId = wx.getStorageSync('uid');
            ret["fanChart"] = convertToBackTemplate(pie.template, "pie");
            ret["fanChart"]["name"] = Date.now();
            url = "https://www.jaripon.xyz/chart/fanchart/save"
        }
        if (this.data.value1 == "scatter") {
            scatter.template.isVisible = "false";
            scatter.template.userId = wx.getStorageSync('uid');
            ret["scatterPlot"] = convertToBackTemplate(scatter.template, "scatter");
            ret["scatterPlot"]["name"] = Date.now();
            url = "https://www.jaripon.xyz/chart/scatterplot/save";
        }
        console.log(ret);
        wx.request({
            url: url,
            data: ret,
            method: "POST",
            success: function (res) {
                console.log(res);
            },
            fail: function (res) {
                console.log("fail");
            }
        });
        wx.showToast({
            title: '保存成功',
        })
    },
    //打开图表
    openChart(chart) {
        xName = chart["data"]["xlabel"];
        yName = chart["data"]["ylabel"];
        graphName = chart["data"]["name"];
        if (this.data.value1 == "line") {
            line.template = convertFromBackTemplate(chart["data"]["lineChart"], "line");
        }
        if (this.data.value1 == "bar") {
            bar.template = convertFromBackTemplate(chart["data"]["barChart"], "bar");
        }
        if (this.data.value1 == "pie") {
            pie.template = convertFromBackTemplate(chart["data"]["pieChart"], "pie");
        }
        if (this.data.value1 == "scatter") {
            scatter.template = convertFromBackTemplate(chart["data"]["scatterChart"], "scatter");
        }
        var newGroupName = [];
        var newDatas = [];
        var dataArray = chart["data"]["data"]["dataArray"];
        console.log(dataArray);
        var i;
        for (i = 1; i < dataArray.length; i++) {
            newGroupName.push(dataArray[i]["name"]);
            newDatas.push(dataArray[i]["lineData"]);
        }
        inputData = this.convertPaintData();
        this.setData({
            xValues: dataArray[0]["lineData"],
            datas: newDatas,
            groupName: newGroupName,
            graphName: chart["data"]["name"]
        });
        this.repaint();
    },
    async calculateSum() {
        let tmp = [];
        for (var i = 0; i < this.data.xValues.length; i++) {
            let tmp2 = [];
            for (var j = 0; j < this.data.groupNum; j++) {
                tmp2.push(this.data.datas[j][i]);
            }
            tmp.push(tmp2);
        }
        let ret = await new Promise((resolve, reject) => {
            wx.request({
                url: baseUrl + "/expression/sum",
                data: tmp,
                method: "POST",
                success: (res) => {
                    console.log(res.data);
                    resolve(res.data);
                },
                fail: function (res) {
                    wx.showToast({
                        icon: 'error',
                        title: '求和失败'
                    })
                }
            });
        });
        for (var i = 0; i < ret.length; i++) {
            ret[i] = ret[i] + "";
        }
        var newGroup = this.data.groupName;
        var newData = this.data.datas;
        var nit2 = this.data.iterator2;
        nit2.push(nit2.length + 1);
        newGroup.push("和");
        newData.push(ret);
        this.setData({
            groupNum: this.data.groupNum + 1,
            iterator2: nit2,
            datas: newData,
            groupName: newGroup
        });
    },
    async calculateAverage() {
        let tmp = [];
        for (var i = 0; i < this.data.xValues.length; i++) {
            let tmp2 = [];
            for (var j = 0; j < this.data.groupNum; j++) {
                tmp2.push(this.data.datas[j][i]);
            }
            tmp.push(tmp2);
        }
        let ret = await new Promise((resolve, reject) => {
            wx.request({
                url: baseUrl + "/expression/average",
                data: tmp,
                method: "POST",
                success: (res) => {
                    console.log(res.data);
                    resolve(res.data);
                },
                fail: function (res) {
                    wx.showToast({
                        icon: 'error',
                        title: '计算均值失败'
                    })
                }
            });
        });
        this.setData({
            average: ret
        })
        for (var i = 0; i < ret.length; i++) {
            ret[i] = ret[i] + "";
        }
        var newGroup = this.data.groupName;
        var newData = this.data.datas;
        var nit2 = this.data.iterator2;
        nit2.push(nit2.length + 1);
        newGroup.push("均值");
        newData.push(ret);
        this.setData({
            groupNum: this.data.groupNum + 1,
            iterator2: nit2,
            datas: newData,
            groupName: newGroup
        });
    },
    async calculateVariance() {
        let tmp = [];
        for (var i = 0; i < this.data.xValues.length; i++) {
            let tmp2 = [];
            for (var j = 0; j < this.data.groupNum; j++) {
                tmp2.push(this.data.datas[j][i]);
            }
            tmp.push(tmp2);
        }
        let ret = await new Promise((resolve, reject) => {
            wx.request({
                url: baseUrl + "/expression/variance",
                data: tmp,
                method: "POST",
                success: (res) => {
                    console.log(res.data);
                    resolve(res.data);
                },
                fail: function (res) {
                    wx.showToast({
                        icon: 'error',
                        title: '计算方差失败'
                    })
                }
            });
        });
        console.log(ret);
        for (var i = 0; i < ret.length; i++) {
            ret[i] = ret[i] + "";
        }
        console.log(ret);
        var newGroup = this.data.groupName;
        var newData = this.data.datas;
        var nit2 = this.data.iterator2;
        nit2.push(nit2.length + 1);
        newGroup.push("方差");
        newData.push(ret);
        this.setData({
            groupNum: this.data.groupNum + 1,
            iterator2: nit2,
            datas: newData,
            groupName: newGroup
        });
        console.log(this.data.datas);
    },
    async calculateUncertainty() {
        let tmp = [];
        for (var i = 0; i < this.data.xValues.length; i++) {
            let tmp2 = [];
            for (var j = 0; j < this.data.groupNum; j++) {
                tmp2.push(this.data.datas[j][i]);
            }
            tmp.push(tmp2);
        }
        let ret = await new Promise((resolve, reject) => {
            wx.request({
                url: baseUrl + "/expression/uncertainty",
                data: tmp,
                method: "POST",
                success: (res) => {
                    console.log(res.data);
                    resolve(res.data);
                },
                fail: function (res) {
                    wx.showToast({
                        icon: 'error',
                        title: '计算不确定度失败'
                    })
                }
            });
        });
        console.log(ret);
        var newGroup = this.data.groupName;
        var newData = this.data.datas;
        var nit2 = this.data.iterator2;
        nit2.push(nit2.length + 1);
        newGroup.push("不确定度");
        newData.push(ret);
        this.setData({
            iterator2: nit2,
            datas: newData,
            groupName: newGroup
        });
    },
    // 保存模板
    saveTemplate: function () {
        var index = typeToIndex.get(this.data.value1);
        saveTemplate(indexToGraph[index].template, this.data.value1, this.data.inputTemplateName);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onResize: function () {
        this.setData({
            screenDirection: this.data.screenDirection == 0 ? 1 : 0
        });
        resetCharts(this.data.value1);
    },
    onShow() {},
    onReady: function () {
        // setInterval(() => {
        //     var page = getPage();
        //     var draftName = null;
        //     if (page.route == "pages/draw/draw") {
        //         var ret = {};
        //         ret["id"] = null;
        //         console.log(graphName);
        //         ret["xlabel"] = xName;
        //         ret["ylabel"] = yName;
        //         ret["xid"] = 0;
        //         ret["yid"] = [0, 0];
        //         ret["xbegin"] = (this.data.defaultRegion) ? 0 :
        //             (this.data.x1 > this.data.x2) ? this.data.x2 : this.data.x1;
        //         ret["ybegin"] = (this.data.defaultRegion) ? 0 :
        //             (this.data.y1 > this.data.y2) ? this.data.y2 : this.data.y1;
        //         ret["length"] = 3;
        //         ret["width"] = 4;
        //         var data = {};
        //         data["id"] = null;
        //         data["name"] = graphName;
        //         data['userId'] = wx.getStorageSync('uid');
        //         var i;
        //         var dataArray = [];
        //         dataArray.push({
        //             "name": "xLabel",
        //             "cid": null,
        //             "lineData": this.data.xValues
        //         });
        //         for (i = 0; i < this.data.groupNum; i++) {
        //             var obj = {
        //                 "name": this.data.groupName[i],
        //                 "cid": null,
        //                 "lineData": this.data.datas[i]
        //             }
        //             dataArray.push(obj);
        //         }
        //         data["dataArray"] = dataArray;
        //         ret["data"] = data;
        //         if (draftId == null) {
        //             ret["name"] = "草稿" + Date.now();
        //             draftId = ret["name"];
        //             var url;
        //             if (this.data.value1 == "bar") {
        //                 bar.template.isVisible = "false";
        //                 bar.template.userId = wx.getStorageSync('uid');
        //                 ret["barChart"] = convertToBackTemplate(bar.template, "bar");
        //                 ret["barChart"]["name"] = Date.now();
        //                 draftName = ret["barChart"]["name"];
        //                 url = "https://www.jaripon.xyz/chart/barchart/save";
        //             }
        //             if (this.data.value1 == "line") {
        //                 line.template.isVisible = "false";
        //                 line.template.userId = wx.getStorageSync('uid');
        //                 ret["lineChart"] = convertToBackTemplate(line.template, "line");
        //                 ret["lineChart"]["name"] = Date.now();
        //                 draftName = ret["lineChart"]["name"];
        //                 url = "https://www.jaripon.xyz/chart/linechart/save"
        //             }
        //             if (this.data.value1 == "pie") {
        //                 pie.template.isVisible = "false";
        //                 pie.template.userId = wx.getStorageSync('uid');
        //                 ret["fanChart"] = convertToBackTemplate(pie.template, "pie");
        //                 ret["fanChart"]["name"] = Date.now();
        //                 draftName = ret["fanChart"]["name"];
        //                 url = "https://www.jaripon.xyz/chart/fanchart/save"
        //             }
        //             if (this.data.value1 == "scatter") {
        //                 scatter.template.isVisible = "false";
        //                 scatter.template.userId = wx.getStorageSync('uid');
        //                 ret["scatterPlot"] = convertToBackTemplate(scatter.template, "scatter");
        //                 ret["scatterPlot"]["name"] = Date.now();
        //                 draftName = ret["scatterPlot"]["name"];
        //                 url = "https://www.jaripon.xyz/chart/scatterplot/save";
        //             }
        //             console.log(ret);
        //             wx.request({
        //                 url: url,
        //                 data: ret,
        //                 method: "POST",
        //                 success: function (res) {
        //                     console.log(res.data);
        //                 },
        //                 fail: function (res) {
        //                     console.log("fail");
        //                 }
        //             });
        //         } else {
        //             ret["name"] = draftId;
        //             var url;
        //             if (this.data.value1 == "bar") {
        //                 bar.template.isVisible = "false";
        //                 bar.template.userId = wx.getStorageSync('uid');
        //                 ret["barChart"] = convertToBackTemplate(bar.template, "bar");
        //                 ret["barChart"]["name"] = draftName;
        //                 url = "https://www.jaripon.xyz/chart/barchart/replace";
        //             }
        //             if (this.data.value1 == "line") {
        //                 line.template.isVisible = "false";
        //                 line.template.userId = wx.getStorageSync('uid');
        //                 ret["lineChart"] = convertToBackTemplate(line.template, "line");
        //                 ret["lineChart"]["name"] = draftName;
        //                 url = "https://www.jaripon.xyz/chart/linechart/replace"
        //             }
        //             if (this.data.value1 == "pie") {
        //                 pie.template.isVisible = "false";
        //                 pie.template.userId = wx.getStorageSync('uid');
        //                 ret["fanChart"] = convertToBackTemplate(pie.template, "pie");
        //                 ret["fanChart"]["name"] = draftName;
        //                 url = "https://www.jaripon.xyz/chart/fanchart/replace"
        //             }
        //             if (this.data.value1 == "scatter") {
        //                 scatter.template.isVisible = "false";
        //                 scatter.template.userId = wx.getStorageSync('uid');
        //                 ret["scatterPlot"] = convertToBackTemplate(scatter.template, "scatter");
        //                 ret["scatterPlot"]["name"] = draftName;
        //                 url = "https://www.jaripon.xyz/chart/scatterplot/replace";
        //             }
        //             ret["id"] = draftId;
        //             wx.request({
        //                 url: url,
        //                 data: ret,
        //                 method: "POST",
        //                 success: function (res) {
        //                     console.log(res);
        //                 },
        //                 fail: function (res) {
        //                     console.log("fail");
        //                 }
        //             });
        //         }
        //     }
        // }, 120000);
    },
    onUnload: function () {
        inputData = [];
        xType = undefined;
        yType = undefined;
        pie.pieData = null;
        templates = {
            "lineTemplates": [],
            "barTemplates": [],
            "pieTemplates": [],
            "scatterTemplates": [],
        };
    },
});

function resetCharts(value) {
    var thisPage = getPage();
    switch (value) {
        case "line":
            thisPage.selectComponent('#lineChartId').init((canvas, width, height, dpr) => {
                return initLineChart(canvas, width, height, dpr);
            });
            break;
        case "bar":
            thisPage.selectComponent('#barChartId').init((canvas, width, height, dpr) => {
                return initBarChart(canvas, width, height, dpr);
            });
            break;
        case "pie":
            thisPage.selectComponent('#pieChartId').init((canvas, width, height, dpr) => {

                return initPieChart(canvas, width, height, dpr);

            });
            break;
        case "scatter":
            thisPage.selectComponent('#scatterChartId').init((canvas, width, height, dpr) => {

                return initScatterChart(canvas, width, height, dpr);

            });
            break;
    }
}

/**
 * 此方法用来在重画图表（repaint）时设置图的可见性
 */
function updateShow() {
    getPage().setData({
        showLineChart: isShowLineChart(),
        showBarChart: isShowBarChart(),
        showPieChart: isShowPieChart(),
        showScatterChart: isShowScatterChart()
    });
}


function isSetStack() {
    var stack = line.template.stack.split(" ");
    var set = new Set();
    stack.forEach(element => {
        set.add(element);
    });
    if (set.size != stack.length) {
        var pages = getCurrentPages();
        var nowPage = pages[pages.length - 1].route === "pages/draw/draw" ? pages[pages.length - 1] : pages[pages.length - 2]
        nowPage.setData({
            errorLineChart: '抱歉，目前堆叠图的横坐标不支持数值类型'
        });
        return true;
    }
    return false;
}

function isShowLineChart() {
    if (xType === "error" || yType === "error") {
        getPage().setData({
            errorLineChart: '请检查您的数据是否有空值'
        });
        return false;
    }
    if (line.template != undefined && xType === "number" && isSetStack()) {
        return false;
    }
    return Object.keys(inputData).length != 0;
}

/**
 * 
 * @returns 是否显示条形图
 */
function isShowBarChart() {
    if (xType === "error" || yType === "error") {
        getPage().setData({
            errorBarChart: '请检查您的数据是否有空值'
        });
        return false;
    }
    if (xType === "number" && yType === "number") {
        getPage().setData({
            errorBarChart: '抱歉，目前柱状图不支持横坐标为连续数值'
        });
        return false;
    }
    return (xType === "string" && yType === "number") || (xType === "number" && yType === "string") && Object.keys(inputData).length != 0;
}

/**
 * 
 * @returns 是否显示饼状图
 */
function isShowPieChart() {
    if (xType === "error" || yType === "error") {
        getPage().setData({
            errorLineChart: '请检查您的数据是否有空值'
        });
        return false;
    }
    return (xType === "string" && yType === "number") || (xType === "string" && yType === "number");
}

/**
 * 
 * @returns 是否显示散点图
 */
function isShowScatterChart() {
    if (xType === "error" || yType === "error") {
        getPage().setData({
            errorLineChart: '请检查您的数据是否有空值'
        });
        return false;
    }
    return (xType === "number" && yType === "number") && Object.keys(inputData).length != 0;
}

/**
 * 
 * @returns 当前页面对象
 */
function getPage() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}

/**
 * 折线图
 * 此方法传入更新数据，用来更新折线图的数据并重新画图
 * @param {*} inputData 
 */
function updateLineData(inputData) {
    if (isShowLineChart()) {
        line.init(xType, yType);
        setLineOption(line.chart, line.template);
    }
}

/**
 * 条形图
 * 此方法传入更新数据，用来更新条形图的数据并重新画图
 * @param {*} inputData 
 */
function updateBarData(inputData) {
    if (isShowBarChart()) {
        bar.init(inputData, xType, yType);
        setBarOption(bar.chart, bar.template);
    }
}

/**
 * 扇形图
 * 此方法传入更新数据的name和data，用来更新扇形图的数据并重新画图
 * @param {*} inputData 
 */
function updatePieData(name, data) {
    console.log(name, data);
    if (isShowPieChart()) {
        if (pie.setInpuData(name, data)) {
            console.log(pie.pieData);
            getPage().setData({
                showPieChart: true
            });
            setPieOption(pie.chart, pie.template);
        } else {
            getPage().setData({
                showPieChart: false
            });
        }
    }

}
/**
 * 散点图
 * 此方法传入更新数据，用来更新散点图的数据并重新画图
 * @param {*} inputData 
 */
function updateScatterData(inputData) {
    if (isShowScatterChart()) {
        scatter.init(inputData, xType, yType);
        setScatterOption(scatter.chart, scatter.template);
    }
}

/**
 * 更新模板数据并重新画图
 * @param {int} updateGraphIndex 需要更新模板的类型，可以为 0,1,2,3...等，具体对应请参考全局变量indexToGraph
 * @param {json} template 需要更新的模板数据格式
 */
function updateTemplate(updateGraphIndex, template) {
    indexToGraph[updateGraphIndex].setTemplate(template);
    var pages = getCurrentPages();
    var pageNow = pages[pages.length - 2];
    if (updateGraphIndex == 0) {
        if (!isShowLineChart()) {
            pageNow.setData({
                showLineChart: false
            });
        } else {
            getPage().setData({
                showLineChart: true
            })
            setLineOption(indexToGraph[updateGraphIndex].chart, template);
        }
    } else if (updateGraphIndex == 1) {
        if (!isShowBarChart()) {
            getPage().setData({
                showBarChart: false
            })
        } else {
            getPage().setData({
                showBarChart: true
            })
            setBarOption(indexToGraph[updateGraphIndex].chart, template);
        }
    } else if (updateGraphIndex == 2) {
        setPieOption(indexToGraph[updateGraphIndex].chart, template);
    } else if (updateGraphIndex == 3 && isShowScatterChart()) {
        setScatterOption(indexToGraph[updateGraphIndex].chart, template);
    }

}
/**
 * 保存模板到后端数据库中
 * @param {json} template 被保存的模板
 * @param {string} type 被保存模板的类型，可以为 "line", "bar", "pie", "scatter"
 * @param {string} name 被保存模板的类型
 */

function saveTemplate(template, type, name) {
    var newTemplate = JSON.parse(JSON.stringify(template));
    newTemplate.isVisible = "true";
    newTemplate.userId = wx.getStorageSync('uid');
    newTemplate.name = name;
    var ppp = getPage();
    wx.request({
        url: "https://www.jaripon.xyz/template/" + (type === "pie" ? "fanchart" : type === "scatter" ? type + "plot" : type + "chart") + "/save",
        data: convertToBackTemplate(newTemplate, type),
        method: "POST",
        dataType: "json",
        success: function (res) {
            newTemplate.id = res.data;
            templates[type + "Templates"].push(newTemplate);
            tempIdToTemplate.set(res.data, newTemplate);
            var newOption2 = [];
            for (var template of templates[ppp.data.value1 + 'Templates']) {
                newOption2.push({
                    text: template.name,
                    value: template.id
                });
            }
            ppp.setData({
                option2: newOption2,
            });
            ppp.setData({
                value2: res.data
            });
            //console.log(tempIdToTemplate.get(i.fid));
            /**替换原来的 */
            var urls = ['/template/linechart/open/', '/template/barchart/open/', '/template/fanchart/open/', '/template/scatterplot/open/']
            var url = baseUrl + urls[typeToIndex.get(type)] + template.id;
            var types = ["lineTemplates", "barTemplates", "pieTemplates", "scatterTemplates"];
            wx.request({
                url: url,
                method: 'POST',
                success: res => {
                    var tempData = convertFromBackTemplate(res.data, types[typeToIndex.get(type)].split("Templates")[0]);
                    for (var sb of templates[types[typeToIndex.get(type)]]) {
                        if (sb.id === template.id) {
                            sb = tempData;
                        }
                    }
                    tempIdToTemplate.delete(template.id);
                    tempIdToTemplate.set(template.id, tempData);
                }
            });

            wx.showToast({
                title: '保存成功',
            });
        }
    });

}

/**
 * 此方法传入一个符合前端格式模板json对象和模板种类（line，bar，pie，scatter）
 * 返回一个符合后端模板格式要求的新的json对象
 * @param {*} template 
 * @param {*} type 
 * @returns tempJson
 */
function convertToBackTemplate(template, type) {
    var tempJson = {}
    switch (type) {
        case "line":
            for (var key in template) {
                if (typeof template[key] == "boolean") {
                    tempJson[key] = template[key] ? "true" : "false";
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
        case "bar":
            for (var key in template) {
                if (key === "gap" || key === "width") {
                    tempJson[key] = parseFloat(template[key]) / 100 + "";
                } else if (typeof template[key] == "boolean") {
                    tempJson[key] = template[key] ? "true" : "false";
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
        case "pie":
            for (var key in template) {
                if (typeof template[key] == "boolean") {
                    tempJson[key] = template[key] ? "true" : "false";
                } else if (typeof template[key] == "boolean") {
                    tempJson[key] = template[key] ? "true" : "false";
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
        case "scatter":
            for (var key in template) {
                if (typeof template[key] == "boolean") {
                    tempJson[key] = template[key] ? "true" : "false";
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
    }
    return tempJson;
}

/**
 * 此方法传入一个后端模板对象和模板种类（line,bar,pie,scatter）
 * 返回一个符合前端模板格式要求的新的json对象
 * @param {*} template 
 * @param {*} type 
 * @returns 
 */
function convertFromBackTemplate(template, type) {
    var tempJson = {};
    switch (type) {
        case "line":
            for (var key in template) {
                if (key === "showDigit" || key === "isVisible" || key === "showGradient" ||
                    key === "showXGradient" || key === "showYGradient" || key === "showSymbol" ||
                    key === "smooth") {
                    tempJson[key] = JSON.parse(template[key]);
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
        case "bar":
            for (var key in template) {
                if (key === "showDigit" || key === "transpose" || key === "isVisible") {
                    tempJson[key] = JSON.parse(template[key]);
                } else if (key === "gap" || key === "width") {
                    tempJson[key] = parseFloat(template[key]) * 100 + "%";
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
        case "pie":
            for (var key in template) {
                if (key === "showLabel" || key === "showPercent" || key === "isVisible" ||
                    key === "showRing" || key === "showRose") {
                    tempJson[key] = JSON.parse(template[key]);
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
        case "scatter":
            for (var key in template) {
                if (key === "showLine" || key === "showDigit" || key === "isVisible" ||
                    key === "increase" || key === "useRegression") {
                    tempJson[key] = JSON.parse(template[key]);
                } else if (key === "radius") {
                    tempJson[key] = parseFloat(template[key]) * 100 + "%";
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
    }
    return tempJson;
}

/**
 * 此方法自定义一个echarts toolbox.feature中的一个保存图到本地的属性
 * @returns 
 */
function saveImage() {
    wx.showModal({
        cancelColor: '#9ba8ae',
        title: '提示',
        content: '你确定要将此图保存到相册中吗？',
        success: res => {
            var page = getPage();
            if (res.confirm) {
                const ecCompoent = page.selectComponent('#' + page.data.value1 + "ChartId");
                //const ecCompoent = this.selectComponent('#pie' + "ChartId");
                ecCompoent.canvasToTempFilePath({
                    success: res => {
                        console.log("tempFilePath:", res.tempFilePath);
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath || '',
                            success: res => {
                                wx.showToast({
                                    title: '保存成功'

                                })
                            }
                        })
                    }
                });
            } else {
                wx.showToast({
                    title: '您取消了保存',
                    icon: "error"
                });
            }
        }
    });
}

function myFullScreen() {
    return {
        show: true,
        title: '全屏',
        icon: 'path://M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z',
        onclick: function () {
            var page = getPage();
            page.setData({
                isHideTabel: page.data.isHideTabel === "none" ? "block" : "none"
            });
            resetCharts(page.data.value1);
        }
    }
}


/**
 * 此方法传入需要被设置图例的option，
 * 并根据传入的图例字符串来进行设置
 * @param {*} option 
 * @param {*} legendPos 
 */
function setLegendOption(option, legendPos) {
    var legendArr = legendPos.split(",");
    var tempJson = {};
    if (legendArr[0] != "") {
        tempJson.top = legendArr[0];
    }
    if (legendArr[1] != "") {
        tempJson.bottom = legendArr[1];
    }
    if (legendArr[2] != "") {
        tempJson.left = legendArr[2];
    }
    if (legendArr[3] != "") {
        tempJson.right = legendArr[3];
    }
    if (legendArr[4] != "") {
        tempJson.orient = legendArr[4];
    } else {
        tempJson.orient = 'horizontal';
    }
    option.legend = tempJson;
}

function setToolBox(option) {
    option.toolbox = {
        feature: {
            myFullScreen: myFullScreen()
        },
        right: '5%'
    };
}

/**
 * 此方法传入一个需要被设置min和max属性的option
 * 为传入的option设置min和max值
 * @param {*} option 
 * @returns 
 */

// function setMinAndMax(chart, option) {
//     if (xType === "number") {
//         option.xAxis.min = chart.getModel().getComponent('xAxis', 0).axis.scale._extent[0];
//         option.xAxis.max = chart.getModel().getComponent('xAxis', 0).axis.scale._extent[1];
//         console.log(chart.getModel().getComponent('xAxis', 0));
//     }
//     if (yType === "number") {
//         option.yAxis.min = chart.getModel().getComponent('yAxis', 0).axis.scale._extent[0];
//         option.yAxis.max = chart.getModel().getComponent('yAxis', 0).axis.scale._extent[1];

//     }
//     chart.setOption(option);
// }

module.exports.inputData = inputData;
module.exports.bar = bar;
module.exports.line = line;
module.exports.pie = pie;
module.exports.scatter = scatter;
module.exports.getPage = getPage;
module.exports.convertFromBackTemplate = convertFromBackTemplate;
module.exports.setLegendOption = setLegendOption;