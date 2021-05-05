// pages/draw/draw.js

import * as echarts from '../../ec-canvas/echarts';
import * as graph from './class';

const saveLineTemplateUrl = "/template/linechart/save";
const saveBarTemplateUrl = "/template/barchart/save";
const savePieTemplateUrl = "/template/fanchart/save";
const saveScatterTemplateUrl = "/template/scatterplot/save";
const exportToCSVUrl = "/data/export/csv";

const replaceLineTemplateUrl = "/template/linechart/replace";
const replaceBarTemplateUrl = "/template/barchart/replace";
const replacePieTemplateUrl = "/template/fanchart/replace";
const replaceScatterTemplateUrl = "/template/scatterplot/replace";

export var inputData = {
    "sb": [
        ['sb1', 7],
        ['sb2', 10],
        ['sb3', 20],
        ['sb4', 30],
        ['sb5', 40]
    ],

    // "sb":  [[40, -10], [-30, -5], [-76.5, 20], [-63.5, 40], [-22.1, 50]]
    // "qqhsb": [
    //     ['sb1', 7],
    //     ['sb2', 40],
    //     ['sb3', 30],
    //     ['sb4', 25],
    //     ['sb5', 11]
    // ],
}; // 输入数据

var xType = "string"; // 输入数据x轴类型
var yType = "number"; // 输入数据y轴类型

var line = new graph.LineGraph();
var bar = new graph.BarGraph();
var pie = new graph.PieGraph();
var scatter = new graph.ScatterGraph();

var graphName = "sb"; // 在图的最上方显示的标题
var graphId = null; //图的id 是否应该存在内存中？
var xName = "x";
var yName = "y";

export function getSingleData(tempData, index) {
    var result = [];
    for (var i = 0; i < tempData.length; i++) {
        result.push(tempData[i][index]);
    }
    return result;
}

scatter.setInputList(inputData);

function initLineChart(canvas, width, height, dpr) {
    //line.init(convertData(), xType, yType);
    var lineChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    line.lineChart = lineChart;
    canvas.setChart(lineChart);
    var option = setLineOption();
    lineChart.setOption(option); // 
    if (line.lineTemplate.showDigit) {
        lineChart.setOption({
            tooltip: {
                triggerOn: 'none',
                formatter: function (params) {
                    var xstr = line.xType === "string" ? params.data[0] : params.data[0].toFixed(2);
                    var ystr = line.yType === "string" ? params.data[1] : params.data[1].toFixed(2);
                    return 'X: ' +
                        xstr +
                        '\nY: ' +
                        ystr;
                }
            },
        });
    }
    lineChart.setOption({
        graphic: echarts.util.map(line.inputList, function (dataItem, dataIndex) {
            if (line.xType === 'string') {
                line.xMap.set(dataIndex, dataItem[0]);
            }
            if (line.yType === 'string') {
                line.yMap.set(dataIndex, dataItem[1]);
            }
            return {
                type: 'circle',
                position: line.lineChart.convertToPixel('grid', dataItem),
                shape: {
                    r: line.lineTemplate.radius / 2
                    // r : 20 / 2
                },
                invisible: true,
                draggable: line.draggable,
                ondrag: echarts.util.curry(onPointLineDragging, dataIndex),
                z: 100,
                onmousemove: echarts.util.curry(showLineTooltip, dataIndex),
                onmouseout: echarts.util.curry(hideLineTooltip, dataIndex),
            };
        })
    });
    console.log("init LineGraph Success!!");
    return lineChart;
}

function setLineOption() {
    var series = [];
    var count = 0;
    for (var i = 0; i < line.inputList.length;) {
        var name = line.indexToName[i];
        var tempJson = {
            name: name,
            type: "line",
            symbolSize: line.lineTemplate.radius,
            data: line.inputList.slice(line.nameToIndex[name].minIndex, line.nameToIndex[name].maxIndex),
            lineStyle: {
                color: line.lineTemplate.color[count],
            }
        };
        i = line.nameToIndex[name].maxIndex;
        series.push(tempJson);
        count++;
    }
    console.log(series);
    var legendArr = line.lineTemplate.legendPos.split(",");
    var option = {
        grid: {
            top: '16%',
            bottom: '12%',
        },
        title: {
            text: line.title,
            left: "center",
            textStyle: {
                color: line.lineTemplate.textColor,
                fontSize: line.lineTemplate.font
            }
        },
        legend: {
            top: legendArr[0],
            bottom: legendArr[1],
            left: legendArr[2],
            right: legendArr[3],
            orient: legendArr[4]
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
            boundaryGap: !(line.xType === "string"),
            axisLine: {
                onZero: false
            },
        },
        series: series
    };
    option = setMinAndMax(option);
    console.log(option);
    return option;
}

