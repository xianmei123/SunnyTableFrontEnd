var billId = 0;
var id4replace = 0;

function getPage() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}

function getIndex(str) {
    var list = ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房', '工资', '兼职', '理财', '礼金'];
    for (var i = 0; i < list.length; i++) {
        if (str == list[i]) {
            if (i >= 11) {
                return i - 11;
            }
            return i;
        }
    }
}


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
            endDateStr: formatDate(new Date().getTime(), ),
            startDate: Date.now(),
            endDate: Date.now(),
            currentDate1: Date.now(),
            currentDate2: Date.now(),
            minDate: new Date(2021, 3, 1).getTime(),
        },
        checkbox: {
            show: false,
            list1: ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房'],
            list2: ['工资', '兼职', '理财', '礼金'],
            list3: ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房', '工资', '兼职', '理财', '礼金'],
            list: ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房', '工资', '兼职', '理财', '礼金'],
            result: ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房', '工资', '兼职', '理财', '礼金'],
            preResult: ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房', '工资', '兼职', '理财', '礼金'],
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
            modify: false,
            date: {
                show: false,
                date: Date.now(),
                currentDate: Date.now(),
                minDate: new Date(2021, 3, 1).getTime(),
                dateStr: formatDate(new Date().getTime(), ),
            },
            option: [{
                    text: '衣服',
                    value: '衣服'
                },
                {
                    text: '食物',
                    value: '食物'
                },
                {
                    text: '居住',
                    value: '居住'
                },
                {
                    text: '交通',
                    value: '交通'
                },
            ],
            checkbox: {
                show: false,
                list1: ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房'],
                list2: ['工资', '兼职', '理财', '礼金'],
                result: 0, //0,1,2,3对应list
                preResult: 0,
                list: ['娱乐', '餐饮', '购物', '日用', '零食', '果蔬', '交通', '学习', '服饰', '医疗', '住房'],
            },
            messageIO: null,
            messageDetail: null,
            detail: null,
            io: null,
            list: ['收入', '支出'],
            result: 1, //0表示收入，1表示支出
            preResult: 1,
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
        tip: "\nTip:按住说话时，会将输入转换为详细信息、金额和 收入/支出 三部分。\n" + 
        "语音输入建议模板有：1. xxx（例：买了一个苹果），花费/花了xxx元  2. xxx，收入/赚了xxx元，还有更多等待您的探索!",
        billData: [],
        icons: getApp().globalData.icons,
    },

    onClose(event) {
        const {
            position,
            instance
        } = event.detail;
        console.log(event.detail);
        var index = event.target.dataset.a;
        switch (position) {
            case 'left':
            case 'cell':
                instance.close();
                break;
            case 'right':
                wx.showModal({
                    title: '提示',
                    content: '确定要删除吗？',
                    success: (sm) => {
                        if (sm.confirm) {
                            this.deleteBillById(this.data.billData[index]["id"]);
                        } else if (sm.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
        }
    },

    getIndex1() {
        return 0;
    },

    showCostButton() {
        this.setData({
            showCostInput: !this.data.showCostInput
        })
    },
    showDeatilButton() {
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
        const {
            name
        } = event.currentTarget.dataset;
        // console.log("name");
        //console.log(name);
        if (name == 0) {
            this.setData({
                'newBill.result': name,
                'newBill.checkbox.list': this.data.newBill.checkbox.list2,
                'newBill.checkbox.result': 0,
                'newBill.checkbox.peResult': 0,
            });
        } else {
            this.setData({
                'newBill.result': name,
                'newBill.checkbox.list': this.data.newBill.checkbox.list1,
                'newBill.checkbox.result': 0,
                'newBill.checkbox.peResult': 0,
            });
        }

    },

    onChangeBillCheckBox(event) {
        console.log("event.detail");
        console.log(event.detail);
        this.setData({
            'newBill.checkbox.result': event.detail,
        });
    },

    onClickBillCheckBox(event) {
        const {
            name
        } = event.currentTarget.dataset;
        console.log("name");
        console.log(name);
        this.setData({
            'newBill.checkbox.result': name,
        });
    },

    onCancel1() {
        this.setData({
            'date.showStart': false,
            'date.show': true,
            'date.currentDate1': this.data.date.startDate
        });
    },

    onCancel2() {
        this.setData({
            'date.showEnd': false,
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
        });
    },

    onCancelMenuDate() {
        this.setData({
            'date.show': false
        });
    },

    onCancelCheckBox() {
        this.setData({
            'checkbox.show': false,
            'condition.show': true,
            'checkbox.result': this.data.checkbox.preResult
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
            'date.showStart': false,
            'date.show': true
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
            'date.showEnd': false,
            'date.show': true
        });
    },

    onConfirmMenuCondition(event) {
        //console.log(this.data.message2);
        this.setData({
            'condition.show': false,
            'condition.maxCost': this.data.condition.message2,
            'condition.minCost': this.data.condition.message1,
            'condition.preResult': this.data.condition.result
        });
        this.filter()
        //console.log(this.data.maxCost);

    },

    onConfirmMenuDate(event) {
        this.setData({
            'date.show': false,
        });
        this.updateBillDataNotShow();
    },

    onConfirmCheckBox(event) {

        this.setData({
            'condition.show': true,
            'checkbox.show': false,
            'checkbox.preResult': this.data.checkbox.result
        });
    },

    onConfirmBillDate(event) {
        var str = formatDate(event.detail, );
        this.setData({
            'newBill.date.show': false,
            'newBill.show': true,
            'newBill.date.currentDate': event.detail,
            'newBill.date.date': event.detail,
            'newBill.date.dateStr': str
        });

    },

   async saveBill() {
        this.queryBill();
        var url = "https://www.jaripon.xyz/bill/add";

        var data = {};
        data["id"] = billId;
        if (this.data.newBill.modify == true) {
            url = "https://www.jaripon.xyz/bill/replace";
            data["id"] = id4replace;
        }
        console.log(data["id"] + "  " + url);
        data["userId"] = wx.getStorageSync('uid');
        data["detail"] = this.data.newBill["detail"];
        data["time"] = this.data.newBill["date"]["date"];
        data["type"] = this.data.newBill["checkbox"]["list"][this.data.newBill["checkbox"]["result"]];
        data["income"] = this.data.newBill["result"] === 0 ? 'true' : 'false';
        console.log(data["income"]);
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
                    title: '保存账单失败',
                });
                return;
            }
        });
        wx.showToast({
            title: '保存账单成功',
        });
        await this.updateBillDataNotShow();
        //this.updateBillDataNotShow();
    },
    // condition: {
    //     show: false,
    //     message1: 0,
    //     message2: 10000,
    //     minCost: 0,
    //     maxCost: 10000,
    //     list: ['收入', '支出'],
    //     result: ['收入', '支出'],
    //     preResult: ['收入', '支出']
    // },
    filterJudge(bill) {
        let income = (bill["income"] == "true") ? "收入" : "支出";
        console.log(income);
        console.log(this.data.condition["result"]);
        if (this.data.condition["result"].indexOf(income) < 0) {
            return false;
        }
        if (bill["cost"] < this.data.condition["minCost"] || bill["cost"] > this.data.condition["maxCost"]) {
            return false;
        }
        console.log(bill["type"]);
        console.log(this.data.checkbox["result"]);
        if (this.data.checkbox["result"].indexOf(bill["type"]) < 0) {
            return false;
        }
        return true;
    },

    async filter() {
        let data = await this.queryBill();
        if (data != undefined) {
            this.setData({
                billData: data
            })
        }
        let newBillData = [];
        for (let i = 0; i < this.data.billData.length; i++) {
            if (this.filterJudge(this.data.billData[i])) {
                newBillData.push(this.data.billData[i]);
            }
        }
        this.setData({
            billData: newBillData
        })
    },

    onConfirmBillCheckBox(event) {
        this.setData({
            'newBill.checkbox.show': false,
            'newBill.show': true,
            'newBill.checkbox.preResult': this.data.newBill.checkbox.result
        });
    },

    onConfirmBill() {
        this.setData({
            'newBill.show': false,
            'newBill.io': this.data.newBill.messageIO,
            'newBill.detail': this.data.newBill.messageDetail
        });
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

    async goAnalyse() {
        var data = await this.analyse();
        wx.navigateTo({
            url: '../analyse/analyse',
            success: result => {
                result.eventChannel.emit("analyse", data);
            }
        });
    },

    showPopup1() {
        this.setData({
            'date.showStart': true,
            'date.show': false,
            'date.currentDate1': this.data.date.startDate
        });
    },

    showPopup2() {
        this.setData({
            'date.showEnd': true,
            'date.show': false,
            'date.currentDate2': this.data.date.endDate
        });
    },

    showPopupMenuCondition() {
        this.setData({
            'condition.show': true
        });
    },

    showPopupMenuDate() {
        this.setData({
            'date.show': true
        });
    },

    showPopupCheckBox() {
        //let  value = 'list.title';
        this.setData({
            'checkbox.show': true,
            'condition.show': false,
            'checkbox.result': this.data.checkbox.result,
        });
        // console.log(this.data.checkbox.result);
        // console.log(this.data.checkbox.list);
    },

    showPopupBillDate() {
        //let  value = 'list.title';
        this.setData({
            'newBill.show': false,
            'newBill.date.show': true,
            'newBill.date.currentDate': this.data.newBill.date.date
        });
    },

    showPopupBillCheckBox() {
        //let  value = 'list.title';
        this.setData({
            'newBill.show': false,
            'newBill.checkbox.show': true
        });
    },

    onClose1() {
        console.log("d调用");
        // console.log('currb'+this.data.date.currentDate1);
        // console.log('stb'+this.data.date.startDate);
        this.setData({
            'date.showStart': false,
            'date.show': true,
            'date.currentDate1': this.data.date.startDate
        });

        // console.log('sta'+this.data.date.startDate);
        // console.log('curra'+this.data.date.currentDate1);
    },

    onClose2() {
        this.setData({
            'date.showEnd': false,
            'date.show': true,
            'date.currentDate2': this.data.date.endDate
        });
    },

    onCloseMenuCondition() {
        this.setData({
            'condition.show': false,
            'condition.message1': this.data.condition.minCost,
            'condition.message2': this.data.condition.maxCost,
        });
    },

    onCloseMenuDate() {
        // this.setData({ 'date.show': false });
    },

    onCloseCheckBox() {
        this.setData({
            'checkbox.show': false,
            'condition.show': true,
            'checkbox.result': this.data.checkbox.preResult
        });
        // console.log(this.data.checkbox.result);
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
        console.log('chage' + this.data.date.currentDate1);
    },

    onChangeStrat(event) {
        console.log(event.detail.getColumnValue(0) + '-' + event.detail.getColumnValue(1) + '-' + event.detail.getColumnValue(2));
        var dateStr = event.detail.getColumnValue(0) + '-' + event.detail.getColumnValue(1) + '-' + event.detail.getColumnValue(2);
        var year = event.detail.getColumnValue(0).substr(0, 4);
        var month = event.detail.getColumnValue(1).substr(0, 2);
        var day = event.detail.getColumnValue(2).substr(0, 2);
        var dateStr = year + '/' + month + '/' + day;
        console.log(year + '/' + month + '/' + day);
        var date = new Date(year, month - 1, day);
        console.log(date.toLocaleDateString());
        this.setData({
            'date.currentDate1': date.getTime(),

        })
        // var date = new Date()
        // let value=event.detail.getColumnValue(0)+'-'+event.detail.getColumnValue(1)
    },

    onChangeEnd(event) {
        //console.log(event.detail.getColumnValue(0)+'-'+event.detail.getColumnValue(1) + '-' +event.detail.getColumnValue(2));
        var dateStr = event.detail.getColumnValue(0) + '-' + event.detail.getColumnValue(1) + '-' + event.detail.getColumnValue(2);
        var year = event.detail.getColumnValue(0).substr(0, 4);
        var month = event.detail.getColumnValue(1).substr(0, 2);
        var day = event.detail.getColumnValue(2).substr(0, 2);
        var dateStr = year + '/' + month + '/' + day;
        //console.log(year+'/'+month+'/'+day);
        var date = new Date(year, month - 1, day);
        //console.log(date.toLocaleDateString());
        this.setData({
            'date.currentDate2': date.getTime(),

        })
        // var date = new Date()
        // let value=event.detail.getColumnValue(0)+'-'+event.detail.getColumnValue(1)
    },

    onChangeBillDate(event) {
        //console.log(event.detail.getColumnValue(0)+'-'+event.detail.getColumnValue(1) + '-' +event.detail.getColumnValue(2));
        var dateStr = event.detail.getColumnValue(0) + '-' + event.detail.getColumnValue(1) + '-' + event.detail.getColumnValue(2);
        var year = event.detail.getColumnValue(0).substr(0, 4);
        var month = event.detail.getColumnValue(1).substr(0, 2);
        var day = event.detail.getColumnValue(2).substr(0, 2);
        var dateStr = year + '/' + month + '/' + day;
        //console.log(year+'/'+month+'/'+day);
        var date = new Date(year, month - 1, day);
        //console.log(date.toLocaleDateString());
        this.setData({
            'newBill.date.currentDate': date.getTime(),

        })
        // var date = new Date()
        // let value=event.detail.getColumnValue(0)+'-'+event.detail.getColumnValue(1)
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
        console.log(event.detail);
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
    },

    onChangeInputBillIO(event) {
        // event.detail 为当前输入的值
        //console.log(event.detail);
        this.setData({
            'newBill.messageIO': event.detail
        });
    },

    queryBill() {
        var url = "https://www.jaripon.xyz/bill/query/time";
        var data = {
            "userId": wx.getStorageSync('uid'),
            "startTime": this.data.date["startDateStr"].replace("/", "-").replace("/", "-"),
            "endTime": this.data.date["endDateStr"].replace("/", "-").replace("/", "-")
        }
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                data: data,
                method: "POST",
                success: (res) => {
                    console.log(res.data);
                    billId = res.data.length;
                    resolve(res.data);
                },
                fail: function (res) {
                    wx.showToast({
                        icon: 'error',
                        title: '查询失败'
                    })
                }
            });
        })
    },

    async updateBillData() {
        let data = await this.queryBill();
        if (data != undefined) {
            billId = data.length;
            this.setData({
                billData: data
            })
            wx.showToast({
                title: '账单数据已更新',
            })
        }
    },

    async updateBillDataNotShow() {
        let data = await this.queryBill();
        if (data != undefined) {
            billId = data.length;
            this.setData({
                billData: data
            })
        }
    },

    onChangeCheckBox(event) {
        //console.log(event.detail);
        this.setData({
            'checkbox.result': event.detail
        });
    },

    onChangeIO(event) {
        console.log(event.detail);
        var a = event.detail;
        console.log(a.length);
        if (a.length == 2) {
            this.setData({
                'condition.result': event.detail,
                'checkbox.list': this.data.checkbox.list3,
                'checkbox.result': this.data.checkbox.list3,
                'checkbox.preResult': this.data.checkbox.list3,
            });
        } else if (a.length == 1 & a[0] == "收入") {
            this.setData({
                'condition.result': event.detail,
                'checkbox.list': this.data.checkbox.list2,
                'checkbox.result': this.data.checkbox.list2,
                'checkbox.preResult': this.data.checkbox.list2,
            });
        } else if (a.length == 1 & a[0] == "支出") {
            this.setData({
                'condition.result': event.detail,
                'checkbox.list': this.data.checkbox.list1,
                'checkbox.result': this.data.checkbox.list1,
                'checkbox.preResult': this.data.checkbox.list1,
            });
        } else {
            this.setData({
                'condition.result': event.detail,
                'checkbox.list': [],
                'checkbox.result': [],
                'checkbox.preResult': [],

            });
        }
        // console.log(this.data.checkbox.result);
        // console.log(this.data.checkbox.list);
    },

    toggleCheckBox(event) {
        //console.log(event.detail);
        const {
            index
        } = event.currentTarget.dataset;
        //console.log(index);
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },

    toggleIO(event) {
        //console.log(event.detail);
        const {
            index
        } = event.currentTarget.dataset;
        //console.log(index);
        const checkbox = this.selectComponent(`.io-${index}`);
        checkbox.toggle();
    },

    noopIO() {},

    noopCheckBox() {},

    addBill() {
        this.setData({
            'newBill.show': true,
            'newBill.modify': false,
            'newBill.messsageIO': null,
            'newBill.messageDetail': null,
            'newBill.io': null,
            'newBill.detail': null,
            'newBill.checkbox.result': 0,
            'newBill.checkbox.preResult': 0,
            'newBill.result': 1,
            'newBill.preResult': 1,
            'newBill.date.date': Date.now(),
            'newBill.date.currentDate': Date.now(),
            'newBill.date.dateStr': formatDate(new Date().getTime(), ),
        });
    },

    modifyBill(event) {
        var item = event.currentTarget.dataset.item;
        // console.log(item.time);
        // console.log(item.cost);
        var arr = item.time.split("-");
        //console.log(arr);
        var t = arr[1] - 1;
        //console.log(t);
        var oldDate = new Date(arr[0], t, arr[2]);
        //console.log(oldDate.getTime());
        console.log("modify" + item.income);
        var result = 0;
        var list = this.data.newBill.checkbox.list2;
        if (item.income == 'false') {
            result = 1;
            list = this.data.newBill.checkbox.list1;
        }
        console.log("modify" + result);
        var result1 = getIndex(item.type);
        id4replace = item.id;
        console.log(result1);
        this.setData({
            'newBill.show': true,
            'newBill.modify': true,
            'newBill.messageIO': item.cost,
            'newBill.messageDetail': item.detail,
            'newBill.io': item.cost,
            'newBill.detail': item.detail,
            'newBill.date.currentDate': oldDate.getTime(),
            'newBill.date.date': oldDate.getTime(),
            'newBill.date.dateStr': item.time,
            'newBill.checkbox.result': result1,
            'newBill.checkbox.preResult': result1,
            'newBill.result': result,
            'newBill.preResult': result,
            'newBill.checkbox.list': list,
        });
        //console.log(this.data.newBill.io);
    },



    async analyse() {
        let startYear = (this.data.date["startDateStr"].split("/"))[0];
        let endYear = (this.data.date["endDateStr"].split("/"))[0];
        let startMonth = (this.data.date["startDateStr"].split("/"))[1];
        let endMonth = (this.data.date["endDateStr"].split("/"))[1];
        let everyMonth = {
            "in": [],
            "out": []
        };
        var monthList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        let everyDay = [];
        if (startYear == endYear) {
            for (let month = startMonth; month <= endMonth; month++) {
                everyMonth["in"].push([startYear + "-" + monthList[month - 1], 0]);
                everyMonth["out"].push([startYear + "-" + monthList[month - 1], 0])
            }
        } //同一年的情况
        else {
            for (let month = startMonth; month <= 12; month++) {
                everyMonth["in"].push([startYear + "-" + monthList[month - 1], 0]);
                everyMonth["out"].push([startYear + "-" + monthList[month - 1], 0]);
            }
            for (let year = parseInt(startYear) + 1; year < endYear; year++) {
                for (let month = startMonth; month <= endMonth; month++) {
                    everyMonth["in"].push([year + "-" + monthList[month - 1], 0]);
                    everyMonth["out"].push([year + "-" + monthList[month - 1], 0]);
                }
            }
            for (let month = 1; month <= endMonth; month++) {
                everyMonth["in"].push([endYear + "-" + monthList[month - 1], 0]);
                everyMonth["out"].push([endYear + "-" + monthList[month - 1], 0]);
            }
        }
        var data = {
            "userId": wx.getStorageSync('uid'),
            "startTime": this.data.date["startDateStr"].replace("/", "-").replace("/", "-"),
            "endTime": this.data.date["endDateStr"].replace("/", "-").replace("/", "-")
        }
        let ret = await this.queryBill();
        for (var i = 0; i < ret.length; i++) {
            if (ret[i]["time"] >= data["startTime"] && ret[i]["time"] <= data["endTime"]) {
                let inc = ret[i]["income"] == "true" ? true : false;
                let year = (ret[i]["time"].split("-"))[0];
                let mon = (ret[i]["time"].split("-"))[1];
                let cost = ret[i]["cost"];
                let key = inc ? "in" : "out";
                everyMonth[key][12 * (parseInt(year) - parseInt(startYear)) + parseInt(mon) - parseInt(startMonth)][1] += cost;
                everyDay.push({
                    "detail": ret[i]["detail"],
                    "time": ret[i]["time"],
                    "cost": cost,
                    "type": ret[i]["type"],
                    "income": inc
                });
            }
        }
        var analyseData = {
            "month": everyMonth,
            "day": everyDay
        }
        console.log(analyseData);
        return analyseData;
    },

    deleteBillById(bid) {
        var url = "https://www.jaripon.xyz/bill/delete/" + bid;
        wx.request({
            url: url,
            method: "POST",
            success: (res) => {
                wx.showToast({
                    title: '删除成功',
                })
            },
            fail: function (res) {
                wx.showToast({
                    icon: 'error',
                    title: '删除失败'
                })
            }
        });
        this.updateBillDataNotShow();
    },



    onLoad() {
        wx.getRecorderManager().onStop((res) => {
            wx.hideLoading()
            this.setData({
                hasRecord: false,
                showVoiceInputMessage: "按住说话"
            })
            var tempFilePath = res.tempFilePath;
            wx.uploadFile({
                url: 'https://www.jaripon.xyz/asr/result/' + wx.getStorageSync('uid'),
                filePath: tempFilePath,
                name: 'file',
                success: res => {

                    console.log(res);
                    var data = JSON.parse(res.data);
                    console.log(data);
                    if (!"code" in data) {

                        this.setData({
                            "newBill.detail": data.detail,
                            "newBill.cost": data.cost,
                        });
                        if (data.io == 0) {
                            this.setData({
                                'newBill.result': data.io,
                                'newBill.checkbox.list': this.data.newBill.checkbox.list2,
                                'newBill.checkbox.result': 0,
                                'newBill.checkbox.peResult': 0,
                            });
                        } else {
                            this.setData({
                                'newBill.result': data.io,
                                'newBill.checkbox.list': this.data.newBill.checkbox.list1,
                                'newBill.checkbox.result': 0,
                                'newBill.checkbox.peResult': 0,
                            });
                        }
                    } else {
                        wx.showModal({
                            title: "Tip",
                            content: data.message + '请按模板输入',
                            showCancel: false,
                        })
                    }
                },
                fail: res => {
                    console.log("falied")
                    console.log(res);
                }
            });
        });
        this.updateBillDataNotShow();
    }
});