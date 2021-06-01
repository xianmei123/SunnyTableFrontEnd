Page({
    data: {
        show: false,
        sore: false,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date().toLocaleDateString(),
        currentDate: null,
        minDate: new Date(2021, 3, 1).getTime(),
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
    
    onCancel() {
        this.setData({ show: false });
    },

    onConfirm(event) {
        var date = new Date(event.detail);
        //console.log(date.toLocaleDateString())
        //console.log(this.data.sore)
        if (this.data.sore) {
            //console.log("true")
            this.setData({
                currentDate: event.detail,
                endDate: date.toLocaleDateString(),
                show : false,
            });
        }
        else {
           // console.log("false")
            this.setData({
                currentDate: event.detail,
                startDate: date.toLocaleDateString(),
                show : false,
            });
        }
        
    },
    goAnalyse() {
        wx.navigateTo({
            url: '../analyse/analyse'
        });
    },

    showPopup1() {
        this.setData({ show: true, sore : false });
    },

    showPopup2() {
        this.setData({ show: true, sore : true });
    },
    
    onClose() {
        this.setData({ show: false });
    },
    
    onDisplay() {
        this.setData({ show: true });
    },
    onClose() {
        this.setData({ show: false });
    },
    
    onInput(event) {
        this.setData({
            currentDate: event.detail,
        });
    },

    
});
