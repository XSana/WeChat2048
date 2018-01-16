Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled: false
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        var _this = this;
        setTimeout(function () {
            _this.setData({
                disabled: false
            });
        }, 1000);
    },

    onStart: function (e) {
        var size = e.currentTarget.dataset.size;
        this.setData({
            disabled: true
        });
        wx.navigateTo({
            url: '../index/index?size=' + size
        });
    }
})