function initBarChart(canvas, width, height, dpr) {
    bar.init(inputData, xType, yType);
    var barChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    bar.barChart = barChart;
    canvas.setChart(barChart);
    var option = setBarOption();
    barChart.setOption(option);
    if (bar.barTemplate.showDigit) {
        barChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    var xstr = bar.xType === "string" ? params[0].data[0] : params[0].data[0].toFixed(2);
                    var ystr = bar.yType === "string" ? params[0].data[1] : params[0].data[1].toFixed(2);
                    return 'X: ' +
                        xstr +
                        '\nY: ' +
                        ystr;
                }
            },
        });
    }
    // barChart.setOption({ // 绘制拖拽块
    //     graphic: echarts.util.map(bar.inputList, function (dataItem, dataIndex) {
    //         var position = bar.barChart.convertToPixel('grid', dataItem);
    //         if (bar.xType === 'string') {
    //             bar.xMap.set(dataIndex, dataItem[0]);
    //         }
    //         if (bar.yType === 'string') {
    //             bar.yMap.set(dataIndex, dataItem[1]);
    //         }
    //         return {
    //             type: 'rect',
    //             position: [position[0] - bar.barTemplate.width / 2, position[1]],
    //             shape: {
    //                 width: bar.barTemplate.width,
    //                 height: 10
    //                 // r : 20 / 2
    //             },
    //             invisible: false,
    //             draggable: true,
    //             ondrag: echarts.util.curry(onPointBarDragging, dataIndex),
    //             z: 100,
    //             //onmousemove: echarts.util.curry(showTooltip, dataIndex),
    //             //onmouseout: echarts.util.curry(hideTooltip, dataIndex),
    //         };
    //     })
    // });
    console.log("init BarGraph Success!!");
    return barChart;
}

function setBarOption() {
    var series = [];
    var count = 0;
    for (var i = 0; i < line.inputList.length;) {
        var name = line.indexToName[i];
        var tempJson = {
            name: name,
            type: "bar",
            data: bar.inputList.slice(bar.nameToIndex[name].minIndex, bar.nameToIndex[name].maxIndex),
            barWidth: bar.barTemplate.width,
            barGap: bar.barTemplate.gap,
            color: bar.barTemplate.color[count]
        };
        i = line.nameToIndex[name].maxIndex;
        series.push(tempJson);
        count++;
    }
    var legendArr = bar.barTemplate.legendPos.split(",");
    var option = {
        legend: {
            top: legendArr[0],
            bottom: legendArr[1],
            left: legendArr[2],
            right: legendArr[3],
            orient: legendArr[4]
        },
        title: {
            text: bar.title,
            left: "center",
            textStyle: {
                color: bar.barTemplate.textColor,
                fontSize: bar.barTemplate.font
            }
        },
        xAxis: [{
            name: xName,
            type: 'category',
            // axisLine: {
            //     onZero: false
            // }
        }],
        yAxis: [{
            name: yName,
            type: 'value',
            // axisLine: {
            //     onZero: false
            // }
        }],
        series: series
    };
    setMinAndMax(option);
    return option;
}

function initPieChart(canvas, width, height, dpr) {
    // 由于pie图无法进行拖拽，直接从全局输入数据中取数据即可，对象中不需要保存。
    var flag = pie.setInpuData('sb', inputData['sb']); // 
    console.log(flag);
    var pieChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    pie.pieChart = pieChart;
    canvas.setChart(pieChart);
    var option;
    if (flag) {
        option = setPieOption();
    } else {
        option = {
            title: {
                text: "你tm是不是傻逼，输入我们画不出来的图，是不是傻逼！！！\n你要是再有下次直接删除账号，永远不允许登录！！！",
            },
        };
    }
    console.log(option);
    pieChart.setOption(option);
    console.log("init PieGraph Success!!");
    return pieChart;
}

