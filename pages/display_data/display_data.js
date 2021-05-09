Page({
  data: {
      iterator1: [1, 2],
      iterator2: [1, 2],
      datas: [
          [2, 3],
          [4, 5]
      ],
      xValues: [
          1,2
      ],
      groupName: ["group1", "group2"],
      chooseRegion: false,
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
  async onLoad(){
    const eventChannel = this.getOpenerEventChannel()
    if(eventChannel){
        eventChannel.on("openData",res=>{
            this.openData(res.data)
        })
    }
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
  openData: function (data) {
    var newGroupName = [];
    var newDatas = [];
    var dataArray = data[dataArray];
    var i;
    for (i = 0; i < dataArray.length; i++) {
        newGroupName.push(dataArray[i]["name"]);
        newDatas.push(dataArray[i]["lineData"]);
    }
    console.log('newDatas',newDatas)
    this.setData({
        datas: newDatas,
        groupName: newGroupName
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
  convertPaintData: function() {          //转化所需数据
      var ret = {};
      var i;
      var j;
      if (this.data.x1 > this.data.x2) {
          var tmp = this.data.x1;
          this.setData( {
              x1: this.data.x2
          });
          this.setData( {
              x2: tmp
          });
      }
      if (this.data.y1 > this.data.y2) {
          var tmp = this.data.y1;
          this.setData( {
              y1: this.data.y2
          });
          this.setData( {
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
              pie.init([inputData.keys(), inputData.values()], this.judgeXType(), this.judgeYType());
              break;
          case "scatter":
              updateScatterData(inputData);
              break;
      }
  },
  async storeData() {
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