var lockList = [];
var write36F5 = '';
var notify36F6 = '';
var deviceId = '';
var serviceId = '';
var currentDevice = '';
var _this = "";
var companyId = [1, 2];
const app = getApp()
//查看蓝牙适配器状态
const getStatus = function () {
  wx.getBluetoothAdapterState({
    success: function (res) {
      console.log(res)
      if (res.discovering == true) {

      }
    },
    fail: function (res) {
      console.log(res)
    }
  })
}
//当有设备被扫描到时触发
const onDeviceFound = function (devices) {
  console.log('new device list has founded')
  console.log(devices)
  //判断是否是该公司的蓝牙设备
  var resultBuffer = devices.devices[0].advertisData
  var resultBytes = new Int8Array(resultBuffer)
  console.log(resultBytes)
  if (resultBytes[0] == companyId[0] && resultBytes[1] == companyId[1]) {
    var exist = 0 
    for(var i in lockList){
      if (lockList[i].deviceId == devices.devices[0].deviceId){
        exist++
      }
    }
    if(exist == 0){
      var newEquipment = {
        "deviceId": devices.devices[0].deviceId,
        "lock_name": devices.devices[0].name,
        "status": "0",
        "showView": true,
        "index": lockList.length
      }
      lockList.push(newEquipment)
      _this.setData({
        lockList: lockList
      });
    }
  }
}
//扫描蓝牙设备
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

//连接设备
const connectDevice = function (device) {
  wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
      console.log(res)
    }
  })
  wx.createBLEConnection({
    deviceId: device.deviceId,
    success: function (res) {
      console.log(res);
      currentDevice = device
      currentDevice.showView = false
      currentDevice.status = '1'
      lockList[currentDevice.index] = currentDevice
      _this.setData({
        lockList: lockList
      });

      let str = JSON.stringify(device);
      wx.navigateTo({
        "url": '/pages/lock/view?device=' + str
      })
    },
    fail: function (res) {
      wx.showToast({
        title: "连接失败,请重新激活蓝牙设备",
        icon: "none"
      })
    }
  })
}
//获取设备特征值
const achieveUUID = function () {

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideHeader: true,
    hideBottom: true,
    refreshTime: '',
    showView: true,
    topText: {
      "lock_name": "锁名",
      "status": "连接状态",
      "operate": "操作",
      showView: false
    },
    lockList: lockList,
    allPages: '',
    currentPage: 1,
    loadMoreData: '加载更多...'
  },
  //扫描设备
  discoveryRequipment: function () {
    _this = this;
    console.log('discoveryRequipment')
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res)
        wx.onBluetoothDeviceFound(onDeviceFound)
        startDiscovery()
      },
      fail: function (res) {
        console.log(res)
        if (res.errCode == 10001) {
          console.log('blue tooth not open or enable')
        }
        wx.showToast({
          title: "蓝牙未打开",
          icon: "none"
        })
      }
    })
  },
  connect: function (e) {
    console.log(e.currentTarget.dataset.lock)
    connectDevice(e.currentTarget.dataset.lock);

  },
  disconnect: function (e) {
    console.log(e.currentTarget.dataset)
    wx.closeBLEConnection({
      deviceId: currentDevice.deviceId,
      success: function (res) {
        console.log(res)
        currentDevice.showView = true
        currentDevice.status = '0'
        lockList[currentDevice.index] = currentDevice
        console.log(currentDevice)
        _this.setData({
          lockList: lockList
        });
      },
      complete: function () {
        wx.closeBluetoothAdapter({
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  navigate_test: function (e) {
    console.log(e.currentTarget.dataset.lock)
    let str = JSON.stringify(e.currentTarget.dataset.lock);
    wx.navigateTo({
      "url": '/pages/lock/view?device=' + str
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {

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
    // wx.closeBLEConnection({
    //   deviceId: currentDevice.deviceId,
    //   success: function (res) {
    //     console.log(res)
    //     currentDevice.showView = true
    //     currentDevice.status = 0
    //     lockList[currentDevice.index] = currentDevice
    //     _this.setData({
    //       lockList: lockList
    //     });
    //   },
    //   complete: function () {
    //     wx.closeBluetoothAdapter({
    //       success: function (res) {
    //         console.log(res)
    //       }
    //     })
    //   }
    // })
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