// pages/draw/draw.js

import * as echarts from '../../ec-canvas/echarts';
var inputData = [
    ['product', 'sb', 'lsp'],
    ['sb1', 41.1, 86.5],
    ['sb2', 30.4, 92.1],
    ['sb3', 22, 182],
    ['sb4', 75, 25],
    ['sb5', 78, 25],
    ['sb6', 33, 66],
]; // 输入数据
var graph = require('./class');
var xType = "string"; // 输入数据x轴类型
var yType = "number"; // 输入数据y轴类型

var line = new graph.LineGraph("line");
var bar = new graph.BarGraph("bar");
var pie = new graph.PieGraph("pie");
var scatter = new graph.ScatterGraph("scatter");

var graphName = "默认标题"; // 在图的最上方显示的标题
var graphId = null; //图的id 是否应该存在内存中？
var xName = "x";
var yName = "y";
var indexToGraph = [line, bar, pie, scatter];
var typeToIndex = new Map([
    ["line", 0],
    ["bar", 1],
    ["pie", 2],
    ["scatter", 3]
]);


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
    for (var i = 1; i < inputData[0].length; i++) {
        var name = inputData[0][i];
        var tempJson = {
            name: name,
            type: "line",
            symbolSize: template.radius,
            lineStyle: {
                color: template.color[i - 1],
            }
        };
        series.push(tempJson);
    }

    option = {
        dataset: {
            source: inputData,
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
                height: 15
            },
            {
                type: "slider",
                yAxisIndex: 0,
                filterMode: 'none',
                width: 15
            }
        ],
        grid: {
            right: '18%',
            top: '16%',
        },
        toolbox: {
            feature: {
                mySaveAsImage: mySaveImage(),
            },
            right: '20%'
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
            type: line.xType === "string" ? 'category' : 'value',
            boundaryGap: !(line.xType === "string"),
            axisLine: {
                onZero: false,
            }
        },
        yAxis: {
            name: yName,
            type: line.yType === "string" ? 'category' : 'value',
            boundaryGap: !(line.yType === "string"),
            axisLine: {
                onZero: false
            },
        },
        series: series
    };
    setLegendOption(option, template.legendPos);
    lineChart.setOption(option); // 
    if (template.showDigit) {
        lineChart.setOption({
            tooltip: {
                // triggerOn: 'none',
                // formatter: function (params) {
                //     var xstr = line.xType === "string" ? params.data[0] : parseFloat(params.data[0]).toFixed(2);
                //     var ystr = line.yType === "string" ? params.data[1] : parseFloat(params.data[1]).toFixed(2);
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
    var series = [];
    var option;
    for (var i = 1; i < inputData[0].length; i++) {
        var name = inputData[0][i];
        var tempJson = {
            name: name,
            type: "bar",
            barWidth: template.width,
            barGap: template.gap,
            color: template.color[i - 1]
        };
        series.push(tempJson);
    }
    option = {
        dataset: {
            source: inputData
        },
        grid: {
            right: '18%',
            top: '16%',
        },
        dataZoom: [{
                type: "inside",
                xAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: "slider",
                xAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: "slider",
                yAxisIndex: 0,
                filterMode: 'none',
                width: 15
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
        toolbox: {
            feature: {
                mySaveAsImage: mySaveImage(),
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
        data: pie.convertToPieData(pie.pieData)
    };
    series.push(tempJson);
    option = {
        grid: {
            right: '18%',
            top: '16%',
        },
        title: {
            text: graphName,
            left: 'center',
            textStyle: {
                color: template.textColor,
                fontSize: template.titleFont
            }
        },
        toolbox: {
            feature: {
                mySaveAsImage: mySaveImage(),
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
        legend: {
            top: legendArr[0],
            bottom: legendArr[1],
            left: legendArr[2],
            right: legendArr[3],
            orient: legendArr[4],
            left: template.legendPos,
        },
        label: {
            show: template.showLabel,
            fontSize: template.labelFont
        },
        series: series
    };
    setLegendOption(option, template.legendPos);
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
    var legendArr = template.legendPos.split(",");
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
            }
        };
        series.push(tempJson);
    }
    var option = {
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
                height: 15
            },
            {
                type: "slider",
                yAxisIndex: 0,
                filterMode: 'none',
                width: 15
            }
        ],
        grid: {
            right: '18%',
            top: '16%',
        },
        title: {
            text: graphName,
            left: 'center',
            textStyle: {
                color: template.textColor,
                fontSize: template.font
            }
        },
        toolbox: {
            feature: {
                mySaveAsImage: mySaveImage(),
            }
        },
        itemStyle: {
            color: template.color[0]
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
        legend: {
            top: legendArr[0],
            bottom: legendArr[1],
            left: legendArr[2],
            right: legendArr[3],
            orient: legendArr[4],
            left: template.legendPos,
        },
        series: series,
    };
    setLegendOption(option, template.legendPos);
    scatterChart.setOption(option);
    scatterChart.setOption({
        tooltip: {
            triggerOn: 'none',
            formatter: function (params) {
                var xstr = scatter.xType === "string" ? params.data[0] : parseFloat(params.data[0]).toFixed(2);
                var ystr = scatter.yType === "string" ? params.data[1] : parseFloat(params.data[1]).toFixed(2);
                return 'X: ' +
                    xstr +
                    '\nY: ' +
                    ystr;
            }
        },
    });
    return scatterChart;
}

Page({
    data: {
        /**0 表示 为竖屏，1表示为横屏*/
        screenDirection: 0,
        actionSheetHidden: true,
        actionSheetItems: [{
                bindtap: 'Menu1',
                txt: '添加横坐标'
            },
            {
                bindtap: 'Menu2',
                txt: '添加数据组'
            },
            {
                bindtap: 'Menu3',
                txt: '删除横坐标'
            },
            {
                bindtap: 'Menu4',
                txt: '删除数据组'
            }
        ],
        graphName: "默认标题", // 在图的最上方显示的标题
        xName: "x",
        yName: "y",
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
        errorChart: "您当前无法绘制此图，请检查您的数据是否为空或数据的格式是否正确。",
        /**是否战术输入模板名字 */
        showInputTemplateName: false,
        inputTemplateName: "",
        /**是否展示底部保存的上拉列表 */
        showSaveSheet: false,
        saveSheetOptions: [{
            name: "保存模板",
            value: 0
        }, {
            name: "保存图表",
            value: 1
        }, {
            name: "导出到.csv文件",
            value: 2
        }],
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
        ],
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
        pieChartNo: 0
    },
    actionSheetTap() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    actionSheetbindchange() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    bindMenu1() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
        this.addX();
    },
    bindMenu2() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
        this.addDataGroup();
    },
    bindMenu3() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
        this.delX();
    },
    bindMenu4() {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
        this.delGroup();
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
    onCloseSaveSheet() {
        this.setData({
            showSaveSheet: false
        });
    },
    onSelectSaveOption(event) {
        console.log(event.detail)
        var funs = [this.isSaveTemplate, this.saveChart, this.exportToCSV];
        funs[event.detail.value]();
    },
    beginShowSaveSheet() {
        this.setData({
            showSaveSheet: true
        })
    },
    onLoad() {
        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel) {
            eventChannel.on("openData", res => {
                this.openData(res.data)
            });
            eventChannel.on("openChart", res => {
                this.openChart(res.data)
            })
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
        console.log(this.data.currentCell);
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
        console.log(event.target);
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
        if (this.data.groupNum == 5) {
            wx.showToast({
                title: '最多5个数据组',
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
        console.log(this.data.groupName);
        this.changeCurrentGroupName(event);
    },
    addX: function () {
        if (this.data.xValues.length == 10) {
            wx.showToast({
                title: '最多10个横坐标',
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
            iterator2: newIterator2,
            groupNum: this.data.groupNum - 1
        })
        console.log(this.data.xValues);
    },
    delX: function () {
        var newIterator1 = this.data.iterator1;
        var newXValues = this.data.xValues;
        var newDatas = this.data.datas;
        newIterator1.pop();
        newXValues.splice(this.data.region[1], 1);
        var i;
        for (i = 0; i < newDatas.length; i++) {
            newDatas[i].splice(this.data.region[1], 1);
        }
        this.setData({
            iterator1: newIterator1,
            xValues: newXValues,
            datas: newDatas
        })

    },
    giveData: function (givenData) {
        this.setData({
            datas: givenData
        })

    },
    judgeXType: function () {
        var i;
        var regex = /^[0-9]+.?[0-9]*/;
        for (i = 0; i < this.data.xValues.length; i++) {
            if (!regex.test(this.data.xValues[i])) {
                return "string";
            }
        }
        return "number";
    },
    judgeYType: function () {
        var i, j;
        var regex = /^[0-9]+.?[0-9]*/;
        for (i = 0; i < this.data.groupNum; i++) {
            for (j = 0; j < this.data.xValues.length; j++) {
                if (!regex.test(this.data.datas[i][j])) {
                    return "string";
                }
            }
        }
        return "number";
    },
    convertPaintData: function () { //转化所需数据
        var ret = {};
        var i;
        var j;
        if (this.data.defaultRegion) {
            this.data.x1 = 1;
            this.data.x2 = this.data.groupNum;
            this.data.y1 = 1;
            this.data.y2 = this.data.xValues.length;
        }
        for (i = this.data.x1 - 1; i < this.data.x2; i++) {
            var tmp = [];
            for (j = this.data.y1 - 1; j < this.data.y2; j++) {
                tmp.push([this.data.xValues[j], this.data.datas[i][j]]);
            }
            ret[this.data.groupName[i]] = tmp;
        }
        console.log(ret);
        return ret;
    },
    convertData: function () {
        var ret = {};
        var i;
        var j;
        for (i = 0; i < this.data.groupNum; i++) {
            var tmp = [];
            for (j = 0; j < this.data.xValues.length; j++) {
                tmp.push([this.data.xValues[j], this.data.datas[i][j]]);
            }
            ret[this.data.groupName[i]] = tmp;
        }
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
        yType = this.judgeYType();
        updateShow();
        switch (this.data.value1) {
            case "line":
                updateLineData(inputData);
                break;
            case "bar":
                updateBarData(inputData);
                break;
            case "pie":
                updatePieData(this.data.groupName[this.data.pieChartNo], inputData[this.data.groupName[this.data.pieChartNo]]);
                break;
            case "scatter":
                updateScatterData(inputData);
                break;
        }
    },
    async saveData() {
        var ret = {};
        ret["id"] = null;
        ret["name"] = "";
        ret["userId"] = wx.getStorageSync('uid');
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
        ret["dataArray"] = dataArray;
        var url = "https://www.jaripon.xyz/data/save";
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
        });
        // var x = await this.trans(url, ret);
    },
    goAttribute() {
        var index;
        var template;
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
        template = indexToGraph[index].template;
        wx.navigateTo({
            url: '../attribute/attribute',
            events: {
                back: (backData) => {
                    updateTemplate(index, backData.template);
                }
            },
            success(result) {
                result.eventChannel.emit("changeTemplate", {
                    index: index,
                    template: template
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
            ret["barChart"] = converToBackTemplate(bar.template, "bar");
            url = "https://www.jaripon.xyz/chart/barchart/save";
        }
        if (this.data.value1 == "line") {
            line.template.isVisible = "false";
            line.template.userId = wx.getStorageSync('uid');
            ret["lineChart"] = converToBackTemplate(line.template, "line");
            url = "https://www.jaripon.xyz/chart/linechart/save"
        }
        if (this.data.value1 == "pie") {
            pie.template.isVisible = "false";
            pie.template.userId = wx.getStorageSync('uid');
            ret["fanChart"] = converToBackTemplate(pie.template, "pie");
            url = "https://www.jaripon.xyz/chart/fanchart/save"
        }
        if (this.data.value1 == "scatter") {
            scatter.template.isVisible = "false";
            scatter.template.userId = wx.getStorageSync('uid');
            ret["scatterPlot"] = converToBackTemplate(scatter.template, "scatter");
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
        inputData = this.convertData();
        this.setData({
            xValues: dataArray[0]["lineData"],
            datas: newDatas,
            groupName: newGroupName,
            graphName: chart["data"]["name"]
        });
        this.repaint();
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

    },
    onUnload: function () {
        //inputData = [];
        xType = undefined;
        yType = undefined;
        pie.pieData = null;
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

function isShowLineChart() {
    return Object.keys(inputData).length != 0;
}

/**
 * 
 * @returns 是否显示条形图
 */
function isShowBarChart() {
    return (xType === "string" && yType === "number") || (xType === "string" && yType === "number") || Object.keys(inputData).length != 0;
}

/**
 * 
 * @returns 是否显示饼状图
 */
function isShowPieChart() {
    return (xType === "string" && yType === "number") || (xType === "string" && yType === "number");
}

/**
 * 
 * @returns 是否显示散点图
 */
function isShowScatterChart() {
    return (xType === "number" && yType === "number") || Object.keys(inputData).length != 0;
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
    line.init(xType, yType);
    if (isShowLineChart()) {
        console.log(line);
        setLineOption(line.chart, line.template);
    }
}

/**
 * 条形图
 * 此方法传入更新数据，用来更新条形图的数据并重新画图
 * @param {*} inputData 
 */
function updateBarData(inputData) {
    bar.init(inputData, xType, yType);
    if (isShowBarChart()) {
        setBarOption(bar.chart, bar.template);
    }
}

/**
 * 扇形图
 * 此方法传入更新数据的name和data，用来更新扇形图的数据并重新画图
 * @param {*} inputData 
 */
function updatePieData(name, data) {
    if (isShowPieChart()) {
        if (pie.setInpuData(name, data)) {
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
    scatter.init(inputData, xType, yType);
    if (isShowScatterChart()) {
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
    if (updateGraphIndex == 0) {
        setLineOption(indexToGraph[updateGraphIndex].chart, template);
    } else if (updateGraphIndex == 1) {
        setBarOption(indexToGraph[updateGraphIndex].chart, template);
    } else if (updateGraphIndex == 2) {
        setPieOption(indexToGraph[updateGraphIndex].chart, template);
    } else if (updateGraphIndex == 3) {
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
    template.isVisible = "true";
    template.userId = wx.getStorageSync('uid');
    template.name = name;
    wx.request({
        url: "https://www.jaripon.xyz/template/" + (type === "pie" ? "fanchart" : type === "scatter" ? type + "plot" : type + "chart") + "/save",
        data: converToBackTemplate(template, type),
        method: "POST",
        dataType: "json",
        success: function (res) {
            console.log(res);
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
function converToBackTemplate(template, type) {
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
                if (key === "radius") {
                    tempJson[key] = parseFloat(template[key]) / 100 + "";
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
                if (key === "showDigit" || key === "isVisible") {
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
                if (key === "showLabel" || key === "showPercent" || key === "isVisible") {
                    tempJson[key] = JSON.parse(template[key]);
                } else if (key === "radius") {
                    tempJson[key] = parseFloat(template[key]) * 100 + "%";
                } else {
                    tempJson[key] = template[key];
                }
            }
            break;
        case "scatter":
            for (var key in template) {
                if (key === "showLine" || key === "showDigit" || key === "isVisible" ||
                    key === "increase") {
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
function mySaveImage() {
    return {
        show: true,
        title: '保存为图片',
        icon: 'path://M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z',
        onclick: function () {
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
    };
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
    console.log(option);
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