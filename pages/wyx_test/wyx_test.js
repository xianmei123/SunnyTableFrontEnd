Page({
  data: {
   xName:"",
   xContent:"",
   yName:"",
   yContent:"",
   datas:[[1]],
   xValues:[[]],
   yValues:[[]]
  },

  getXName(event) {
    this.setData({ 
      xName: event.detail
    });
    console.log(event.detail);
  },
  getXContent(event) {
    this.setData({ 
      xContent: event.detail
    });
    console.log(event.detail);
  },
  getYName(event) {
    this.setData({ 
      yName: event.detail
    });
    console.log(event.detail);
  },
  getYContent(event) {
    this.setData({ 
      yContent: event.detail
    });
    console.log(event.detail);
  },
  addData(event) {
    var i = event.target.dataset.a;
    console.log(i);
    var newDatas = this.data.datas;
    var newXValues = this.data.xValues;
    var newYValues = this.data.yValues;
    newDatas[i].push(this.data.datas[i].length + 1);
    newXValues[i].push();
    newYValues[i].push();
    this.setData({
      datas: newDatas,
      xValues: newXValues,
      yValues: newYValues
    })
    console.log(this.data.datas);
    this.onLoad();
  }, 
  addDataGroup: function() {
    var newDatas = this.data.datas;
    var newArray = [1];
    var newXValues = this.data.xValues;
    var newYValues = this.data.yValues;
    newDatas.push(newArray);
    newXValues.push([]);
    newYValues.push([]);
    this.setData({
      datas: newDatas,
      xValues: newXValues,
      yValues: newYValues
    })
    this.onLoad();
  },
  getData: function(event) {
    var groupId = event.target.dataset.a;
    var dataId = event.target.dataset.b;
    var xOry = event.target.dataset.c;
    if (xOry == 0) {
       var newXValues = this.data.xValues;
       newXValues[groupId - 1][dataId - 1] = event.detail;
       console.log(newXValues[groupId - 1][dataId - 1]);
       this.setData({
         xValues: newXValues
       })
    }
    else {
      var newYValues = this.data.yValues;
      newYValues[groupId - 1][dataId - 1] = event.detail;
      console.log(newYValues[groupId - 1][dataId - 1]);
      this.setData({
        yValues: newYValues
      })
    }
  }
});