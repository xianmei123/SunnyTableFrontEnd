Page({
  data: {
    iterator1:[1,2],
    iterator2:[1,2],
    datas:[[1,2], [1,2]],
    xValues:[[]],
    chooseRegion: false,
    firstReady: false,
    groupNum: 2,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  },
  getData: function(event) {
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
      datas:newDatas,
      chooseRegion: false
    });
  },
  addDataGroup: function() {
    if (this.data.chooseRegion) {
      return;
    }
    var newIterator2 = this.data.iterator2;
    var newDatas = this.data.datas;
    var newXValues = this.data.xValues;
    newXValues.push([]);
    newDatas.push([]);
    newIterator2.push(newIterator2.length + 1);
    this.setData({
      datas: newDatas,
      xValues: newXValues,
      iterator2: newIterator2,
      chooseRegion: false,
      groupNum: this.data.groupNum + 1
    })
    this.onLoad();
  },
  addX: function() {
    if (this.data.chooseRegion) {
      return;
    }
    var newIterator1 = this.data.iterator1;
    newIterator1.push(newIterator1.size + 1);
    this.setData({
      iterator1: newIterator1,
      chooseRegion: false
    })
    this.onLoad();
  },
  delGroup: function() {
    if (this.data.chooseRegion) {
      return;
    }
    var newIterator2 = this.data.iterator2;
    var newDatas = this.data.datas;
    var newXValues = this.data.xValues;
    newXValues.pop();
    newDatas.pop();
    newIterator2.pop();
    this.setData({
      datas: newDatas,
      xValues: newXValues,
      iterator2: newIterator2, 
      chooseRegion: false,
      groupNum: this.data.groupNum - 1
    })
    this.onLoad();
  },
  delX: function() {
    if (this.data.chooseRegion) {
      return;
    }
    var newIterator1 = this.data.iterator1;
    newIterator1.pop();
    this.setData({
      iterator1: newIterator1,
      chooseRegion: false
    })
    this.onLoad();
  }, 
  choose: function() {
    var origin = this.data.chooseRegion;
    this.setData({
      chooseRegion: !origin
    });
    console.log("hhh");
    this.onLoad();
  },
  giveData: function(givenData) {
    this.setData({
      datas: givenData
    })
    this.onLoad();
  }
})