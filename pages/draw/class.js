import {
    inputData,
    getSingleData
} from './draw'
export class LineGraph {
    lineChart = null;
    count = 0;
    title = "默认标题";
    inputList = []; // 输入数据 坐标列表 
    indexToName = []; // <index, name>
    nameToIndex = {};

    xMap = new Map(); // <data.index, data.index.x> // data中每一个数组在data中下标-> 该下标对应的两个元素的x坐标
    yMap = new Map(); // 同上。

    xType = "string"; // 暂定于为 两个值 'string' 和 'number', xAxis 和 yAxix 中的 boundaryGap、type均以此变量决定。
    yType = "number"; // 暂定于上面两个值。

    draggable = !(this.xType === 'string' && this.yType === 'string');

    lineTemplate = {
        "id": null, //扇形图模版id
        "name": "", //模板名称
        "userId": 123, //用户id
        "radius": 20, //圆半径
        "point": [], //点样式  
        "color": ['red', '#ba55d3'],
        "showDigit": true, //"true" or "false"，是否显示数值，指图中每个点是否标注数值
        "font": 14, //字体大小
        "legendPos": "30%,,,0%,vertical", //图例位置 top bottom left right
        "textColor": "#1e90ff", //字体颜色
        "isVisible": 0,
    };

    constructor() {
        console.log("lingraph!!");
    }

    setLineTemplate(template) {
        // 直接更换模板
        this.lineTemplate = template;
    }

    updateLineTemplate(key, value) {
        // 对模板修改时调用的方法
        this.lineTemplate[key] = value;
    }

    setInputList(inputData) {
        this.nameToIndex = {};
        this.indexToName = [];
        this.inputList = [];
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

    init(inputData, xType, yType) {
        this.setInputList(inputData);
        this.xType = xType;
        this.yType = yType;
        this.xMap.clear();
        this.yMap.clear();
    }


    convertToSend() {
        var kk = {
            'dataArray': [{
                'name': "lsp",
                'cid': null,
                'lineData':[[]]
            }]
        }
        var dataArray = [];
        var tempJson = {};
        tempJson.name = 'xlabel';
        tempJson.cid = null;
        tempJson.lineData =  getSingleData(this.inputList.slice(this.nameToIndex[this.indexToName[0]].minIndex, this.nameToIndex[this.indexToName[0]].maxIndex), 0);
        dataArray.push(tempJson);
        for (var i = 0; i < this.inputList.length;) {
            var name = this.indexToName[i];
            var tempArr = getSingleData(this.inputList.slice(this.nameToIndex[name].minIndex, this.nameToIndex[name].maxIndex), 1);
            tempJson = {};
            tempJson.name = name;
            tempJson.cid = null;
            tempJson.lineData = tempArr;
            dataArray.push(tempJson);
            i = this.nameToIndex[name].maxIndex;
        }
        console.log(dataArray);
        return dataArray;
    }

    updateInputData(dataIndex, updateData) {
        var name = this.indexToName[dataIndex];
        var length = this.nameToIndex[name].maxIndex - this.nameToIndex[name].minIndex;
        var tempIndex = (dataIndex + 1) % length === 0 ? length : (dataIndex + 1) % length;
        inputData[name][tempIndex - 1] = updateData;
    }
}

export class BarGraph {
    barChart = null;
    count = 0;
    title = "柱状图默认标题";
    inputList = []; // 输入数据 坐标列表 
    indexToName = []; // <index, name>
    nameToIndex = {};

    xMap = new Map(); // <data.index, data.index.x> // data中每一个数组在data中下标-> 该下标对应的两个元素的x坐标
    yMap = new Map(); // 同上。

    xType = "string"; // 暂定于为 两个值 'string' 和 'number', xAxis 和 yAxix 中的 boundaryGap、type均以此变量决定。
    yType = "number"; // 暂定于上面两个值。

    draggable = !(this.xType === 'string' && this.yType === 'string');

