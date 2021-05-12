// pages/showTemplate/showTemplate.js
import * as echarts from '../../ec-canvas/echarts';
import {
    setLegendOption,
    getPage,
    convertFromBackTemplate
} from '../draw/draw';
var inputData = [
    ['product', 'Matcha Latte', 'Milk Tea','Cheese Cocoa'],
    ['2012', 41.1, 86.5, 24.1],
    ['2013', 30.4, 92.1, 24.1],
];

var template = {
    "id": null, //扇形图模版id
    "name": "", //模板名称
    "userId": 123, //用户id
    "radius": '20', //圆半径
    "point": [], //点样式  
    "color": ['red', '#ba55d3'],
    "showDigit": true, //"true" or "false"，是否显示数值，指图中每个点是否标注数值
    "font": 14, //字体大小
    "legendPos": "30%,,,0%,vertical", //图例位置 top bottom left right
    "textColor": "#1e90ff", //字体颜色
    "isVisible": 0,
};
var xType = "string";
var yType = "value";


function initLineChart(canvas, width, height, dpr) {
    var tempChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(tempChart);
    return setLineOption(tempChart);
}

function setLineOption(lineChart) {
    var pageData = getPage().data;
    var series = [];
    for (var i = 1; i < inputData.length; i++) {
        var name = inputData[i][0];
        var tempJson = {
            name: name,
            type: "line",
            seriesLayoutBy: 'row',
            symbolSize: template.radius,
            lineStyle: {
                color: template.color[i - 1],
            }
        };
        series.push(tempJson);
    }
    var option = {
        dataset: {
            source: inputData
        },
        grid: {
            right: '18%',
            top: '16%',
        },
        title: {
            text: pageData.templateName,
            left: "center",
            textStyle: {
                color: template.textColor,
                fontSize: template.font
            }
        },

        xAxis: {
            name: pageData.xName,
            type: xType === "string" ? 'category' : 'value',
            boundaryGap: !(xType === "string"),
            axisLine: {
                onZero: false,
            },
            axisTick: {
                interval: 0
            },
            axisLabel: {
                interval: 0
            }
        },
        yAxis: {
            name: pageData.yName,
            //type: yType === "string" ? 'category' : 'value',
            boundaryGap: !(yType === "string"),
            axisLine: {
                onZero: false
            },
            axisTick: {
                interval: 0
            },
            axisLabel: {
                interval: 0
            }
        },
        series: series
    };
    setLegendOption(option, template.legendPos);
    lineChart.setOption(option); // 
    if (template.showDigit) {
        lineChart.setOption({
            tooltip: {
                triggerOn: 'none',
                formatter: function (params) {
                    var xstr = xType === "string" ? params.data[0] : parseFloat(params.data[0]).toFixed(2);
                    var ystr = yType === "string" ? params.data[1] : parseFloat(params.data[1]).toFixed(2);
                    return 'X: ' +
                        xstr +
                        '\nY: ' +
                        ystr;
                }
                // formatter: function (params) {
                //     console.log(params);
                //     var xstr = xType === "string" ? params[0].data[0] : parseFloat(params[0].data[0]).toFixed(2);
                //     var ystr = yType === "string" ? params[0].data[1] : parseFloat(params[0].data[1]).toFixed(2);
                //     return 'X: ' +
                //         xstr +
                //         '\nY: ' +
                //         ystr;
                // }
            },
        });
    }
    console.log("init LineGraph Success!!");
    return lineChart;
}

function initBarChart(canvas, width, height, dpr) {
    var tempChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(tempChart);
    return setBarOption(tempChart);
}