function setPieOption() {
    var series = [];
    var tempJson = {
        name: pie.name,
        type: 'pie',
        radius: pie.pieTemplate.radius,
        avoidLabelOverlap: true,
        data: pie.convertToPieData(pie.pieData)
    };
    console.log(tempJson);
    series.push(tempJson);
    var legendArr = pie.pieTemplate.legendPos.split(",");
    console.log(legendArr);
    var option = {
        title: {
            text: graphName,
            subtext: '纯属虚构',
            left: 'center',
            textStyle: {
                color: pie.pieTemplate.textColor,
                fontSize: pie.pieTemplate.titleFont
            }
        },
        tooltip: {
            trigger: 'item',
            textStyle: {
                fontSize: pie.pieTemplate.labelFont
            },
            formatter: function (params) {
                var result;
                if (pie.pieTemplate.showPercent) {
                    result = params.name + ": " + params.percent + "%(" + params.value.toFixed(pie.pieTemplate.precision) + ")";
                } else {
                    result = params.name + ": " + params.value.toFixed(pie.pieTemplate.precision);
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
            left: pie.pieTemplate.legendPos,
        },
        label: {
            show: pie.pieTemplate.showLabel,
            fontSize: pie.pieTemplate.labelFont
        },
        series: series
    };
    return option;
}

function initScatterChart(canvas, width, height, dpr) {
    scatter.init(inputData, xType, yType);
    var scatterChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    scatter.scatterChart = scatterChart;
    canvas.setChart(scatterChart);
    var option = setScatterOption();
    scatterChart.setOption(option);
    if (scatter.scatterTemplate.showLine) {
        scatterChart.setOption({
            tooltip: {
                trigger: "axis",
                formatter: function (params) {
                    var xstr = scatter.xType === "string" ? params[0].data[0] : params[0].data[0].toFixed(2);
                    var ystr = scatter.yType === "string" ? params[0].data[1] : params[0].data[1].toFixed(2);
                    return 'X: ' + xstr + '\nY: ' + ystr;
                },
                axisPointer: {
                    type: "line"
                }

            },
        });
    } else {
        scatterChart.setOption({
            tooltip: {
                triggerOn: 'none',
                formatter: function (params) {
                    var xstr = scatter.xType === "string" ? params.data[0] : params.data[0].toFixed(2);
                    var ystr = scatter.yType === "string" ? params.data[1] : params.data[1].toFixed(2);
                    return 'X: ' +
                        xstr +
                        '\nY: ' +
                        ystr;
                }
            },
        });
    }
    scatterChart.setOption({
        graphic: echarts.util.map(scatter.inputList, function (dataItem, dataIndex) {
            var position = scatterChart.convertToPixel('grid', dataItem);
            if (scatter.xType === 'string') {
                scatter.xMap.set(dataIndex, dataItem[0]);
            }
            if (scatter.yType === 'string') {
                scatter.yMap.set(dataIndex, dataItem[1]);
            }
            return {
                type: 'circle',
                position: position,
                shape: {
                    r: Math.sqrt(dataItem[1]) * 7,
                },
                invisible: true,
                draggable: scatter.draggable,
                ondrag: echarts.util.curry(onPointScatterDragging, dataIndex),
                z: 100,
                onmousemove: echarts.util.curry(showScatterTooltip, dataIndex),
                onmouseout: echarts.util.curry(hideScatterTooltip, dataIndex),
            };
        })
    });
    console.log("init ScatterGraph Success!!");
    return scatterChart;

}

function setScatterOption() {
    var legendArr = scatter.scatterTemplate.legendPos.split(",");
    var option = {
        title: {
            text: graphName,
            subtext: '纯属虚构',
            left: 'center',
            textStyle: {
                color: scatter.scatterTemplate.textColor,
                fontSize: scatter.scatterTemplate.font
            }
        },
        itemStyle: {
            color: scatter.scatterTemplate.color[0]
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
            left: scatter.scatterTemplate.legendPos,
        },
        series: [{
            symbolSize: scatter.scatterTemplate.increase ? function (data, params) {
                return Math.sqrt(data[1]) * 7; // 开方 此函数不能处理负数
            } : 15,
            type: "scatter",
            data: scatter.inputList
        }]
    };
    setMinAndMax(option);
    return option;
}

Page({
    data: {
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
        showPieChart: isShowPie(),
        showScatterChart: true,
        errorChart: "你tm是不是傻逼，输入我们画不出来的图，是不是傻逼！！！\n你要是再有下次直接删除账号，永远不允许登录！！！",
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
            [1, 2],
            [1, 2]
        ],
        xValues: [
            []
        ],
        groupName: ["", ""],
        chooseRegion: false,
        firstReady: false,
        groupNum: 2,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        region: [0, 0]
    },
    changeRegion: function (event) {
        var newRegion = [event.target.dataset.a, event.target.dataset.b];
        console.log("现在是" + newRegion[0] + newRegion[1]);
        this.setData ({
            region: newRegion
        });
    },
    getXValue: function (event) {
        if (this.data.chooseRegion) {
            return;
        }
        var index = event.target.dataset.a;
        var newXValue = this.data.xValues;
        newXValue[index - 1] = event.detail;
        console.log(newXValue[index - 1]);
        this.setData({
            xValues: newXValue
        })
    },
    getData: function (event) {
        if (this.data.chooseRegion) {
            if (!this.data.firstReady) {
                this.setData({
                    x1: event.target.dataset.a,
                    y1: event.target.dataset.b,
                    firstReady: true
                })
                return;
            } else {
                this.setData({
                    x2: event.target.dataset.a,
                    y2: event.target.dataset.b,
                    firstReady: false
                })
                console.log([this.data.x1, this.data.y1, this.data.x2, this.data.y2]);
                return;
            }
        }
        console.log(event.target);
        var groupId = event.target.dataset.a;
        var dataId = event.target.dataset.b;
        var newDatas = this.data.datas;
        newDatas[groupId - 1][dataId - 1] = event.detail;
        this.setData({
            datas: newDatas,
            chooseRegion: false
        });
    },
    addDataGroup: function () {
        if (this.data.chooseRegion) {
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
            chooseRegion: false,
            groupName: newGroupName,
            groupNum: this.data.groupNum + 1
        })
        this.onLoad();
    },
    setGroupName: function (event) {
        if (this.data.chooseRegion) {
            return;
        }
        var index = event.target.dataset.a;
        var newGroupName = this.data.groupName;
        newGroupName[index - 1] = event.detail;
        console.log(newGroupName[index - 1]);
        this.setData({
            groupName: newGroupName
        })
    },
    addX: function () {
        if (this.data.chooseRegion) {
            return;
        }
        var newIterator1 = this.data.iterator1;
        var newXValues = this.data.xValues;
        newIterator1.push(newIterator1.length + 1);
        newXValues.push(newXValues.length + 1);
        this.setData({
            iterator1: newIterator1,
            xValues: newXValues,
            chooseRegion: false
        })
        this.onLoad();
    },
    delGroup: function () {
        if (this.data.chooseRegion) {
            return;
        }
        var newIterator2 = this.data.iterator2;
        var newDatas = this.data.datas;
        var newGroupName = this.data.groupName;
        newGroupName.splice(this.data.region[0], 1);
        newDatas.splice(this.data.region[0], 1);
        newIterator2.pop();
        this.setData({
            datas: newDatas,
            iterator2: newIterator2,
            chooseRegion: false,
            groupNum: this.data.groupNum - 1
        })
        this.onLoad();
    },
    delX: function () {
        if (this.data.chooseRegion) {
            return;
        }
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
            chooseRegion: false,
            datas: newDatas
        })
        this.onLoad();
    },
    choose: function () {
        var origin = this.data.chooseRegion;
        this.setData({
            chooseRegion: !origin
        });
        console.log("hhh");
        this.onLoad();
    },
    giveData: function (givenData) {
        this.setData({
            datas: givenData
        })
        this.onLoad();
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
        for (i = 0; i < this.data.xValues.length; i++) {
            for (j = 0; j < this.data.groupNum; j++) {
                if (!regex.test(this.data.datas[i][j])) {
                    return "string";
                }
            }
        }
        return "number";
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
    repaint: function () {
        console.log(this.data.xValues);
        inputData = this.convertData();
        console.log(inputData);
        switch (this.data.value1) {
            case "line":
                line.init(inputData, this.judgeXType(), this.judgeYType());
                break;
            case "bar":
                bar.init(inputData, this.judgeXType(), this.judgeYType());
                break;
            case "pie":
                pie.init([inputData.keys(), inputData.values()], this.judgeXType(), this.judgeYType());
                break;
            case "scatter":
                scatter.init(inputData, this.judgeXType(), this.judgeYType());
                break;
        }
        this.onLoad();
    },
    //导出csv
    exportToCSV() {
        wx.request({
            url: exportToCSVUrl,
            data: {
                type: 'csv',
                dataSet: {
                    "id": null,
                    "name": null,
                    "userId": wx.getStorageSync('user'),
                    "dataArray": line.convertToSend(), //将当前绘图的数据进行导出csv
                },
            },
            method: "POST",
            success: function () {
                wx.downloadFile({
                    url: '',
                    success: res => {
                        wx.saveFile({
                            tempFilePath: res.tempFilePath,
                            success: res => {
                                console.log(res.savedFilePath);
                            }
                        })
                    }

                })
            },
        });
    },
    // 保存全部模板
    saveModel: function () {
        line.lineTemplate.visible = 1;
        scatter.scatterTemplate.visible = 1;
        bar.barTemplate.visible = 1;
        pie.pieTemplate.visible = 1;
        var count = 0;
        wx.request({
            url: saveLineTemplateUrl,
            data: line.lineTemplate,
            method: "POST",
            dataType: "json",
            success: function () {
                count++;
            }
        });
        wx.request({
            url: saveBarTemplateUrl,
            data: bar.barTemplate,
            method: "POST",
            dataType: "json",
            success: function () {
                count++;
            }
        });
        wx.request({
            url: savePieTemplateUrl,
            data: pie.pieTemplate,
            method: "POST",
            dataType: "json",
            success: function () {
                count++;
            }
        });
        wx.request({
            url: saveScatterTemplateUrl,
            data: scatter.scatterTemplate,
            method: "POST",
            dataType: "json",
            success: function () {
                count++;
            }
        });
        if (count === 4) {
            wx.showToast({
                title: '保存成功',
            });
        }

    },
    saveLineTemplate: saveLineTemplate,
    saveBarTemplate: saveBarTemplate,
    savePieTemplate: savePieTemplate,
    saveScatterTemplate: saveScatterTemplate,
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    saveImage: function () {
        wx.showModal({
            cancelColor: '#9ba8ae',
            title: '提示',
            content: '你确定要将此图保存到相册中吗？',
            success: res => {
                if (res.confirm) {
                    const ecCompoent = this.selectComponent('#' + this.data.value1 + "ChartId");
                    //const ecCompoent = this.selectComponent('#pie' + "ChartId");
                    ecCompoent.canvasToTempFilePath({
                        success: res => {
                            console.log("tempFilePath:", res.tempFilePath);
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath || '',
                                success: res => {
                                    wx.showToast({
                                        title: '保存成功',
                                    })
                                }
                            })
                        }
                    });
                } else {
                    wx.showToast({
                        title: '您取消了保存',
                    });
                }
            }
        });

    }
});
// 坐标轴min和max还有待函数进行处理。
// 散点图的大小变化函数要能够处理负数。
function isShowPie() {
    // 扇形图展示不能有负数
    // 扇形图不能展示全为number的数据
    // 扇形图不能展示全为string的数据
    if ((xType === "string" && yType === "string") || (xType === "number" && yType === "number")) {
        return false;
    } else {
        return true;
    }
}

