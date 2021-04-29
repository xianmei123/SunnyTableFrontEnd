// pages/draw/draw.js

import * as echarts from '../../ec-canvas/echarts';

class LineGraph {
    // 单个折线图时，需要考虑横纵坐标值的类型，如果横坐标或纵坐标中有一个是字符串类型，则设置对应的坐标轴中的
    // xAxis和yAxis的type类型为category，并设置boundaryGap为false（表示坐标轴中不存在区间值。），然后在初始画图时对对应坐标轴
    // 设置xMap 或 yMap 来映射点的下标和其对应的字符串，然后在对点进行拖动时重新绘图时需要将对应坐标数值转换为字符串，悲伤的事实证明这种方法画出来的图
    // 会出现拖动一段时间之后，无法再进行拖动的bug。

    // 重构的方法：在有一方为字符串时，为此方确定对应的data，然后在series中仅仅设置另外一方的data，并在转换时仅仅转换非字符串一方的坐标
    // 这样就会简化掉上一种方法中的更新操作时的对坐标的替换，理论上保证了不会出现bug！！！
    // 


    // 如果横纵坐标值的类型均为字符串，则xAxis和yAxis都设置为category，并设置图形不可拖拽，除此情况之外均可进行拖拽
    // 

    // 如果为数值类型，则将type设置为value，根据情况设置拖拽范围即xAxis中的min和max属性。


    // 多个折线图展示时，横纵坐标类型应该相同。不同时抛出异常

    // 多个折线图需要在option中添加多个{},即可，每一个数据需要自行指派。
    lineChart;
    count = 0;
    inputList = []; // 输入数据 坐标列表 
    indexToName = []; // <index, name>
    nameToIndex = {};

    xMap = new Map(); // <data.index, data.index.x> // data中每一个数组在data中下标-> 该下标对应的两个元素的x坐标
    yMap = new Map(); // 同上。

    xType = "string"; // 暂定于为 两个值 'string' 和 'number', xAxis 和 yAxix 中的 boundaryGap、type均以此变量决定。
    yType = "number"; // 暂定于上面两个值。

    draggable = !(this.xType === 'string' && this.yType === 'string');

    lineModelPro = {
        "id": 5, //扇形图模版id
        "name": "", //模板名称
        "userId": 123, //用户id
        "radius": 20, //圆半径
        "point": [], //点样式  
        "color": ['red', '#ba55d3'],
        "showDight": false, //"true" or "false"，是否显示数值，指图中每个点是否标注数值
        "font": 5, //字体大小
        "legendPos": 456, //图例位置
        "textColor": [], //字体颜色
    };

    constructor() {
        console.log("lingraph!!");
    }

    setLineModel() {}

    setInputList(inputData) {
        this.count = 0;
        for (var tempKey in inputData) {
            var name = tempKey;
            var data = inputData[tempKey];
            this.nameToIndex[name] = {
                "minIndex": this.inputList.length,
                "maxIndex": this.inputList.length + data.length
            };
            for (var i = 0; i < data.length; i++) {
                this.indexToName.push(name);
            }
            for (var i in data) {
                this.inputList.push(data[i]);
            }
            this.count++;
        }
    }

    convertToSend() {
        var dataArray = [];
        var tempJson = {};
        tempJson['xLable'] = getSingleData(this.inputList.slice(this.nameToIndex[this.indexToName[0]].minIndex, this.nameToIndex[this.indexToName[0]].maxIndex), 0);
        dataArray.push(tempJson);
        for (var i = 0; i < this.inputList.length;) {
            var name = this.indexToName[i];
            var tempArr = getSingleData(this.inputList.slice(this.nameToIndex[name].minIndex, this.nameToIndex[name].maxIndex), 1);
            tempJson = {};
            tempJson[name] = tempArr;
            dataArray.push(tempJson);
            i = this.nameToIndex[name].maxIndex;
        }
        return dataArray;
    }
}

class BarGraph {
    barChart;
    count = 0;
    inputList = []; // 输入数据 坐标列表 
    indexToName = []; // <index, name>
    nameToIndex = {};

    xMap = new Map(); // <data.index, data.index.x> // data中每一个数组在data中下标-> 该下标对应的两个元素的x坐标
    yMap = new Map(); // 同上。

