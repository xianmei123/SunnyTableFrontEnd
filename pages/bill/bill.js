Page({
    data: {
        date: {
            show: false,
            showStart: false,
            showEnd: false,
            menuDateTitle: "日期选择",
            startDateStr: new Date().toLocaleDateString(),
            endDateStr: new Date().toLocaleDateString(),
            startDate: Date.now(),
            endDate: Date.now(),
            currentDate1: Date.now(),
            currentDate2: Date.now(),
            minDate: new Date(2021, 3, 1).getTime(),
        },
        checkboxes: {
            show: false,
            list: ['衣服', '食物', '居住', '交通'],
            result: ['衣服', '食物', '居住', '交通'],
            preResult: ['衣服', '食物', '居住', '交通']
        },
        
        condition: {
            show: false,
            message1: 0,
            message2: 10000,
            minCost: 0,
            maxCost: 10000,
            list: ['收入', '支出'],
            result: ['收入', '支出'],
            preResult: ['收入', '支出']
        },

        newBill: {
            show: false,
        },

        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } 
            if (type === 'month') {
                return `${value}月`;
            }
            //console.log(value)
            return value;
  
        },
    },
    
    onCancel1() {
        this.setData({ 
            'date.showStart': false ,
            'date.show': true,
            'date.currentDate1': this.data.date.startDate
        });
    },

    onCancel2() {
        this.setData({ 
            'date.showEnd': false ,
            'date.show': true,
            'date.currentDate2': this.data.date.endDate
        });
        // console.log(this.data.endDate.toLocaleDateString())
        // console.log(this.data.currentDate2.toLocaleDateString())
    },

    onCancelMenuCondition() {
        this.setData({
            'condition.show': false,
            'condition.message1': this.data.condition.minCost,
            'condition.message2': this.data.condition.maxCost,
            'condition.result': this.data.condition.preResult,
        });
    },

    onCancelMenuDate() {
        this.setData({ 
            'date.show': false
        });
    },

    onCancelCheckBox() {
        this.setData({
            'checkboxes.show': false,
            'condition.show': true,
            'checkboxes.result': this.data.checkboxes.preResult
        });
    },

    onConfirm1(event) {
        //console.log(event.detail)
        var date1 = new Date(event.detail);
        //console.log(date.toLocaleDateString())
        //console.log(this.data.sore)
        this.setData({
            'date.currentDate1': event.detail,
            'date.startDate': date1,
            'date.startDateStr': date1.toLocaleDateString(),
            'date.showStart' : false,
            'date.show' : true
        });
        
    },

    onConfirm2(event) {
        var date1 = new Date(event.detail);
        //console.log(date.toLocaleDateString())
        //console.log(this.data.sore)
        this.setData({
            'date.currentDate2': event.detail,
            'date.endDate': date1,
            'date.endDateStr': date1.toLocaleDateString(),
            'date.showEnd' : false,
            'date.show' : true
        });
    },

    onConfirmMenuCondition(event) {
        //console.log(this.data.message2);
        this.setData({
            'condition.show' : false,
            'condition.maxCost': this.data.condition.message2,
            'condition.minCost': this.data.condition.message1,
            'condition.preResult': this.data.condition.result
        });
        //console.log(this.data.maxCost);
        
    },

    onConfirmMenuDate(event) {

        this.setData({
            'date.show' : false,
  
        });
    },

    onConfirmCheckBox(event) {

        this.setData({
            'condition.show' : true,
            'checkboxes.show' : false,
            'checkboxes.preResult': this.data.checkboxes.result
        });
    },

    onToday1() {
        this.setData({
            'date.currentDate1': Date.now()
        })
    },

    onToday2() {
        this.setData({
            'date.currentDate2': Date.now()
        })
    },

    goAnalyse() {
        wx.navigateTo({
            url: '../analyse/analyse'
        });
    },

    showPopup1() {
        this.setData({ 
            'date.showStart': true ,
            'date.show': false
        });
    },

    showPopup2() {
        this.setData({ 
            'date.showEnd': true ,
            'date.show': false
        });
    },
    
    showPopupMenuCondition() {
        this.setData({ 'condition.show': true });
    },    

    showPopupMenuDate() {
        this.setData({ 'date.show': true });
    },    

    showPopupCheckBox() {
        //let  value = 'list.title';
        this.setData({ 
            'checkboxes.show' : true,
            'condition.show': false
        });
    },
 
    onClose1() {
        this.setData({ 
            'date.showStart': false ,
            'date.show': true,
            'date.currentDate1': this.data.date.startDate
        });
    },

    onClose2() {
        
        this.setData({ 
            'date.showEnd': false ,
            'date.show': true,
            'date.currentDate2': this.data.date.endDate
        });
    },
    
    onCloseMenuCondition() {
        this.setData({
            'condition.show': false,
            'condition.message1': this.data.condition.minCost,
            'condition.message2': this.data.condition.maxCost,
            'condition.result': this.data.condition.preResult,
        });
    },

    onCloseMenuDate() {
        // this.setData({ 'date.show': false });
    },

    onCloseCheckBox() {
        this.setData({
            'checkboxes.show': false,
            'condition.show': true,
            'checkboxes.result': this.data.checkboxes.preResult
        });
    },
    
    onInput1(event) {
        this.setData({
            'date.currentDate1': event.detail,
        });
    },

    onInput2(event) {
        this.setData({
            'date.currentDate2': event.detail,
        });
    },

    onChangeInput1(event) {
        // event.detail 为当前输入的值
        //console.log(event.detail);
        this.setData({
            'condition.message1': event.detail
        });
    },

    onChangeInput2(event) {
        // event.detail 为当前输入的值
        //console.log(event.detail);
        this.setData({
            'condition.message2': event.detail
        });
    },

    queryData(event) {
        
    },
    
    onChangeCheckBox(event) {
        //console.log(event.detail);
        this.setData({
          'checkboxes.result': event.detail
        });
    },

    onChangeIO(event) {
        //console.log(event.detail);
        this.setData({
          'condition.result': event.detail
        });
    },
    
    toggleCheckBox(event) {
        //console.log(event.detail);
        const { index } = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },

    toggleIO(event) {
        //console.log(event.detail);
        const { index } = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.io-${index}`);
        checkbox.toggle();
    },

    noopIO() {},

    noopCheckBox() {}

});