function saveLineTemplate() {
    line.lineTemplate.visible = 1;
    wx.request({
        url: saveLineTemplateUrl,
        data: line.lineTemplate,
        method: "POST",
        dataType: "json",
        success: function () {
            wx.showToast({
                title: '保存成功',
            });
        }
    });
}

function saveBarTemplate() {
    bar.barTemplate.visible = 1;
    wx.request({
        url: saveBarTemplateUrl,
        data: bar.barTemplate,
        method: "POST",
        dataType: "json",
        success: function () {
            wx.showToast({
                title: '保存成功',
            });
        }
    });
}

function savePieTemplate() {
    pie.pieTemplate.visible = 1;
    wx.request({
        url: savePieTemplateUrl,
        data: pie.pieTemplate,
        method: "POST",
        dataType: "json",
        success: function () {
            wx.showToast({
                title: '保存成功',
            });
        }
    });
}

function saveScatterTemplate() {
    scatter.scatterTemplate.visible = 1;
    wx.request({
        url: saveScatterTemplateUrl,
        data: scatter.scatterTemplate,
        method: "POST",
        dataType: "json",
        success: function () {
            wx.showToast({
                title: '保存成功',
            });
        }
    });
}

function onPointLineDragging(dataIndex) {
    // 这里的 data 就是本文最初的代码块中声明的 data，在这里会被更新。
    // 这里的 this 就是被拖拽的圆点。this.position 就是圆点当前的位置。
    line.inputList[dataIndex] = line.lineChart.convertFromPixel('grid', this.position);

    if (line.xType === "string") {
        line.inputList[dataIndex][0] = line.xMap.get(dataIndex);
        this.position = [line.lineChart.convertToPixel({
            xAxisIndex: 0
        }, line.xMap.get(dataIndex)), this.position[1]];
    }

    if (line.yType === "string") {
        line.inputList[dataIndex][1] = line.xMap.get(dataIndex);
        this.position[1] = line.lineChart.convertToPixel({
            yAxisIndex: 0
        }, line.yMap.get(dataIndex));
    }
    var name = line.indexToName[dataIndex];
    setTimeout(function () {
        line.lineChart.setOption({
            series: [{
                name: name,
                data: line.inputList.slice(line.nameToIndex[name].minIndex, line.nameToIndex[name].maxIndex)
            }]
        });
    }, 0);
    line.updateInputData(dataIndex, line.inputList[dataIndex]);
}


