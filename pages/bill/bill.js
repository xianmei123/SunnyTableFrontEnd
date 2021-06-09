var billId = 0;

function formatDate(time, format = 'YY/MM/DD') {
    //format = 'YY-MM-DD'
    var date = new Date(time);
    var year = date.getFullYear(),
        month = date.getMonth() + 1, //月份是从0开始的
        day = date.getDate();
    var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index;
    }); //开个长度为10的数组 格式为 ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"]

    var newTime = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
    console.log(newTime);
    return newTime;
}


Page({
    data: {
        date: {
            show: false,
            showStart: false,
            showEnd: false,
            menuDateTitle: "日期选择",
            startDateStr: formatDate(new Date().getTime(), ),
            endDateStr:  formatDate(new Date().getTime(), ),
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
            date: {
                show: false,
                date: Date.now(),
                currentDate: Date.now(),
                minDate: new Date(2021, 3, 1).getTime(),
                dateStr: formatDate(new Date().getTime(), ),
            },
            option: [
                { text: '衣服', value: '衣服' },
                { text: '食物', value: '食物' },
                { text: '居住', value: '居住' },
                { text: '交通', value: '交通' },
            ],
            checkbox: {
                show: false,
                list: ['衣服', '食物', '居住', '交通'],
                result: 1, //0,1,2,3对应list
                preResult: 1
            },
            messageIO: null,
            messageDetail: null,
            detail: null,
            io: null,
            list: ['收入', '支出'],
            result: 1, //0表示收入，1表示支出
            preResult: 1
        },
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            }
            if (type === 'month') {
                return `${value}月`;
            }
            return value;
        },
        showCostInput: true,
        showDetailInput: true,
        showVoiceInputMessage: "按住说话",
        tip: "\ntip:按住说话时，会将输入转换为详细信息和金额两部分"
    },

    showCostButton() {
        this.setData({
            showCostInput: !this.data.showCostInput
        })
    },
    showDeatilButton(){
        this.setData({
            showDetailInput: !this.data.showDetailInput
        })
    },
    touchStart() {
        this.setData({
            showVoiceInputMessage: "松开结束"
        })
        wx.showLoading({
            title: '录音中'
        });
        const options = {
            duration: 60000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 192000,
            format: 'mp3',
            // frameSize: 50
        }
        wx.getRecorderManager().start(options)
    },
    touchEnd() {
        wx.hideLoading()
		wx.getRecorderManager().stop()
		console.log('结束录音')
    },
    onChangeBillIO(event) {
        // console.log("event.detail");
        // console.log(event.detail);
        this.setData({
          'newBill.result': event.detail,
        });
      },
    
    onClickBillIO(event) {
        const { name } = event.currentTarget.dataset;
        // console.log("name");
        // console.log(name);
        this.setData({
            'newBill.result': name,
        });
    },

    onChangeBillCheckBox(event) {
        console.log("event.detail");
        console.log(event.detail);
        this.setData({
          'newBill.checkbox.result': event.detail,
        });
      },
    
    onClickBillCheckBox(event) {
        const { name } = event.currentTarget.dataset;
        console.log("name");
        console.log(name);
        this.setData({
            'newBill.checkbox.result': name,
        });
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

    onCancelBillDate() {
        this.setData({
            'newBill.show': true,
            'newBill.date.show': false,
            'newBill.date.currentDate': this.data.newBill.date.date
        });
    },

    onCancelBillCheckBox() {
        this.setData({
            'newBill.show': true,
            'newBill.checkbox.show': false,
            'newBill.checkbox.result': this.data.newBill.checkbox.preResult
        });
     
    },

    onCancelBill() {
        this.setData({
            'newBill.show': false,
        });
    },

    onConfirm1(event) {
        //console.log(event.detail)
        var str = formatDate(event.detail, );
        var date1 = new Date(event.detail);
        //console.log(date.toLocaleDateString())
        //console.log(this.data.sore)
        this.setData({
            'date.currentDate1': event.detail,
            'date.startDate': event.detail,
            'date.startDateStr': str,
            'date.showStart' : false,
            'date.show' : true
        });
        
    },

    onConfirm2(event) {
        var str = formatDate(event.detail, );
        var date1 = new Date(event.detail);
        //console.log(date.toLocaleDateString())
        //console.log(this.data.sore)
        this.setData({
            'date.currentDate2': event.detail,
            'date.endDate': event.detail,
            'date.endDateStr': str,
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

    onConfirmBillDate(event) {
        var str = formatDate(event.detail, );
        this.setData({
            'newBill.date.show' : false,
            'newBill.show' : true,
            'newBill.date.currentDate': event.detail,
            'newBill.date.date': event.detail,
            'newBill.date.dateStr': str
        });
    },

    saveBill() {
        var url = "https://www.jaripon.xyz/bill/add";
        var data = {};
        data["id"] = billId;
        data["userId"] = wx.getStorageSync('uid');;
        data["detail"] = this.data.newBill["detail"];
        data["time"] = this.data.newBill["date"]["date"];
        data["type"] = this.data.newBill["checkbox"]["list"][this.data.newBill["checkbox"]["result"]];
        data["income"] = this.data.newBill["list"] === "收入" ? true : false; 
        data["cost"] = this.data.newBill["io"];
        console.log(data);
        wx.request({
            url: url,
            data: data,
            method: "POST",
            success: function (res) {
                console.log(res);
            },
            fail: function (res) {
                console.log("fail");
                wx.showToast({
                    title: '新建账单失败',
                });
                return;
            }
        });
        wx.showToast({
            title: '新建账单成功',
        });
        billId++;
    },

    onConfirmBillCheckBox(event) {
        this.setData({
            'newBill.checkbox.show' : false,
            'newBill.show' : true,
            'newBill.checkbox.preResult': this.data.newBill.checkbox.result
        });
    },

    onConfirmBill() {
        this.setData({
            'newBill.show' : false,
            'newBill.io' : this.data.newBill.messageIO,
            'newBill.detail' : this.data.newBill.messageDetail
        });
        // console.log(this.data.newBill.detail);
        // console.log(this.data.newBill.io);
        // console.log(this.data.newBill.date.str);
        // console.log(this.data.newBill.result);
        // console.log(this.data.newBill.checkbox.result);
        this.saveBill();
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

    onTodayBillDate() {
        this.setData({
            'newBill.date.currentDate': Date.now()
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

    showPopupBillDate() {
        //let  value = 'list.title';
        this.setData({ 
            'newBill.show' : false,
            'newBill.date.show': true
        });
    },

    showPopupBillCheckBox() {
        //let  value = 'list.title';
        this.setData({ 
            'newBill.show' : false,
            'newBill.checkbox.show': true
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

    onCloseBillDate() {
        this.setData({
            'newBill.show': true,
            'newBill.date.show': false,
            'newBill.date.currentDate': this.data.newBill.date.date
        });
        //console.log(this.data.newBill.date.date);
        //console.log(this.data.newBill.date.currentDate);
    },

    onCloseBillCheckBox() {
        this.setData({
            'newBill.show': true,
            'newBill.checkbox.show': false,
            'newBill.checkbox.result': this.data.newBill.checkbox.preResult
        });
        //console.log(this.data.newBill.date.date);
        //console.log(this.data.newBill.date.currentDate);
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

    onInputBillDate(event) {
        this.setData({
            'newBill.date.currentDate': event.detail,
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

    onChangeInputBillDetail(event) {
        // event.detail 为当前输入的值
        //console.log(event.detail);
        this.setData({
            'newBill.messageDetail': event.detail
        });
        //console.log(this.data.newBill.messageDetail);
    },

    onChangeInputBillIO(event) {
        // event.detail 为当前输入的值
        //console.log(event.detail);
        this.setData({
            'newBill.messageIO': event.detail
        });
        //console.log(this.data.newBill.messageIO);
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

    noopCheckBox() {},

    addBill() {
        this.setData({
            'newBill.show': true,
        });
    },
    onLoad(){

        wx.getRecorderManager().onStop((res) => {
			wx.hideLoading()
			this.setData({
				hasRecord: false,
                showVoiceInputMessage: "按住说话"
			})
            console.log(res);
			var tempFilePath = res.tempFilePath;
            wx.uploadFile({
                url: 'https://www.jaripon.xyz/asr/result/' + wx.getStorageSync('uid'),
                filePath: tempFilePath,
                name: 'file',
                success: res => {
                    console.log(res);
                    this.setData({
                        "newBill.detail": res.data.detail,
                        "newBill.cost": res.data.cost
                    });
                },
                fail: res => {
                    console.log("falied")
                    console.log(res);
                }
            });
		});
    }
});
