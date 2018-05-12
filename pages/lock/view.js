var _this = "";
var write36F5 = '';
var notify36F6 = '';
var deviceId = '';
var serviceId = '';

//获取服务UUID和特征值
var acceptCharacters = function(device){
  console.log("获取特征值")
  console.log(device)
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function (res) {
      console.log(res)
      for (var index in res.services) {
        if (res.services[index].uuid.indexOf('FEE7') != -1) {
          serviceId = res.services[index].uuid
          console.log(serviceId)
        }
      }

      wx.getBLEDeviceCharacteristics({
        deviceId: deviceId,
        serviceId: serviceId,
        success: function (res) {
          console.log(res)

          for (var char in res.characteristics) {
            if (res.characteristics[char].uuid.indexOf('36F5') != -1) {
              write36F5 = res.characteristics[char].uuid
            }
            if (res.characteristics[char].uuid.indexOf('36F6') != -1) {
              notify36F6 = res.characteristics[char].uuid
            }
          }

          console.log(write36F5)
          console.log(notify36F6)
          monitor36F6()
        }
      })

    },

  })
}

//监听36F6特征值改变时
const monitor36F6 = function(){
  console.log("监听特征值改变");
  wx.notifyBLECharacteristicValueChange({
    deviceId: deviceId,
    serviceId: serviceId,
    characteristicId: notify36F6,
    state: true,
    success: function (res) {
      console.log(res)
      onValueChange();
    }
  })
}

//当特征值改变时回调函数, 得到回调特征值
const onValueChange = function () {
  console.log("设置特征值改变时的回调")
  wx.onBLECharacteristicValueChange(function (res) {
    console.log("特征值改变了")
    console.log(res)
    var resultBuffer = res.value
    var resultBytes = new Int8Array(resultBuffer)
    console.log(resultBytes)
    var byteArray = ''
    for (var index in resultBytes) {
      byteArray += resultBytes[index] + ','
    }
    console.log(byteArray)
    wx.request({
      method: "POST",
      url: 'http://lock.dpdaidai.top/data/openLock',
      data: { "byteArray": byteArray },
      // dataType : 
      success: function (res) {
        console.log(res)
        var bytes = JSON.parse(res.data.data)
        console.log(bytes)
        var arrayBuffer = new ArrayBuffer(16)
        var uint8Array = new Int8Array(arrayBuffer)
        for (var i = 0; i < uint8Array.length; i++) {
          uint8Array[i] = bytes[i]
        }
        console.log(arrayBuffer)
        wx.writeBLECharacteristicValue({
          deviceId: deviceId,
          serviceId: serviceId,
          characteristicId: write36F5,
          value: arrayBuffer,
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (data) {
    let device = JSON.parse(data.device)
    _this = this
    this.setData({
      device:device
    })
    deviceId = device.deviceId
    console.log(this.data)
    acceptCharacters(device)
    
  },
  openLock : function(){
    wx.request({
      url: 'http://lock.dpdaidai.top/data/accessToken',
      success: function (res) {
        console.log(res)
        var bytes = JSON.parse(res.data.data)
        console.log(bytes)
        var arrayBuffer = new ArrayBuffer(16)
        var uint8Array = new Int8Array(arrayBuffer)
        for (var i = 0; i < uint8Array.length; i++) {
          uint8Array[i] = bytes[i]
        }
        console.log(arrayBuffer)
        wx.writeBLECharacteristicValue({
          deviceId: deviceId,
          serviceId: serviceId,
          characteristicId: write36F5,
          value: arrayBuffer,
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})