// pages/componentTest/componentTest.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
      observer: function (newVal, oldVal){
        console.log(newVal + oldVal)
        console.log("value changed")
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 这里是一些组件内部数据
    someData: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { 
      console.log('customMethod')
      console.log(this.is)
      console.log(this.id)
      console.log(this.dataset)
      console.log(this.data)
      this.setData({ someData: 1, innerText: "new text" })
    },
    change:function(){
      console.log("value changed")
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  }
})
