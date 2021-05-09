// pages/draw/draw.js

import * as echarts from '../../ec-canvas/echarts';
import * as graph from './class';

const saveLineTemplateUrl = "http://www.jaripon.xyz/template/linechart/save";
const saveBarTemplateUrl = "http://www.jaripon.xyz/template/barchart/save";
const savePieTemplateUrl = "http://www.jaripon.xyz/template/fanchart/save";
const saveScatterTemplateUrl = "http://www.jaripon.xyz/template/scatterplot/save";
const exportToCSVUrl = "http://www.jaripon.xyz/data/export/1";

const replaceLineTemplateUrl = "http://www.jaripon.xyz/template/linechart/replace";
const replaceBarTemplateUrl = "http://www.jaripon.xyz/template/barchart/replace";
const replacePieTemplateUrl = "http://www.jaripon.xyz/template/fanchart/replace";
const replaceScatterTemplateUrl = "http://www.jaripon.xyz/template/scatterplot/replace";

export var inputData = {}; // 输入数据

var xType = "number"; // 输入数据x轴类型
var yType = "number"; // 输入数据y轴类型

export var bar = new graph.BarGraph();
export var line = new graph.LineGraph();
export var pie = new graph.PieGraph();
export var scatter = new graph.ScatterGraph();

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

/**
 * 初始化折线图
 * 
 * 初始化折线图画图对象
 */
