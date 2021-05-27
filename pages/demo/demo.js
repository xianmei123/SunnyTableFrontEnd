Page({
  data: {
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
        bindtap: 'Menu3',
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
    inputTemplateName: "",
    iterator1: [1, 2, 3],
    iterator2: [1, 2, 3],
    datas: [
      ["", ""],
      ["", ""]
    ],
    xValues: [
      "", ""
    ],
    groupName: ["", ""],
    chooseRegion: false, //状态
    firstReady: false,
    groupNum: 2,
    x1: 0, //数据组
    y1: 0, //横坐标
    x2: 0,
    y2: 0,
    currentGezi: "",
    defaultRegion: true, //是否选过
    region: [0, 0],
    pieChartNo: 0
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
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
  },
  bindMenu4() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  onClose() {
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
    this.changeCurrentX(event);
  },
  changeCurrent(event) {
    if (this.data.chooseRegion) {
      return;
    }
    var groupId = event.target.dataset.a;
    var dataId = event.target.dataset.b;
    var newData = this.data.datas;
    this.setData({
      currentGezi: newData[groupId - 1][dataId - 1]
    });
    console.log(this.data.currentGezi);
  },
  changeCurrentGroupName(event) {
    if (this.data.chooseRegion) {
      return;
    }
    var groupId = event.target.dataset.a;
    this.setData({
      currentGezi: this.data.groupName[groupId - 1]
    });

  },
  changeCurrentX(event) {
    if (this.data.chooseRegion) {
      return;
    }
    var dataId = event.target.dataset.a;
    this.setData({
      currentGezi: this.data.xValues[dataId - 1]
    });

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
          firstReady: false,
          chooseRegion: false
        })
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
        console.log([this.data.x1, this.data.y1, this.data.x2, this.data.y2]);
        wx.showToast({
          title: '选中区域成功'
        })
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
    this.changeCurrent(event);
  },
  addDataGroup: function () {
    if (this.data.chooseRegion) {
      return;
    }
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
      chooseRegion: false,
      groupName: newGroupName,
      groupNum: this.data.groupNum + 1
    })

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
    this.changeCurrentGroupName(event);
  },
  addX: function () {
    if (this.data.chooseRegion) {
      return;
    }
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
      xValues: newXValues,
      chooseRegion: false
    })
  },
  delGroup: function () {
    if (this.data.chooseRegion) {
      return;
    }
    var newIterator2 = this.data.iterator2;
    var newDatas = this.data.datas;
    var newGroupName = this.data.groupName;
    if (this.data.defaultRegion) {
      newGroupName.pop();
      newDatas.pop();
    } else {
      newGroupName.splice(this.data.region[0], 1);
      newDatas.splice(this.data.region[0], 1);
    }
    newIterator2.pop();
    this.setData({
      datas: newDatas,
      iterator2: newIterator2,
      chooseRegion: false,
      groupNum: this.data.groupNum - 1
    })
  },
  delX: function () {
    if (this.data.chooseRegion) {
      return;
    }
    var newIterator1 = this.data.iterator1;
    var newXValues = this.data.xValues;
    var newDatas = this.data.datas;
    newIterator1.pop();
    if (this.data.defaultRegion) {
      newXValues.pop();
      for (i = 0; i < newDatas.length; i++) {
        newDatas[i].pop();
      }
    } else {
      newXValues.splice(this.data.region[1], 1);
      var i;
      for (i = 0; i < newDatas.length; i++) {
        newDatas[i].splice(this.data.region[1], 1);
      }
    }
    this.setData({
      iterator1: newIterator1,
      xValues: newXValues,
      chooseRegion: false,
      datas: newDatas
    })

  },
  choose: function () {
    var origin = this.data.chooseRegion;
    this.setData({
      defaultRegion: false,
      chooseRegion: !origin,
      defaultRegion: false
    });

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
});