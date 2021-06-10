// pages/analyse/analyse.js
import * as echarts from '../../ec-canvas/echarts';

var graph = require('../draw/class');
var bar = new graph.BarGraph("bar");
var pie = new graph.PieGraph("pie");
var allBill;
var monthSumBill = {
    "in": [],
    "out": [],
};
var monthAllBill = {
    "in": {},
    "out": {},
};
var allMoneyIn = 0;
var allMoneyOut = 0;
var barClicked;
var inputData;

function initData() {
    monthSumBill.in.unshift(["product", "账单"]);
    monthSumBill.out.unshift(["product", "账单"]);
    inputData = monthSumBill.out;
   
    console.log(inputData);
    var monthin = {
        "yuefen": {
            "zhifubao": [{}, {}, {}]
        }
    }
    allMoneyIn = 0;
    allMoneyOut = 0;
    for (var bill of allBill) {
        console.log(bill);
        
        var month = bill.time.slice(0, bill.time.lastIndexOf("-"))
        if (bill.income) {
            allMoneyIn += bill.cost;
            if (month in monthAllBill.in) {
                if (bill.type in monthAllBill.in[month]) {
                    monthAllBill.in[month][bill.type].push(bill);
                } else {
                    monthAllBill.in[month][bill.type] = [bill];
                }
            } else {
                monthAllBill.in[month] = {};
                monthAllBill.in[month][bill.type] = [bill];
            }
        } else {
            allMoneyOut += bill.cost;
            if (month in monthAllBill.out) {
                if (bill.type in monthAllBill.out[month]) {
                    monthAllBill.out[month][bill.type].push(bill);
                } else {
                    monthAllBill.out[month][bill.type] = [bill];
                }
            } else {
                monthAllBill.out[month] = {};
                monthAllBill.out[month][bill.type] = [bill];
            }
        }

    }
    console.log(monthAllBill);
    getPage().setData({
        allMoney: allMoneyOut
    });
}

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
    console.log("success InitBar");
    return barChart;
}

function setBarOption() {
    console.log(inputData);
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
                start: inputData.length < 8 ? 0 : 50 
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
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        series: [{
            type: 'bar',
            barWidth: "50%",
            barMinHeight: 10,
        }],

    };
    return option;
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
    pie.chart.on('click', res => {
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
                position: 'center'
            },
            labelLine: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    formatter: function (params) {
                        return params.name + "\n" + params.value + "(" + parseFloat(params.percent).toFixed(1) + ")%";
                    }
                }
            },
        }],
    };
    return option;
}

function clickBar(param) {
    barClicked = param.name;
    pie.setInpuData(param.name, getMonthData(param.name));
    pie.chart.setOption(setPieOption());
}

/**
 * TODO
 * 得到一个柱子对应的这个月的数据，并对这个月的账单信息进行分类汇总，
 * 并处理为data类型的数据，便于画饼状图
 * @param {string} value 此string代表点击的第几个柱子的横坐标，柱子从0开始 
 * @returns data是一个数组，类似[["a", 1], ["b", 2], ["c", 3]]
 */
function getMonthData(value) {
    var index = getPage().data.pattern === 0 ? "out" : "in";
    var sum = [];
    for (var type in monthAllBill[index][value]) {
        var temp = 0;
        for (var bill of monthAllBill[index][value][type]) {
            temp += parseFloat(bill.cost);
        }
        sum.push([type, temp]);
    }
    return sum;
}

/**
 * TODO
 * 此方法应该可以在点击一类花费之后，显示此类花费在此月中的全部账单信息，方便进行账单的列表展示。
 * 使用此方法来展示条目。
 * @param {JSON} param 点击之后传进来的参数 
 */
function clickPie(param) {
    var index = getPage().data.pattern === 0 ? "out" : "in";
    getPage().setData({
        billTitle: param.name,
        showBillData: monthAllBill[index][barClicked][param.name]
    });
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

Page({
    data: {
        barChart: {
            onInit: initBarChart
        },
        pieChart: {
            onInit: initPieChart
        },
        showBillData: [],
        allMoney: 0,
        currentDate: new Date().getTime(),
        minDate: new Date().getTime(),
        pattern: 0, //
        buttonText: "支出",
        billTitle: '',
        showDatePicker: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on("analyse", data => {
            console.log(data);
            allBill = data.day;
            monthSumBill = data.month;
            initData();
        })

    },
    clickCell() {
        this.setData({
            showDatePicker: true
        })
    },
    clickButton() {
        this.setData({
            pattern: 1 - this.data.pattern,
        });
        this.setData({
            buttonText: this.data.pattern === 0 ? '支出' : '收入',
            allMoney: this.data.pattern === 0 ? allMoneyOut : allMoneyIn,
        });
        
        inputData = this.data.pattern === 0 ? monthSumBill.out : monthSumBill.in;
<<<<<<< HEAD

        setBarOption();
        this.data.pieChart = null;
        pie.chart = null;
=======
        
        bar.chart.setOption(setBarOption());
       
        pie.setInpuData("", []);
        pie.chart.setOption(setPieOption());
>>>>>>> fabbdbb3a6b0c8b0249e061d45147b4692d1ff3f
        console.log();
    },
    onCloseDatePicker() {
        this.setData({
            showDatePicker: false
        });
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        monthAllBill = {
            "in": {},
            "out": {},
        };
    },
})
function getPage() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}