    xType = "string"; // 暂定于为 两个值 'string' 和 'number', xAxis 和 yAxix 中的 boundaryGap、type均以此变量决定。
    yType = "number"; // 暂定于上面两个值。

    draggable = !(this.xType === 'string' && this.yType === 'string');

    barModelPro = {
        "id": 5, //扇形图模版id
        "name": "", //模板名称
        "userId": 123, //用户id
        "width": 30, //条宽度
        "gap": '0%', //条间隔
        "color": ['red', '#ba55d3'],
        "showDight": false, //"true" or "false"，是否显示数值，指图中每个点是否标注数值
        "font": 5, //字体大小
        "legendPos": 456, //图例位置
        "textColor": [], //字体颜色
    };
    constructor() {}
    setInputList(inputData) {
        this.count = 0;
        for (var tempKey in inputData) {
            var name = tempKey;
            var data = inputData[tempKey];

            this.nameToIndex[name] = {
                "minIndex": this.inputList.length,
                "maxIndex": this.inputList.length + data.length
            };
            for (var i = 0; i < data.length; i++) {
                this.indexToName.push(name);
            }
            for (var i in data) {
                this.inputList.push(data[i]);
            }
            this.count++;
        }
    }
}

class pieGraph {
    pieChart;
    constructor() {}

    pieModelPro = {
        "id": 123,
        "name": "lsp",
        "userId": "lsp",
        "radius": "40%",
        "color": ['red', "purple"],
        "showLabel": [],
        "showPercent": true,
        "font": 24,
        "legendPos": "left",
        "textColor": "red"
    };
    convertToPieData(tempData) {
        var resultArr = [];
        for (var i in tempData) {
            var tempJson = {};
            tempJson.name = tempData[i][0];
            tempJson.value = tempData[i][1];
            resultArr.push(tempJson);
        }
        return resultArr;
    }

}


var inputData = {
    "sb": [
        ['sb1', 7],
        ['sb2', 10],
        ['sb3', 20],
        ['sb4', 30],
        ['sb5', 40]
    ],
    // "qqhsb": [
    //     ['sb1', 7],
    //     ['sb2', 40],
    //     ['sb3', 30],
    //     ['sb4', 25],
    //     ['sb5', 11]
    // ],
}; // 输入数据

var line = new LineGraph();
var bar = new BarGraph();
var pie = new pieGraph();
var graphName = "sb"; // 在图的最上方显示的标题

function getSingleData(tempData, index) {
    var result = [];
    for (var i = 0; i < tempData.length; i++) {
        result.push(tempData[i][index]);
    }
    return result;
}
line.setInputList(inputData);
bar.setInputList(inputData);

function initLineChart(canvas, width, height, dpr) {
    var lineChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    line.lineChart = lineChart;

    canvas.setChart(lineChart);
    var option = setLineOption();
    lineChart.setOption(option); // 
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
                    r: line.lineModelPro.radius / 2
                    // r : 20 / 2
                },
                invisible: true,
                draggable: line.draggable,
                ondrag: echarts.util.curry(onPointLineDragging, dataIndex),
                z: 100,
                onmousemove: echarts.util.curry(showTooltip, dataIndex),
                onmouseout: echarts.util.curry(hideTooltip, dataIndex),
            };
        })
    });
    console.log("success");
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
            symbolSize: line.lineModelPro.radius,
            data: line.inputList.slice(line.nameToIndex[name].minIndex, line.nameToIndex[name].maxIndex),
            lineStyle: {
                color: line.lineModelPro.color[count],
            }
        };
        i = line.nameToIndex[name].maxIndex;
        series.push(tempJson);
        count++;
    }
    console.log(series);
    var option = {
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
        xAxis: {
            type: line.xType === "string" ? 'category' : 'value',
            boundaryGap: !(line.xType === "string"),
            // min: -10,
            // max: 100,
            axisLine: {
                onZero: false
            }
        },
        yAxis: {
            min: -30,
            max: 60,
            type: line.yType === "string" ? 'category' : 'value',
            boundaryGap: !(line.xType === "string"),
            axisLine: {
                onZero: false
            },
        },
        series: series
    };
    return option;
}

