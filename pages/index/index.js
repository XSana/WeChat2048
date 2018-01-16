Page({
    /**
     * 页面的初始数据
     */
    data: {
        size: 4,
        scoreName: "得分",
        scoreNumber: 0,
        scoreMaxName: "最高分",
        scoreMaxNumber: 0,
        numberArray: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        isAdd: false,
        is2048: false
    },

    /**
     * 初始化数据
     */
    initGame: function () {
        var arr = [];
        var size = this.data.size;
        for (var i = 0; i < size; i++) {
            var tmpArr = [];
            for (var j = 0; j < size; j++) {
                tmpArr.push(0);
            }
            arr.push(tmpArr);
        }
        this.setData({
            scoreNumber: 0,
            numberArray: arr,
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            isAdd: false,
            is2048: false
        });
        this.randomNum();
        this.randomNum();
    },

    /**
     * 页面被加载时执行
     */
    onLoad: function (options) {
        var _this = this;
        var size = options.size;
        this.setData({
            size: size
        });
        this.initGame();

        wx.getStorage({
            key: "score" + size, success: function (res) {
                if (res.data) {
                    _this.setData({ scoreNumber: res.data })
                }
            }
        });
        wx.getStorage({
            key: "numberArray" + size, success: function (res) {
                if (res.data) {
                    _this.setData({ numberArray: res.data })
                }
            }
        });
        wx.getStorage({
            key: "scoreMax" + size, success: function (res) {
                if (res.data) {
                    _this.setData({ scoreMaxNumber: res.data })
                }
            }
        });
        wx.getStorage({
            key: "is2048" + size, success: function (res) {
                if (res.data) {
                    _this.setData({ is2048: res.data })
                }
            }
        });
    },
    /**
     * 用户点击事件
     */
    tapStart: function (event) {
        this.setData({ startX: event.touches[0].clientX, startY: event.touches[0].clientY });
    },

    /**
     * 用户移动事件
     */
    tapMove: function (event) {
        this.setData({ endX: event.touches[0].clientX, endY: event.touches[0].clientY });
    },

    /**
     * 点击结束事件
     */
    tapEnd: function (event) {
        var _this = this;
        var size = this.data.size;
        var x = this.data.startX - this.data.endX;
        var y = this.data.startY - this.data.endY;
        this.data.isAdd = false;
        if (this.data.endX == 0 || this.data.endY == 0) {
            this.setData({ startX: 0, startY: 0, endX: 0, endY: 0 });
            return;
        }
        if (Math.abs(x) > Math.abs(y)) {
            if (x > 30) {
                this.moveLeft();
            } else {
                if (x < -30) {
                    this.moveRight();
                }
            }
        } else {
            if (y > 30) {
                this.moveUp();
            } else {
                if (y < -30) {
                    this.moveDown();
                }
            }
        }
        this.isMaxScore();
        if (this.data.isAdd) {
            this.randomNum();
        }
        wx.setStorage({ key: "score" + size, data: _this.data.scoreNumber });
        wx.setStorage({ key: "numberArray" + size, data: _this.data.numberArray });
        wx.setStorage({ key: "is2048" + size, data: _this.data.is2048 });
        if (this.isOver()) {
            this.reGame(false);
        }
        this.setData({ startX: 0, startY: 0, endX: 0, endY: 0 });
    },

    /**
     * 左滑方法
     */
    moveLeft: function () {
        var length = this.data.size;
        var arr = this.data.numberArray;
        for (var tX = 0; tX < length; tX++) {
            for (var tY = 0; tY < length - 1; tY++) {
                for (var tmp = tY + 1; tmp < length; tmp++) {
                    if (arr[tX][tmp] === 0) continue;
                    if (arr[tX][tY] === 0) {
                        arr[tX][tY] = arr[tX][tmp];
                        arr[tX][tmp] = 0;
                        this.data.isAdd = true;
                    } else if (arr[tX][tY] === arr[tX][tmp]) {
                        arr[tX][tY] *= 2;
                        arr[tX][tmp] = 0;
                        this.data.isAdd = true;
                        this.addScore(arr[tX][tY]);
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        this.setData({ numberArray: arr });
    },

    /**
     * 右滑方法
     */
    moveRight: function () {
        var length = this.data.size;
        var arr = this.data.numberArray;
        for (var tX = 0; tX < length; tX++) {
            for (var tY = length - 1; tY > 0; tY--) {
                for (var tmp = tY - 1; tmp >= 0; tmp--) {
                    if (arr[tX][tmp] === 0) continue;
                    if (arr[tX][tY] === 0) {
                        arr[tX][tY] = arr[tX][tmp];
                        arr[tX][tmp] = 0;
                        this.data.isAdd = true;
                    } else if (arr[tX][tY] === arr[tX][tmp]) {
                        arr[tX][tY] *= 2;
                        arr[tX][tmp] = 0;
                        this.data.isAdd = true;
                        this.addScore(arr[tX][tY]);
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        this.setData({ numberArray: arr });
    },

    /**
     * 上滑方法
     */
    moveUp: function () {
        var length = this.data.size;
        var arr = this.data.numberArray;
        for (var tY = 0; tY < length; tY++) {
            for (var tX = 0; tX < length - 1; tX++) {
                for (var tmp = tX + 1; tmp < length; tmp++) {
                    if (arr[tmp][tY] === 0) continue;
                    if (arr[tX][tY] === 0) {
                        arr[tX][tY] = arr[tmp][tY];
                        arr[tmp][tY] = 0;
                        this.data.isAdd = true;
                    } else if (arr[tX][tY] === arr[tmp][tY]) {
                        arr[tX][tY] *= 2;
                        arr[tmp][tY] = 0;
                        this.data.isAdd = true;
                        this.addScore(arr[tX][tY]);
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        this.setData({ numberArray: arr });
    },

    /**
     * 下滑方法
     */
    moveDown: function () {
        var length = this.data.size;
        var arr = this.data.numberArray;
        for (var tY = 0; tY < length; tY++) {
            for (var tX = length - 1; tX > 0; tX--) {
                for (var tmp = tX - 1; tmp > -1; tmp--) {
                    if (arr[tmp][tY] === 0) continue;
                    if (arr[tX][tY] === 0) {
                        arr[tX][tY] = arr[tmp][tY];
                        arr[tmp][tY] = 0;
                        this.data.isAdd = true;
                    } else if (arr[tX][tY] === arr[tmp][tY]) {
                        arr[tX][tY] *= 2;
                        arr[tmp][tY] = 0;
                        this.data.isAdd = true;
                        this.addScore(arr[tX][tY]);
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        this.setData({ numberArray: arr });
    },

    /**
     * 随机生成数字
     */
    randomNum: function () {
        var size = this.data.size;
        var arr = this.data.numberArray;
        do {
            var x = Math.floor(Math.random() * 100) % size;
            var y = Math.floor(Math.random() * 100) % size;
        } while (arr[x][y] !== 0);
        arr[x][y] = Math.floor(Math.random() * 100) < 90 ? 2 : 4;
        this.setData({ numberArray: arr });
    },

    /**
     * 加分
     */
    addScore: function (score) {
        var tScore = this.data.scoreNumber;
        if (score > 0) {
            this.setData({ scoreNumber: tScore += score });
        }
    },

    /**
     * 游戏是否结束
     */
    isOver: function () {
        var count = 0;
        var size = this.data.size;
        var arr = this.data.numberArray;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                if (arr[x][y] === 0) {
                    count++;
                } else {
                    if (arr[x][y] === 2048 && !this.data.is2048) {
                        wx.showToast({ title: "恭喜你！", icon: "success", duration: 4000 });
                        this.data.is2048 = true;
                    }
                }
            }
        }
        if (count > 0) {
            return false;
        } else {
            for (var tX = 0; tX < size - 1; tX++) {
                for (var tY = 0; tY < size - 1; tY++) {
                    if ((arr[tX][tY] === arr[tX + 1][tY]) || (arr[tX][tY] === arr[tX][tY + 1])) {
                        return false;
                    }
                }
                if (arr[tX][size - 1] === arr[tX + 1][size - 1]) {
                    return false;
                }
            }
            for (var tY = 0; tY < size - 1; tY++) {
                if (arr[size - 1][tY] === arr[size - 1][tY + 1]) {
                    return false;
                }
            }
        }
        return true
    },

    /**
     * 重新开始游戏
     */
    reGame: function (isRe) {
        var _this = this;
        var size = this.data.size;
        wx.showModal({
            title: "提示",
            content: isRe ? "是否重开游戏？" : "游戏结束，是否开始下一局？",
            cancelText: "否",
            confirmText: "是",
            success: function (res) {
                if (res.confirm) {
                    _this.initGame();
                    wx.removeStorage({
                        key: "score" + size
                    });
                    wx.removeStorage({
                        key: "numberArray" + size
                    });
                }
            }
        });
    },

    /**
     * 最高分记录
     */
    isMaxScore: function () {
        var score = this.data.scoreNumber;
        var maxScore = this.data.scoreMaxNumber;
        var size = this.data.size;
        if (score > maxScore) {
            this.setData({
                scoreMaxNumber: score
            });
            wx.setStorage({
                key: 'scoreMax' + size,
                data: score
            });
        }
    }
});