function initLineChart(canvas, width, height, dpr) {
    line.init(inputData, xType, yType);
    var lineChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    line.lineChart = lineChart;
    canvas.setChart(lineChart);
    lineChart = setLineOption(lineChart);
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
function setLineOption(lineChart) {
    var series = [];
    var count = 0;
    var option;
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

    option = {
        grid: {
            right: '18%',
            top: '16%',
        },
        toolbox: {
            feature: {
                mySaveAsImage: mySaveImage(),
            }
        },
        title: {
            text: graphName,
            left: "center",
            textStyle: {
                color: line.lineTemplate.textColor,
                fontSize: line.lineTemplate.font
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
    option = setMinAndMax(option);
    setLegendOption(option, line.lineTemplate.legendPos);
    lineChart.setOption(option); // 
    if (line.lineTemplate.showDigit) {
        lineChart.setOption({
            tooltip: {
                triggerOn: 'none',
                formatter: function (params) {
                    var xstr = line.xType === "string" ? params.data[0] : parseFloat(params.data[0]).toFixed(2);
                    var ystr = line.yType === "string" ? params.data[1] : parseFloat(params.data[1]).toFixed(2);
                    return 'X: ' +
                        xstr +
                        '\nY: ' +
                        ystr;
                }
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
    lineChart.setOption({
        graphic: echarts.util.map(line.inputList, function (dataItem, dataIndex) {
            //dataIndex - line.nameToIndex[line.indexToName[dataIndex]].minIndex
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
                draggable: !(xType === 'string' && yType === 'string'),
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

/**
 * 
 * 初始化条形图
 * 初始化条形图画图对象
 * @returns 
 */
function initBarChart(canvas, width, height, dpr) {
    bar.init(inputData, xType, yType);
    var barChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    bar.barChart = barChart;
    canvas.setChart(barChart);
    if (isShowBarChart()) {
        barChart = setBarOption(barChart);
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
function setBarOption(barChart) {
    var series = [];
    var count = 0;
    var option;
    for (var i = 0; i < bar.inputList.length;) {
        var name = bar.indexToName[i];
        var tempJson = {
            name: name,
            type: "bar",
            data: bar.inputList.slice(bar.nameToIndex[name].minIndex, bar.nameToIndex[name].maxIndex),
            barWidth: bar.barTemplate.width,
            barGap: bar.barTemplate.gap,
            color: bar.barTemplate.color[count]
        };
        i = bar.nameToIndex[name].maxIndex;
        series.push(tempJson);
        count++;
    }
    option = {
        grid: {
            right: '18%',
            top: '16%',
        },
        title: {
            text: graphName,
            left: "center",
            textStyle: {
                color: bar.barTemplate.textColor,
                fontSize: bar.barTemplate.font
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
    setLegendOption(option, bar.barTemplate.legendPos);
    setMinAndMax(option);
    barChart.setOption(option);
    if (bar.barTemplate.showDigit) {
        barChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                // formatter: function (params) {
                //     console.log(params);
                //     var result = '';
                //     params.forEach(function(item){
                //         result += item.marker + " " + item.seriesName + " " + parseFloat(item.data[1 - item.axisIndex]) + '\n';
                //     })
                //     console.log(result);
                //     return params[0].marker;
                // }
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
    pie.pieChart = pieChart;
    canvas.setChart(pieChart);
    pieChart = setPieOption(pieChart, true);
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
function setPieOption(pieChart) {
    var option;
    var series = [];
    var legendArr = pie.pieTemplate.legendPos.split(",");
    var tempJson = {
        name: pie.name,
        type: 'pie',
        radius: pie.pieTemplate.radius,
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
                color: pie.pieTemplate.textColor,
                fontSize: pie.pieTemplate.titleFont
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
    setLegendOption(option, pie.pieTemplate.legendPos);
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
    scatter.scatterChart = scatterChart;
    canvas.setChart(scatterChart);
    if (scatter.xType === "number" && scatter.yType === "number") {
        getPage().setData({
            showScatterChart: true
        });
        scatterChart = setScatterOption(scatterChart);
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
function setScatterOption(scatterChart) {
    var legendArr = scatter.scatterTemplate.legendPos.split(",");
    var series = [];
    var count = 0;
    for (var i = 0; i < scatter.inputList.length;) {
        var name = scatter.indexToName[i];
        var tempJson = {
            name: name,
            type: "scatter",
            symbolSize: scatter.scatterTemplate.increase ? function (data, params) {
                return Math.sqrt(data[1]) * 7; // 开方 此函数不能处理负数
            } : 15,
            data: scatter.inputList.slice(scatter.nameToIndex[name].minIndex, scatter.nameToIndex[name].maxIndex),
            lineStyle: {
                color: scatter.scatterTemplate.color[count],
            }
        };
        i = scatter.nameToIndex[name].maxIndex;
        series.push(tempJson);
        count++;
    }

    var option = {
        grid: {
            right: '18%',
            top: '16%',
        },
        title: {
            text: graphName,
            left: 'center',
            textStyle: {
                color: scatter.scatterTemplate.textColor,
                fontSize: scatter.scatterTemplate.font
            }
        },
        toolbox: {
            feature: {
                mySaveAsImage: mySaveImage(),
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
        series: series,
    };
    setLegendOption(option, scatter.scatterTemplate.legendPos);
    setMinAndMax(option);
    scatterChart.setOption(option);
    if (scatter.scatterTemplate.showLine) {
        scatterChart.setOption({
            tooltip: {
                trigger: "axis",
                formatter: function (params) {
                    var xstr = scatter.xType === "string" ? params[0].data[0] : parseFloat(params[0].data[0]).toFixed(2);
                    var ystr = scatter.yType === "string" ? params[0].data[1] : parseFloat(params[0].data[1]).toFixed(2);
                    return 'X: ' + xstr + '\nY: ' + ystr;
                },
                axisPointer: {
                    type: "line",
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
                draggable: !(xType === 'string' && yType === 'string'),
                ondrag: echarts.util.curry(onPointScatterDragging, dataIndex),
                z: 100,
                onmousemove: echarts.util.curry(showScatterTooltip, dataIndex),
                onmouseout: echarts.util.curry(hideScatterTooltip, dataIndex),
            };
        })
    });
    return scatterChart;
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
        showPieChart: true,
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
    async onLoad() {
        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel) {
            eventChannel.on("openData", res => {
                this.openData(res.data)
            })
        }
    },
    changeRegion: function (event) {
        var newRegion = [event.target.dataset.a, event.target.dataset.b];
        console.log("现在是" + newRegion[0] + newRegion[1]);
        this.setData({
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
    convertPaintData: function () { //转化所需数据
        var ret = {};
        var i;
        var j;
        if (this.data.x1 > this.data.x2) {
            var tmp = this.data.x1;
            this.setData({
                x1: this.data.x2
            });
            this.setData({
                x2: tmp
            });
        }
        if (this.data.y1 > this.data.y2) {
            var tmp = this.data.y1;
            this.setData({
                y1: this.data.y2
            });
            this.setData({
                y2: tmp
            });
        }
        if (this.data.x1 == 0 && this.data.x2 == 0 && this.data.y1 == 0 && this.data.y2 == 0) {
            return this.convertData();
        }
        for (i = this.data.x1; i <= this.data.x2; i++) {
            var tmp = [];
            for (j = this.data.y1; j <= this.data.y2; j++) {
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
                updatePieData(inputData.keys(), inputData.values());
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
        for (i = 0; i < this.data.groupNum; i++) {
            var obj = {
                "name": this.data.groupName[i],
                "cid": null,
                "lineData": this.data.datas[i]
            }
            dataArray.push(obj);
        }
        ret["dataArray"] = dataArray;
        var url = "http://www.jaripon.xyz/data/save";
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
        // var x = await this.trans(url, ret);
    },
    //导出csv
    exportToCSV() {
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
            url: exportToCSVUrl,
            data: {
                "id": null,
                "name": null,
                "userId": wx.getStorageSync('uid'),
                // "dataArray": line.convertToSend() //将当前绘图的数据进行导出csv
                "dataArray": dataArray
            },
            method: "POST",
            success: function (res) {
                console.log(res);
                // wx.downloadFile({
                //     url: '',
                //     success: res => {
                //         wx.saveFile({
                //             tempFilePath: res.tempFilePath,
                //             success: res => {
                //                 console.log(res.savedFilePath);
                //             }
                //         })
                //     }

                // })
            },
            fail: function () {
                console.log("error");
            }
        });
    },
    openData: function (data) {
        var newGroupName = [];
        var newDatas = [];
        var dataArray = data[dataArray];
        var i;
        for (i = 0; i < dataArray.length; i++) {
            newGroupName.push(dataArray[i]["name"]);
            newDatas.push(dataArray[i]["lineData"]);
        }
        console.log('newDatas', newDatas)
        this.setData({
            datas: newDatas,
            groupName: newGroupName
        })
    },
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
            url: "http://www.jaripon.xyz/data/export/" + this.judgeXType(),
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
    saveChart() {
        var ret = {};
        ret["id"] = null;
        ret["name"] = "";
        ret["xLabel"] = null;
        ret["yLabel"] = null;
        ret["xId"] = 0;
        ret["yId"] = 0;
        ret["xBegin"] = (this.data.x1 > this.data.x2) ? this.data.x1 : this.data.x2;
        ret["yBegin"] = (this.data.y1 > this.data.y2) ? this.data.y1 : this.data.y2;
        ret["barChartTemplate"] = barChart.barChartTemplate;
        var data = {};
        data["id"] = null;
        data["name"] = "";
        data["userId"] = wx.getStorageSync('uid');
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
        data["dataArray"] = dataArray;
        ret["data"] = data;
        var url = "http://www.jaripon.xyz/barchart/save";
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
        delete ret.barChartTemplate;
        ret["lineChartTemplate"] = lineChart.lineChartTemplate;
        url = "http://www.jaripon.xyz/linechart/save"
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
        delete ret.lineChartTemplate;
        ret["fanChartTemplate"] = pieChart.pieTemplate;
        url = "http://www.jaripon.xyz/fanchart/save"
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
        delete ret.fanChartTemplate;
        ret["scatterPlotTemplate"] = scatter.scatterPlotTemplate;
        url = "http://www.jaripon.xyz/scatterplot/save"
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
    },
    openChart(chart) {
        lineChart.lineChartTemplate = chart["lineChartTemplate"];
        barChart.barChartTemplate = chart["barChartTemplate"];
        pieChart.pieTemplate = chart["fanChartTemplate"];
        scatter.scatterPlotTemplate = chart["scatterPlotTemplate"];
        var newGroupName = [];
        var newDatas = [];
        var dataArray = data[dataArray];
        var i;
        for (i = 0; i < dataArray.length; i++) {
            newGroupName.push(dataArray[i]["name"]);
            newDatas.push(dataArray[i]["lineData"]);
        }
        console.log('newDatas', newDatas)
        this.setData({
            datas: newDatas,
            groupName: newGroupName
        })
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
    onReady: function () {

    },
    onUnload: function () {
        inputData = [];
    },
});

/**
 * 此方法用来在重画图表（repaint）时设置图的可见性
 */
function updateShow() {
    getPage().setData({
        showBarChart: isShowBarChart(),
        showPieChart: isShowPieChart(),
        showScatterChart: isShowScatterChart()
    });
}
/**
 * 
 * @returns 是否显示条形图
 */
function isShowBarChart() {
    return (xType === "string" && yType === "number") || (xType === "string" && yType === "number");
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
    return (xType === "number" && yType === "number");
}

/**
 * 
 * @returns 当前页面对象
 */
export function getPage() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}

/**
 * 折线图
 * 此方法传入更新数据，用来更新折线图的数据并重新画图
 * @param {*} inputData 
 */
function updateLineData(inputData) {
    line.init(inputData, xType, yType);
    setLineOption(line.lineChart);
}

/**
 * 条形图
 * 此方法传入更新数据，用来更新条形图的数据并重新画图
 * @param {*} inputData 
 */
function updateBarData(inputData) {
    bar.init(inputData, xType, yType);
    if (isShowBarChart()) {
        setBarOption(bar.barChart);
    }
}

/**
 * 扇形图
 * 此方法传入更新数据的name和data，用来更新扇形图的数据并重新画图
 * @param {*} inputData 
 */
function updatePieData(name, data) {
    if (!(xType === "string" && yType === "string") || (xType === "number" && yType === "number")) {
        if (pie.setInpuData(name, data)) {
            getPage().setData({
                showPieChart: true
            });
            setPieOption(pie.pieChart);
        } else {
            getPage().setData({
                showPieChart: false
            });
        }
    } else {
        getPage().setData({
            showPieChart: false
        });
    }

}
/**
 * 散点图
 * 此方法传入更新数据，用来更新散点图的数据并重新画图
 * @param {*} inputData 
 */
function updateScatterData(inputData) {
    scatter.init(inputData, xType, yType);
    var flag = (scatter.xType === "number" && scatter.yType === "number");
    if (flag) {
        getPage().setData({
            showScatterChart: true
        });
        setScatterOption(scatter.scatterChart);
    } else {
        getPage().setData({
            showScatterChart: false
        });
    }
}

/**
 * 折线图模板
 * 此方法需要传入修改后或更换后的模板json对象
 * 用来修改和更换折线图模板，并重新画图
 * @param {*} template 
 */
export function updateLineTemplate(template) {
    line.setLineTemplate(template);
    setLineOption(line.lineChart);
}

/**
 * 条形图模板
 * 此方法需要传入修改后或更换后的模板json对象
 * 用来修改和更换条形图模板，并重新画图
 * @param {*} template 
 */
export function updateBarTemplate(template) {
    bar.setLineTemplate(template);
    setBarOption(bar.barChart);
}

/**
 * 饼状图模板
 * 此方法需要传入修改后或更换后的模板json对象
 * 用来修改和更换饼状图模板，并重新画图
 * @param {*} template 
 */
export function updatePieTemplate(template) {
    pie.setLineTemplate(template);
    setPieOption(pie.pieChart);
}

/**
 * 散点图模板
 * 此方法需要传入修改后或更换后的模板json对象
 * 用来修改和更换散点图模板，并重新画图
 * @param {*} template 
 */
export function updateScatterTemplate(template) {
    scatter.setLineTemplate(template);
    setScatterOption(scatter.scatterChart);
}
/**
 * 折线图模板上传
 * 此方法是将折线图模板上传到服务器
 */
function saveLineTemplate() {
    line.lineTemplate.visible = "true";
    wx.request({
        url: saveLineTemplateUrl,
        data: converToBackTemplate(line.lineTemplate, "line"),
        method: "POST",
        dataType: "json",
        success: function () {
            wx.showToast({
                title: '保存成功',
            });
        }
    });
}

/**
 * 条形图模板上传
 * 此方法是将条形图模板上传到服务器
 */
function saveBarTemplate() {
    bar.barTemplate.visible = 1;
    wx.request({
        url: saveBarTemplateUrl,
        data: converToBackTemplate(bar.barTemplate, "bar"),
        method: "POST",
        dataType: "json",
        success: function () {
            wx.showToast({
                title: '保存成功',
            });
        }
    });
}

/**
 * 饼状图模板上传
 * 此方法是将饼状图模板上传到服务器
 */
function savePieTemplate() {
    pie.pieTemplate.visible = 1;
    wx.request({
        url: savePieTemplateUrl,
        data: converToBackTemplate(pie.pieTemplate, "pie"),
        method: "POST",
        dataType: "json",
        success: function () {
            wx.showToast({
                title: '保存成功',
            });
        }
    });
}

/**
 * 散点图模板上传
 * 此方法是将散点图模板上传到服务器
 */
function saveScatterTemplate() {
    scatter.scatterTemplate.visible = 1;
    wx.request({
        url: saveScatterTemplateUrl,
        data: converToBackTemplate(scatter.scatterTemplate, "scatter"),
        method: "POST",
        dataType: "json",
        success: function () {
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
 * 此方法是折线图中点被拖拽时触发的更新位置方法
 * @param {*} dataIndex 
 */
function onPointLineDragging(dataIndex) {
    // 这里的 data 就是本文最初的代码块中声明的 data，在这里会被更新。
    // 这里的 this 就是被拖拽的圆点。this.position 就是圆点当前的位置。
    line.inputList[dataIndex] = line.lineChart.convertFromPixel('grid', this.position);

    if (line.xType === "string") {
        line.inputList[dataIndex][0] = line.xMap.get(dataIndex);
        line.inputList[dataIndex][1] = parseFloat(line.inputList[dataIndex][1]).toFixed(2);
        this.position[0] = line.lineChart.convertToPixel({
            xAxisIndex: 0
        }, line.xMap.get(dataIndex));
    }

    if (line.yType === "string") {
        line.inputList[dataIndex][1] = line.yMap.get(dataIndex);
        line.inputList[dataIndex][0] = parseFloat(line.inputList[dataIndex][0]).toFixed(2);
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


/**
 * 此方法是柱状图图中点被拖拽时触发的更新位置方法
 * @param {*} dataIndex 
 */

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

/**
 * 此方法是散点图中点被拖拽时触发的更新位置方法
 * @param {*} dataIndex 
 */

function onPointScatterDragging(dataIndex) {
    scatter.inputList[dataIndex] = scatter.scatterChart.convertFromPixel('grid', this.position);
    if (scatter.xType === "string") {
        scatter.inputList[dataIndex][0] = scatter.xMap.get(dataIndex);
        scatter.inputList[dataIndex][1] = parseFloat(scatter.inputList[dataIndex][1]).toFixed(2);
        this.position[0] = scatter.scatterChart.convertToPixel({
            xAxisIndex: 0
        }, scatter.xMap.get(dataIndex));
    }
    if (scatter.yType === "string") {
        scatter.inputList[dataIndex][1] = scatter.yMap.get(dataIndex);
        scatter.inputList[dataIndex][0] = parseFloat(scatter.inputList[dataIndex][0]).toFixed(2);
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

/**
 * 此方法是显示折线图中点旁边的标注，触发条件为点击拖拽点
 * @param {*} dataIndex 
 */
function showLineTooltip(dataIndex) {
    var name = line.indexToName[dataIndex];
    var count = 0;
    for (var key in inputData) {
        if (key === name) {
            break;
        } else {
            count++;
        }
    }

    line.lineChart.dispatchAction({
        type: 'showTip',
        seriesIndex: count,
        dataIndex: dataIndex - line.nameToIndex[line.indexToName[dataIndex]].minIndex
    });
}

/**
 * 此方法是隐藏折线图中点旁边的标注，触发条件为不点击拖拽点
 * @param {*} dataIndex 
 */

function hideLineTooltip(dataIndex) {
    line.lineChart.dispatchAction({
        type: 'hideTip'
    });
}

/**
 * 此方法是显示散点图中点旁边的标注，触发条件为点击拖拽点
 * @param {*} dataIndex 
 */

function showScatterTooltip(dataIndex) {
    var name = scatter.indexToName[dataIndex];
    var count = 0;
    for (var key in inputData) {
        if (key === name) {
            break;
        } else {
            count++;
        }
    }
    scatter.scatterChart.dispatchAction({
        type: 'showTip',
        seriesIndex: count,
        dataIndex: dataIndex - scatter.nameToIndex[scatter.indexToName[dataIndex]].minIndex
    });
}

/**
 * 此方法是隐藏散点图中点旁边的标注，触发条件为不点击拖拽点
 * @param {*} dataIndex 
 */
function hideScatterTooltip(dataIndex) {
    scatter.scatterChart.dispatchAction({
        type: 'hideTip'
    });
}

/**
 * 此方法传入需要被设置图例的option，
 * 并根据传入的图例字符串来进行设置
 * @param {*} option 
 * @param {*} legendPos 
 */
export function setLegendOption(option, legendPos) {
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

/**
 * 此方法传入一个需要被设置min和max属性的option
 * 为传入的option设置min和max值
 * @param {*} option 
 * @returns 
 */

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

/**
 * 此方法传入一个index，0表示x轴，1表示y轴
 * 为传入的轴创建最小值
 * @param {} index 
 * @returns 
 */

function getMinInInput(index) {
    // index 表示 是 哪一个轴上的最小值
    return "-90";
}

/**
 * 此方法传入一个index，0表示x轴，1表示y轴
 * 为传入的轴创建最大值
 * @param {} index 
 * @returns 
 */

function getMaxInInput(index) {
    // index 表示 是 哪一个轴上的最大值
    return "90";
}