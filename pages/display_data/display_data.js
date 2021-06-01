Page({
    data: {
        iterator1: [1, 2],
        iterator2: [1, 2],
        datas: [
            [2, 3],
            [4, 5]
        ],
        xValues: [
            1, 2
        ],
        groupName: ["group1", "group2"],
        firstReady: false,
        groupNum: 2
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
    },
    async onLoad() {
        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel) {
            eventChannel.on("openData", res => {
                this.openData(res.data)
            })
        }
    },
    getData: function (event) {
        var groupId = event.target.dataset.a;
        var dataId = event.target.dataset.b;
        var newDatas = this.data.datas;
        newDatas[groupId - 1][dataId - 1] = event.detail;
        this.setData({
            datas: newDatas,
        });
    },

    addDataGroup: function () {
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
        this.onLoad();
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
    setGroupName: function (event) {
        var index = event.target.dataset.a;
        var newGroupName = this.data.groupName;
        newGroupName[index - 1] = event.detail;
        console.log(newGroupName[index - 1]);
        this.setData({
            groupName: newGroupName
        })
    },
    addX: function () {
        var newIterator1 = this.data.iterator1;
        var newXValues = this.data.xValues;
        newIterator1.push(newIterator1.length + 1);
        newXValues.push(newXValues.length + 1);
        this.setData({
            iterator1: newIterator1,
            xValues: newXValues
        })
        this.onLoad();
    },
    delGroup: function () {
        var newIterator2 = this.data.iterator2;
        var newDatas = this.data.datas;
        var newGroupName = this.data.groupName;
        newGroupName.pop();
        newDatas.pop();
        newIterator2.pop();
        this.setData({
            datas: newDatas,
            iterator2: newIterator2,
            groupNum: this.data.groupNum - 1
        })
        this.onLoad();
    },
    delX: function () {
        var newIterator1 = this.data.iterator1;
        var newXValues = this.data.xValues;
        var newDatas = this.data.datas;
        newIterator1.pop();
        newXValues.pop();
        var i;
        for (i = 0; i < newDatas.length; i++) {
            newDatas[i].pop();
        }
        this.setData({
            iterator1: newIterator1,
            xValues: newXValues,
            datas: newDatas
        })
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
    openData: function (data) {
        var newGroupName = [];
        var newDatas = [];
        var dataArray = data["dataArray"];
        var i;
        for (i = 0; i < dataArray.length; i++) {
            newGroupName.push(dataArray[i]["name"]);
            newDatas.push(dataArray[i]["lineData"]);
        }
        this.setData({
            datas: newDatas,
            groupName: newGroupName
        })
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
    }
});