function onPointBarDragging(dataIndex) {
    // 这里的 data 就是本文最初的代码块中声明的 data，在这里会被更新。
    // 这里的 this 就是被拖拽的圆点。this.position 就是圆点当前的位置。
    bar.inputList[dataIndex] = bar.barChart.convertFromPixel('grid', this.position);
    if (bar.xType === "string") {
        bar.inputList[dataIndex][0] = bar.xMap.get(dataIndex);
        this.position[0] = bar.barChart.convertToPixel({
            xAxisIndex: 0
        }, bar.xMap.get(dataIndex)) - bar.barTemplate.width / 2;
    }
    if (bar.yType === "string") {
        bar.inputList[dataIndex][1] = bar.yMap.get(dataIndex);
        this.position[1] = bar.barChart.convertToPixel({
            yAxisIndex: 0
        }, bar.yMap.get(dataIndex)) - bar.barTemplate.width / 2;
    }
    var name = bar.indexToName[dataIndex];
    setTimeout(function () {
        bar.barChart.setOption({
            series: [{
                name: name,
                data: bar.inputList.slice(bar.nameToIndex[name].minIndex, bar.nameToIndex[name].maxIndex)
            }]
        });
    }, 0);
    bar.updateInputData(dataIndex, bar.inputList[dataIndex]);
}

