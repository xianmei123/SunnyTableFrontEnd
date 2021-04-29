// pages/draw/draw.js

import * as echarts from '../../ec-canvas/echarts';

class LineGraph {
    lineChart;
    inputList = []; // 
    pointToName = new Map(); // <index, name>
    nameToIndex = {};

    xMap = []; // <data.index, data.index.x> // data中每一个数组在data中下标-> 该下标对应的两个元素的x坐标
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
        "color": [],
        "showDight": false, //"true" or "false"，是否显示数值，指图中每个点是否标注数值
        "font": 5, //字体大小
        "legendPos": 456, //图例位置
        "textColor": [], //字体颜色
    };

    constructor() {}

    setLineModel() {

    }

    setInputList(name, data) {
        console.log(name, data);
        this.nameToIndex[name] = {
            "minIndex": this.inputList.length,
            "maxIndex": this.inputList.length + data.length
        };
        for (var i = 0; i < data.length; i++) {
            this.pointToName.set(this.inputList.length + i, name);
        }
        
        for (var i in data) {
            this.inputList.push(data[i]);
        }
    }
    setXMap() {}
}

var line = new LineGraph();

// 单个折线图时，需要考虑横纵坐标值的类型，如果横坐标或纵坐标中有一个是字符串类型，则设置对应的坐标轴中的
// xAxis和yAxis的type类型为category，并设置boundaryGap为false（表示坐标轴中不存在区间值。），然后在初始画图时对对应坐标轴
// 设置xMap 或 yMap 来映射点的下标和其对应的字符串，然后在对点进行拖动时重新绘图时需要将对应坐标数值转换为字符串。


// 如果横纵坐标值的类型均为字符串，则xAxis和yAxis都设置为category，并设置图形不可拖拽，除此情况之外均可进行拖拽

// 如果为数值类型，则将type设置为value，根据情况设置拖拽范围即xAxis中的min和max属性。


// 多个折线图展示时，横纵坐标类型应该相同。不同时抛出异常

// 多个折线图需要在option中添加多个{},即可，每一个数据需要自行指派。


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
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});

function initLineChart(canvas, width, height, dpr) {
    var lineChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
    });
    line.lineChart = lineChart;

    line.setInputList("sb", [
        ['0', 0],
        ['7', 10],
        ['1', 20],
        ['3', 30],
        ['15', 40]
    ]);
    canvas.setChart(lineChart);

    var option = setOption();
    lineChart.setOption(option);
    lineChart.setOption({
        graphic: echarts.util.map(line.inputList, function (dataItem, dataIndex) {
            console.log(dataIndex);
            var position = lineChart.convertToPixel('grid', dataItem);
            if (line.xType === 'string') {
                line.xMap.push(dataItem[0]);
            }
            if (line.yType === 'string') {
                line.yMap.set(dataIndex, dataItem[1]);
            }
            return {
                type: 'circle',
                position: position,
                shape: {
                    r: line.lineModelPro.radius / 2
                },
                invisible: true,
                draggable: line.draggable,
                ondrag: echarts.util.curry(onPointDragging, dataIndex),
                z: 100,
                //onmousemove: echarts.util.curry(showTooltip, dataIndex),
                //onmouseout: echarts.util.curry(hideTooltip, dataIndex),
            };
        })
    });

    console.log("success");
    return lineChart;
}


function setOption() {
    var series = [];
    for (var i = 0; i < line.inputList.length;) {
        var name = line.pointToName.get(i);
        var tempJson = {
            name: name,
            type: "line",
            smooth: true,
            symbolSize: line.lineModelPro.radius,
            data: line.inputList.slice(line.nameToIndex[name].minIndex, line.nameToIndex[name].maxIndex)
        };
        i = line.nameToIndex[name].maxIndex
        series.push(tempJson);
    }
    var option = {
        // tooltip: {
        //     // 表示不使用默认的『显示』『隐藏』触发规则。
        //     triggerOn: 'none',
        //     formatter: function (params) {
        //         return 'X: ' + params.data[0].toFixed(2) + '\nY: ' + params.data[1].toFixed(2);
        //     }
        // },
        xAxis: {
            type: line.xType === "string" ? 'category' : 'value',
            boundaryGap: !(line.xType === "string"),
            // min: -10,
            // max: 100,
            axisLine: {
                onZero: false
            },
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

function onPointDragging(dataIndex) {
    // 这里的 data 就是本文最初的代码块中声明的 data，在这里会被更新。
    // 这里的 this 就是被拖拽的圆点。this.position 就是圆点当前的位置。
    line.inputList[dataIndex] = line.lineChart.convertFromPixel('grid', this.position);
    if (line.xType === "string" ) {
        line.inputList[dataIndex][0] = line.xMap[dataIndex];
    }
    if (line.yType === "string") {
        line.inputList[dataIndex][1] = line.yMap.get(dataIndex);
    }
    var name = line.pointToName.get(dataIndex);
    setTimeout(function () {
        line.lineChart.setOption({
            series: [{
                name: name,
                data: line.inputList.slice(line.nameToIndex[name].minIndex, line.nameToIndex[name].maxIndex)
            }]
        });
    },5);
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