function initBarChart(canvas, width, height, dpr) {
    var barChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });

    bar.barChart = barChart;
    canvas.setChart(barChart);
    var option = setBarOption();
    barChart.setOption(option);
    barChart.setOption({
        graphic: echarts.util.map(bar.inputList, function (dataItem, dataIndex) {
            var position = bar.barChart.convertToPixel('grid', dataItem);
            if (bar.xType === 'string') {
                bar.xMap.set(dataIndex, dataItem[0]);
            }
            if (bar.yType === 'string') {
                bar.yMap.set(dataIndex, dataItem[1]);
            }
            return {
                type: 'rect',
                position: [position[0] - bar.barModelPro.width / 2, position[1]],
                shape: {
                    width: bar.barModelPro.width,
                    height: 10
                    // r : 20 / 2
                },
                invisible: false,
                draggable: true,
                ondrag: echarts.util.curry(onPointBarDragging, dataIndex),
                z: 100,
                //onmousemove: echarts.util.curry(showTooltip, dataIndex),
                //onmouseout: echarts.util.curry(hideTooltip, dataIndex),
            };
        })
    });
    return barChart;
}

function setBarOption() {
    var series = [];
    for (var i = 0; i < line.inputList.length;) {
        var name = line.indexToName[i];
        var tempJson = {
            name: name,
            type: "bar",
            symbolSize: line.lineModelPro.radius,
            data: bar.inputList.slice(bar.nameToIndex[name].minIndex, bar.nameToIndex[name].maxIndex),
            barWidth: bar.barModelPro.width,
            barGap: bar.barModelPro.gap
        };
        i = line.nameToIndex[name].maxIndex;
        series.push(tempJson);
    }
    var option = {
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
        xAxis: [{
            type: 'category',
            // axisLine: {
            //     onZero: false
            // }
        }],
        yAxis: [{
            min: -20,
            max: 80,
            type: 'value',
            // axisLine: {
            //     onZero: false
            // }
        }],
        series: series
    };
    return option;
}

function initPieChart(canvas, width, height, dpr) {
    var pieChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    pie.pieChart = pieChart;
    canvas.setChart(pieChart);
    var option = setPieOption();
    pieChart.setOption(option);
    return pieChart;
}

function setPieOption() {
    var series = [];
    for (var key in inputData) {
        var tempJson = {
            name: key,
            type: 'pie',
            radius: '40%',
            avoidLabelOverlap: false,
            data: pie.convertToPieData(inputData[key]),
        };
        series.push(tempJson);
    }
    var option = {
        title: {
            text: graphName,
            subtext: '纯属虚构',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                var result;
                if (pie.pieModelPro.showPercent) {
                    result = params.name + ": " +  params.percent + "%(" + params.value + ")";
                } else {
                    result = params.name + ": " + params.value;
                }
                return result;
                
            }
        },
        legend: {
            orient: 'vertical',
            left: pie.pieModelPro.legendPos,
        },
        series: series
    };
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
        lineChart: {
            onInit: initLineChart
        },
        barChart: {
            onInit: initBarChart
        },
        pieChart: {
            onInit: initPieChart
        }

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});

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
    var name = line.indexToName[dataIndex];
    setTimeout(function () {
        line.lineChart.setOption({
            series: [{
                name: name,
                data: line.inputList.slice(line.nameToIndex[name].minIndex, line.nameToIndex[name].maxIndex)
            }]
        });
    }, 0);

}

function onPointBarDragging(dataIndex) {
    // 这里的 data 就是本文最初的代码块中声明的 data，在这里会被更新。
    // 这里的 this 就是被拖拽的圆点。this.position 就是圆点当前的位置。
    bar.inputList[dataIndex] = bar.barChart.convertFromPixel('grid', this.position);
    if (bar.xType === "string") {
        bar.inputList[dataIndex][0] = bar.xMap.get(dataIndex);
        this.position = [bar.barChart.convertToPixel({
            xAxisIndex: 0
        }, bar.xMap.get(dataIndex)) - bar.barModelPro.width / 2, this.position[1]];
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
}


function showTooltip(dataIndex) {
    line.lineChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
    });
}

function hideTooltip(dataIndex) {
    line.lineChart.dispatchAction({
        type: 'hideTip'
    });
}