function onPointScatterDragging(dataIndex) {
    scatter.inputList[dataIndex] = scatter.scatterChart.convertFromPixel('grid', this.position);
    if (scatter.xType === "string") {
        scatter.inputList[dataIndex][0] = scatter.xMap.get(dataIndex);
        this.position[0] = scatter.scatterChart.convertToPixel({
            xAxisIndex: 0
        }, scatter.xMap.get(dataIndex));
    }
    if (scatter.yType === "string") {
        scatter.inputList[dataIndex][1] = scatter.yMap.get(dataIndex);
        this.position[1] = scatter.scatterChart.convertToPixel({
            yAxisIndex: 0
        }, scatter.yMap.get(dataIndex));
    }
    setTimeout(function () {
        scatter.scatterChart.setOption({
            series: [{
                data: scatter.inputList
            }]
        });
    }, 0);
    scatter.updateInputData(dataIndex, scatter.inputList[dataIndex]);
}


function showLineTooltip(dataIndex) {
    line.lineChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
    });
}

function hideLineTooltip(dataIndex) {
    line.lineChart.dispatchAction({
        type: 'hideTip'
    });
}


function showScatterTooltip(dataIndex) {
    scatter.scatterChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
    });
}

function hideScatterTooltip(dataIndex) {
    scatter.scatterChart.dispatchAction({
        type: 'hideTip'
    });
}

function setMinAndMax(option) {
    if (xType === "number") {
        option.xAxis['min'] = getMinInInput(0);
        option.xAxis['max'] = getMaxInInput(0);
    }
    if (yType === "number") {
        option.yAxis['min'] = getMinInInput(1);
        option.yAxis['max'] = getMaxInInput(1);
    }
    return option;
}


function getMinInInput(index) {
    // index 表示 是 哪一个轴上的最小值
    return "-90";
}

function getMaxInInput(index) {
    // index 表示 是 哪一个轴上的最大值
    return "90";
}