function setBarOption(barChart) {
    var pageData = getPage().data;
    var series = [];
    for (var i = 1; i < inputData.length; i++) {
        var name = inputData[i][0];
        var tempJson = {
            name: name,
            type: "bar",
            seriesLayoutBy: 'row',
            barWidth: template.width,
            barGap: template.gap,
            color: template.color[i - 1]
        };
        series.push(tempJson);
    }
    var option = {
        dataset: {
            source: inputData
        },
        legend: {

        },
        title: {
            text: pageData.templateName,
            left: "center",
            textStyle: {
                color: template.textColor,
                fontSize: template.font
            }
        },
        xAxis: [{
            name: pageData.xName,
            type: xType === "string" ? 'category' : 'value',
            // axisLine: {
            //     onZero: false
            // }
            axisTick: {
                interval: 0
            },
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: [{
            name: pageData.yName,
            type: yType === "string" ? 'category' : 'value',
            // axisLine: {
            //     onZero: false
            // }
            axisTick: {
                interval: 0
            },
            axisLabel: {
                interval: 0
            }
        }],
        series: series
    };
    //setLegendOption(option, template.legendPos);
    console.log(option);
    barChart.setOption(option);
    if (template.showDigit) {
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
    return barChart;
}

function initPieChart(canvas, width, height, dpr) {
    var tempChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(tempChart);
    return setPieOption(tempChart);
}


function setPieOption() {
    var series = [];
    var tempJson = {
        name: inputData[0][0],
        type: 'pie',
        radius: template.radius,
        avoidLabelOverlap: true,
        data: convertToPieData(inputData[0].slice(1, inputData[0].length))
    };
    series.push(tempJson);
    var option = {
        title: {
            text: getPage().getData('templateName'),
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
                    result = params.name + ": " + params.percent + "%(" + params.value.toFixed(template.precision) + ")";
                } else {
                    result = params.name + ": " + params.value.toFixed(template.precision);
                }
                return result;
            }
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

function initScatterChart(canvas, width, height, dpr) {
    var tempChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(tempChart);
    return setScatterOption(tempChart);
}

function setScatterOption(scatterChart) {
    var pageData = getPage().data;
    var series = [];
    var count = 0;
    for (var i = 1; i < inputData.length; i++) {
        var name = inputData[i][0];
        var tempJson = {
            name: name,
            type: "scatter",
            seriesLayoutBy: 'row',
            symbolSize: template.increase ? function (data, params) {
                return Math.sqrt(data[1]) * 7; // 开方 此函数不能处理负数
            } : 15,
            lineStyle: {
                color: template.color[count],
            }
        };
        series.push(tempJson);
        count++;
    }
    var option = {
        dataset: inputData,
        title: {
            text: pageData.templateName,
            left: 'center',
            textStyle: {
                color: template.textColor,
                fontSize: template.font
            }
        },
        itemStyle: {
            color: template.color[0]
        },
        xAxis: {
            name: pageData.xName,
            type: xType === "string" ? "category" : "value",
            boundaryGap: xType === "string" ? false : true,

        },
        yAxis: {
            name: pageData.yName,
            type: yType === "string" ? "category" : "value",
            boundaryGap: yType === "string" ? false : true
        },
        series: series
    };
    setLegendOption(option, template.legendPos);
    scatterChart.setOption(option);
    if (template.showLine) {
        scatterChart.setOption({
            tooltip: {
                trigger: "axis",
                formatter: function (params) {
                    var xstr = xType === "string" ? params[0].data[0] : parseFloat(params[0].data[0]).toFixed(2);
                    var ystr = yType === "string" ? params[0].data[1] : parseFloat(params[0].data[1]).toFixed(2);
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
                    var xstr = xType === "string" ? params.data[0] : params.data[0].toFixed(2);
                    var ystr = yType === "string" ? params.data[1] : params.data[1].toFixed(2);
                    return 'X: ' +
                        xstr +
                        '\nY: ' +
                        ystr;
                }
            },
        });
    }
    return scatterChart;
}

function convertToPieData(tempData) {
    var resultArr = [];
    var index = xType === "string" ? 1 : 0;
    for (var i in tempData) {
        var tempJson = {};
        tempJson.name = tempData[i][1 - index];
        tempJson.value = tempData[i][index];
        if (this.pieTemplate.color[i] != "") {
            tempJson.itemStyle = {};
            tempJson.itemStyle['color'] = template.color[i];
        }
        resultArr.push(tempJson);
    }
    return resultArr;
}

Page({
    data: {
        templateName: "物理实验模板",
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
        xName: "x",
        yName: "y",
        isShowLine: true,
        isShowBar: false,
        isShowPie: false,
        isShowScatter: false
    },
    //生命周期函数--监听页面加载
    onLoad: function (options) {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('openTemplate', (data) => {
            switch (data.type) {
                case "line":
                    this.setData({
                        isShowLine: true
                    });
                    break;
                case "bar":
                    this.setData({
                        isShowBar: true
                    });
                    break;
                case "pie":
                    this.setData({
                        isShowPie: true
                    });
                    break;
                case "scatter":
                    this.setData({
                        isShowScatter: true
                    });
                    break;
                default:
                    break;
            }
            this.setData({
                templateName: data.name,
                xName: data.xName,
                yName: data.yName,
            });
        });
    },


    //生命周期函数--监听页面初次渲染完成

    onReady: function () {

    },


    //生命周期函数--监听页面显示
    onShow: function () {

    },
});

export function setShowTemplate(showData, showTemplate, showXType, showYType) {
    inputData = showData;
    template = showTemplate,
    xType = showXType;
    yType = showYType;
}