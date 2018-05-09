//index.js
//获取应用实例
var write36F5 = '';
var notify36F6 = '';
var deviceId = '';
var serviceId = '';
const app = getApp()
const getStatus = function () {
  wx.getBluetoothAdapterState({
    success: function (res) {
      console.log(res)
    },
    fail: function (res) {
      console.log(res)
    }
  })
}
const startDiscovery = function () {
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: false,
    fail: function (res) {
      console.log(res)
    },
    success: function (res) {
      console.log(res)
    }
  })
}
const onValueChange = function () {
  wx.onBLECharacteristicValueChange(function (res) {
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
      data: { "byteArray": byteArray},
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

const connectDevice = function (deviceId) {
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function (res) {
      console.log(res);
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        success: function (res) {
          console.log(res)
          for (var index in res.services) {
            console.log(res.services[index].uuid)
            if (res.services[index].uuid.indexOf('FEE7') != -1) {
              serviceId = res.services[index].uuid
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
          })

        }
      })
    }
  })
}
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    text: 'init data',
    array: [{ msg: '1' }, { msg: '2' }],
    array1: [1, 2, 3, 4, 5],
    staffA: { firstName: 'Hulk', lastName: 'Hu' },
    staffB: { firstName: 'Shang', lastName: 'You' },
    staffC: { firstName: 'Gideon', lastName: 'Lin' }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    console.log("xxxxx")
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onPullDownRefresh: function () {
    console.log("pull down refresh")
  },
  onReachBottom: function () {
    console.log("reach bottom")
  },
  // onPageScroll:function(Object){
  //   console.log(Object)
  // },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  viewTap: function () {
    console.log('view tap')
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res)
        getStatus()
        wx.onBluetoothDeviceFound(function (devices) {
          // console.log('new device list has founded')

          // console.log(devices.devices[0])
          if (devices.devices[0].deviceId == "3C:A3:08:91:20:4A") {
            console.dir(devices)
            deviceId = devices.devices[0].deviceId
            connectDevice(devices.devices[0].deviceId)
          }
        })
        startDiscovery()
      },
      fail: function (res) {
        console.log(res)
        if (res.errCode == 10001) {
          console.log('blue tooth not open or enable')
        }
      },
      complete: function (res) {
        console.log(res)
      },
    })
  },
  openLock: function () {
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
  testPost: function(){
    // var resultBuffer = new ArrayBuffer();
    // var resultBytes = new Int8Array(resultBuffer)
    // resultBytes[1]=1;
    // resultBytes[2]=2;
    // wx.request({
    //   method: "POST",
    //   url: 'http://lock.dpdaidai.top/data/openLock',
    //   data: { "s": 'str', "bytes": resultBuffer },
    //   dataType : String,
    //   // dataType : 
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
  },
  onHide: function () {
    wx.closeBLEConnection({
      deviceId: "3C:A3:08:91:20:4A",
      success: function (res) {
        console.log(res)
      },
      complete: function () {
        wx.closeBluetoothAdapter({
          success: function (res) {
            console.log(res)
          }
        })
      }
    })

  }
})