    barTemplate = {
        "id": 5, //扇形图模版id
        "name": "lsp", //模板名称
        "userId": 123, //用户id
        "width": "25%", //条宽度
        "gap": '0%', //条间隔
        "color": ['red', '#ba55d3'],
        "showDigit": true, //"true" or "false"，是否显示数值，指图中每个点是否标注数值
        "transpose": 1,
        "font": 14, //字体大小
        "legendPos": "30%,,,0%,vertical", //图例位置
        "textColor": "#1e90ff", //字体颜色
        "isVisible": 0
    };

    setBarTemplate(template) {
        // 直接更换模板
        this.barTemplate = template;
    }

    updateBarTemplate(key, value) {
        // 对模板修改时调用的方法
        this.barTemplate[key] = value;
    }
    constructor() {}
    setInputList(inputData) {
        this.count = 0;
        this.inputList = [];
        this.nameToIndex = {};
        this.indexToName = [];
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

    init(inputData, xType, yType) {
        this.setInputList(inputData);
        this.xType = xType;
        this.yType = yType;
        this.xMap.clear();
        this.yMap.clear();
    }

    updateInputData(dataIndex, updateData) {
        var name = this.indexToName[dataIndex];
        var length = this.nameToIndex[name].maxIndex - this.nameToIndex[name].minIndex;
        var tempIndex = (dataIndex + 1) % length === 0 ? length : (dataIndex + 1) % length;
        inputData[name][tempIndex - 1] = updateData;
    }

}

export class PieGraph {
    pieChart = null;
    name; // 由于暂时只允许在扇形图上一次性展示一个图，在有组数据时，需要首先进行选择并调用setInputData方法来进行设置PieGraph的对象中的数据
    pieData;
    xType;
    yType;
    constructor() {}

    pieTemplate = {
        "id": 123,
        "name": "lsp",
        "userId": "lsp",
        "radius": "50%",
        "precision": 2,
        "color": ['red', "purple", "", "", ""], //默认为每一个数据组指定颜色，如果使用默认则其值为""
        "showLabel": true,
        "showPercent": 1,
        "titleFont": 20,
        "labelFont": 10,
        "legendPos": "30%,,,0%,vertical", 
        "textColor": "red",
        "isVisible": 0,
    };

    setPieTemplate(template) {
        // 直接更换模板
        this.pieTemplate = template;
    }

    updatePieTemplate(key, value) {
        // 对模板修改时调用的方法
        this.pieTemplate[key] = value;
    }

    convertToPieData(tempData) {
        var resultArr = [];
        var index = xType === "string" ? 1 : 0;
        for (var i in tempData) {
            var tempJson = {};
            tempJson.name = tempData[i][1 - index];
            tempJson.value = tempData[i][index];
            if (this.pieTemplate.color[i] != "") {
                tempJson.itemStyle = {};
                tempJson.itemStyle['color'] = this.pieTemplate.color[i];
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
        return true;
    }
}

export class ScatterGraph {
    scatterChart = null;
    constructor() {

    }
    xType = "string";
    yType = "value";
    inputList = []; // 输入数据 坐标列表 
    indexToName = []; // <index, name>
    nameToIndex = {};

    xMap = new Map(); // <data.index, data.index.x> // data中每一个数组在data中下标-> 该下标对应的两个元素的x坐标
    yMap = new Map(); // 同上。

    draggable = !(this.xType === 'string' && this.yType === 'string');
    scatterTemplate = {
        "id": 123,
        "name": "lsp",
        "userId": 123,
        "point": [],
        "color": ["blue"],
        "showLine": true,
        "showDigit": true,
        "increase": false, // 点大小是否会随着数值变化而变化，
        "font": 12,
        "legendPos": "30%,,,0%,vertical", 
        "textColor": "blue"
    }
    setScatterTemplate(template) {
        // 直接更换模板
        this.scatterTemplate = template;
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
    init(inputData, xType, yType) {
        this.setInputList(inputData);
        this.xType = xType;
        this.yType = yType;
        this.xMap.clear();
        this.yMap.clear();
    }
    updateInputData(dataIndex, updateData) {
        var name = this.indexToName[dataIndex];
        var length = this.nameToIndex[name].maxIndex - this.nameToIndex[name].minIndex;
        var tempIndex = (dataIndex + 1) % length === 0 ? length : (dataIndex + 1) % length;
        inputData[name][tempIndex - 1] = updateData;
    }
}