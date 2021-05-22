class Graph {
    graphType;
    chart;
    count = 0;
    title = "默认标题";
    // inputList = []; // 输入数据 坐标列表 
    // indexToName = []; // <index, name>
    // nameToIndex = {};
    xType = "string"; // 暂定于为 两个值 'string' 和 'number', xAxis 和 yAxix 中的 boundaryGap、type均以此变量决定。
    yType = "number"; // 暂定于上面两个值。
    template;
    draggable = !(this.xType === 'string' && this.yType === 'string');
    constructor(type){
        this.graphType = type;
    }
    setTemplate(template) {
        this.template = template;
    }
    init(xType, yType) {
        this.xType = xType;
        this.yType = yType;
    }
}

class LineGraph extends Graph {
    constructor(type) {
        super(type);
    }
    updateLineTemplate(key, value) {
        // 对模板修改时调用的方法
        this.lineTemplate[key] = value;
    }

}

class BarGraph extends Graph{
    updateBarTemplate(key, value) { 
        // 对模板修改时调用的方法
        this.barTemplate[key] = value;
    }
    constructor(type) {
        super(type);
        
    }
}

class PieGraph extends Graph{
    pieChart = null;
    name; // 由于暂时只允许在扇形图上一次性展示一个图，在有组数据时，需要首先进行选择并调用setInputData方法来进行设置PieGraph的对象中的数据
    pieData;
    constructor(type) {
        super(type);
        
    }
    updatePieTemplate(key, value) {
        // 对模板修改时调用的方法
        this.pieTemplate[key] = value;
    }

    convertToPieData(tempData) {
        console.log(this.template);
        var resultArr = [];
        var index = this.xType === "string" ? 0 : 1;
        for (var i in tempData) {
            var tempJson = {};
            tempJson.name = tempData[i][index];
            tempJson.value = tempData[i][1 - index];
            if (this.template.color[i] != "") {
                tempJson.itemStyle = {};
                tempJson.itemStyle['color'] = this.template.color[i];
            }
            resultArr.push(tempJson);
        }
        return resultArr;
    }
    setInpuData(name, data) {
        var index = this.xType === "number" ? 0 : 1;
        for (var i in data) {
            if (data[i][index] < 0) {
                return false;
            }
        }
        this.name = name;
        this.pieData = data;
        if (data.length == 0) {
            return false;
        } else {
            return true;
        }

    }
}

class ScatterGraph extends Graph{
    constructor(type) {
        super(type);
    }
    updateScatterTemplate(key, value) {
        // 对模板修改时调用的方法
        this.scatterTemplate[key] = value;
    }
    setInputList(inputData) {
        this.count = 0;
        this.inputList = [];
        this.indexToName = [];
        this.nameToIndex = {};
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
        }
    }
}

function getSingleData(tempData, index) {
    var result = [];
    for (var i = 0; i < tempData.length; i++) {
        result.push(tempData[i][index]);
    }
    return result;
}

module.exports.Graph = Graph;
module.exports.LineGraph = LineGraph;
module.exports.BarGraph = BarGraph;
module.exports.PieGraph = PieGraph;
module.exports.ScatterGraph = ScatterGraph;