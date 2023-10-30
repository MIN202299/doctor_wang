<script setup></script>

<template>
  <div class="page">
    <div id="page1" ref="page1" class="page-content">
      <button
        id="mybutton0"
        class="transparent-button"
        style="top: 284px; left: 430px; padding-left: 50px"
      >
        请帮我制定一份劳动合同?
      </button>
      <button
        id="mybutton1"
        class="transparent-button"
        style="top: 370px; left: 430px; padding-left: 50px"
      >
        请帮我写一张元旦请假条?
      </button>
      <button
        id="mybutton2"
        class="transparent-button"
        style="top: 456px; left: 430px; padding-left: 50px"
      >
        请帮我草拟一份律师函?
      </button>
      <button
        id="mybutton3"
        class="transparent-button"
        style="top: 542px; left: 430px; padding-left: 50px"
      >
        请帮我写一份2024年元旦放假通知?
      </button>
      <button
        id="mybutton4"
        class="transparent-button"
        style="top: 628px; left: 430px; padding-left: 50px"
      >
        请帮我制定一份杭州滨江区扶持AIGC生成式人工智能创新创业公司的政策?
      </button>
      <button
        id="mybutton5"
        class="transparent-button"
        style="top: 714px; left: 430px; padding-left: 50px"
      >
        请将古诗《静夜思》的情景扩写成一篇短的英文科幻故事?
      </button>
    </div>
    <div id="page2" ref="page2" class="page2-content">
      <input
        id="text_get"
        ref="text_in"
        v-model="inputValue"
        class="text-input"
        style="top: 800px; left: 430px"
        placeholder="请输入你的问题。"
        @input="handleInput"
      />
      <button
        id="text_send"
        ref="test_send_button"
        class="text_send_button"
        style="top: 810px; left: 1280px"
      ></button>
      <button class="key_buttton" style="top: 800px; left: 1370px"></button>
      <div id="key_sma0" ref="sma_img" class="key_sma" style="top: 815px; left: 1412px"></div>
    </div>
    <div id="page3" ref="page3">
      <div class="simple-keyboard" />
    </div>
  </div>
</template>

<script>
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import layout from 'simple-keyboard-layouts/build/layouts/chinese' // 中文输入法

import axios from 'axios'
export default {
  // 组件的相关选项
  data() {
    return {
      text_in: null,
      page1: null,
      page2: null,
      sma_img: null,
      page3: null,
      test_send_button: null,
      inputValue: '',
      keyboard: null
    }
  },
  mounted() {
    const buttons = document.querySelectorAll('.transparent-button')
    // const text_in = document.getElementById('text_get')
    // const page1 = document.getElementById('page1')
    // const page2 = document.getElementById('page2')
    // const sma_img = document.getElementById('key_sma0')
    // const page3 = document.getElementById('page3')
    // const test_send_button = document.getElementById('text_send')

    // 添加事件监听�?
    buttons.forEach((button) => {
      button.addEventListener('mouseover', function () {
        buttons.forEach((btn) => {
          btn.classList.remove('selected')
          btn.classList.add('blur-text')
        })
        button.classList.add('selected')
        button.classList.remove('blur-text')
      })
      button.addEventListener('mouseout', function () {
        buttons.forEach((btn) => {
          btn.classList.remove('selected')
          btn.classList.remove('blur-text')
        })
      })
      button.addEventListener('click', () => {
        const buttonText = button.textContent
        console.log(`Button ${buttonText} Clicked`)
        window.api.sendButtonText(buttonText)
        // 调用发送API请求的方法s
        this.sendPostRequest(buttonText)
      })
    })
    this.$refs.text_in.addEventListener('click', this.onTextClick)
    window.addEventListener('click', this.onWindowClick)
    this.$refs.test_send_button.addEventListener('click', this.onTestSendButton)
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      ...layout
    })
  },
  beforeUnmount() {
    window.removeEventListener('click', this.onWindowClick)
    this.$refs.text_in.removeEventListener('click', this.onTextClick)
    this.$refs.test_send_button.removeEventListener('click', this.onTestSendButton)
  },
  methods: {
    // 组件的方�?
    onTextClick(e) {
      this.$refs.page1.classList.add('hidden')
      this.$refs.test_send_button.style.pointerEvents = 'auto'
      this.$refs.test_send_button.style.opacity = '1' // 不透明度�?�置�?1
      this.$refs.page2.style.transform = 'translateY(-560px)'
      this.$refs.sma_img.style.transform = 'translateY(15px)'
      this.$refs.page3.classList.add('visible')
      e.stopPropagation()
    },
    onWindowClick(event) {
      const mouseX = event.clientX // 锟斤拷取锟斤拷锟斤拷锟轿伙拷�?锟絏锟斤拷锟斤拷
      const mouseY = event.clientY // 锟斤拷取锟斤拷锟斤拷锟轿伙拷�?锟結锟斤拷锟斤拷

      if (mouseX <= 400 || mouseX >= 1500 || mouseY <= 100 || mouseY >= 900) {
        this.$refs.page2.style.transform = 'translateY(0)'
        this.$refs.page2.style.transform = 'translateX(0)'
        this.$refs.page1.classList.remove('hidden')
        this.$refs.test_send_button.style.pointerEvents = 'none'
        this.$refs.test_send_button.style.opacity = '0' // 不透明度�?�置�?1
        this.$refs.sma_img.style.transform = 'translateY(0)'
        this.$refs.page3.classList.remove('visible')
        // fix bug
      }
    },
    onTestSendButton() {
      console.log(this.$refs.text_in.value)
      //send text to wang
      window.api.sendButtonText(this.$refs.text_in.value)
      this.sendPostRequest(this.$refs.text_in.value)
      this.$refs.text_in.value = ''
    },
    sendPostRequest(data_in) {
      const params = new URLSearchParams()
      params.append('id', 23)
      params.append('content', data_in)
      params.append('user_id', 6)
      var config = {
        method: 'POST',
        url: 'http://api.mpw.ai:9023/api/chat/completiontest',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: params
      }
      console.log(params)
      axios(config)
        .then(function (response) {
          const data_get = JSON.stringify(response.data)
          console.log(data_get)
          const startIndex = data_get.indexOf('reply')
          const endIndex = data_get.indexOf('reply_array') + 8
          const extractedText = data_get.substring(startIndex, endIndex)
          window.api.onDataGet(extractedText)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    onChange(input) {
      this.inputValue = input
      // console.log('Input changed', input)
    },
    onKeyPress(button) {
      // console.log('Button pressed', button)
      if (button === '{shift}' || button === '{lock}') this.handleShift()
    },
    // 切换shift/默认布局
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName
      let shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

      this.keyboard.setOptions({
        layoutName: shiftToggle
      })
    },
    handleInput(event) {
      this.keyboard.setInput(event.target.value)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/my_button.css';
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family:
    Roboto,
    -apple-system,
    BlinkMacSystemFont,
    'Helvetica Neue',
    'Segoe UI',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Open Sans',
    sans-serif;
  background-image: url('../assets/public/background_1.png');
  /* 设置背景尺�?�和重�?�方�? */
  background-size: auto;
  background-repeat: no-repeat;
}

.page2-content {
  translate: translateY(0);
  transition: transform 1s ease;
  .key_sma {
    background-size: cover; /* 或者使�? contain，根�?需要选择 */
    position: absolute;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    background-color: transparent; /* 将按�?背景颜色设置为透明 */
    background-repeat: no-repeat; /* 禁�?�背�?图片重�?? */
    width: 42px; /* 设置按钮的�?�度 */
    height: 42px; /* 设置按钮的高�? */
    border: none; /* 去掉按钮边�?? */
    transition: all 0.4s ease; /* 添加过渡效果，使样式改变更平�? */
    z-index: 1;
    background-image: url('../assets/public/key_show_sma.png');
  }
  .key_buttton {
    position: absolute;
    background-image: url('../assets/public/button_sma.png'); /* 设置背景图片�?�? */
    display: flex;
    /* justify-content: center; */
    align-items: center;
    background-color: transparent; /* 将按�?背景颜色设置为透明 */
    background-repeat: no-repeat; /* 禁�?�背�?图片重�?? */
    width: 125px; /* 设置按钮的�?�度 */
    height: 64px; /* 设置按钮的高�? */
    border: none; /* 去掉按钮边�?? */
    color: white; /* 按钮文本颜色 */
    cursor: pointer; /* 鼠标指针样式 */
    font-family: 'Arial', sans-serif;
    font-size: 23px;
    font-weight: 450;
    text-align: left;
    transition: all 1s ease; /* 添加过渡效果，使样式改变更平�? */
    z-index: 2;
  }
  .text-input {
    position: absolute;
    width: 915px; /* 文本框�?�度 */
    height: 64px; /* 文本框高�? */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent; /* 将按�?背景颜色设置为透明 */
    background-image: url('../assets/public/input_show0.png'); /* 背景图片�?�? */
    background-repeat: no-repeat; /* 禁�?�背�?图片重�?? */
    border: none; /* 去掉边�?? */
    color: white; /* 文本颜色 */
    text-indent: 20px; /* 占位符文字向右移动的距�?? */
    padding-left: 20px; /* 光标（闪动的竖线）向右移动的距�?? */
    font-family: 'Arial', sans-serif;
    font-size: 23px;
    font-weight: 450;
  }
  .text-input:focus {
    outline: none;
    background-image: url('../assets/public/input_chose.png'); /* 背景图片�?�? */
  }
  .text_send_button {
    position: absolute;
    background-image: url('../assets/public/text_send.png'); /* 设置背景图片�?�? */
    display: flex;
    /* justify-content: center; */
    align-items: center;
    background-color: transparent; /* 将按�?背景颜色设置为透明 */
    background-repeat: no-repeat; /* 禁�?�背�?图片重�?? */
    width: 42px; /* 设置按钮的�?�度 */
    height: 42px; /* 设置按钮的高�? */
    border: none; /* 去掉按钮边�?? */
    color: white; /* 按钮文本颜色 */
    cursor: pointer; /* 鼠标指针样式 */
    font-family: 'Arial', sans-serif;
    font-size: 23px;
    font-weight: 450;
    text-align: left;
    transition: all 0.4s ease; /* 添加过渡效果，使样式改变更平�? */
    z-index: 1;
    pointer-events: none;
    opacity: 0;
  }
  .text_send_button:hidden {
    pointer-events: none;
    opacity: 0;
  }
  .text_send_button:dishidden {
    pointer-events: auto; /* 不可选中，鼠标事件穿�? */
    opacity: 1;
  }
  .simple-keyboard {
    max-width: 1000px;
  }
  // #page3 {
  //   position: absolute;
  //   top: 40%;
  //   left: 40%;
  //   /*display: none;
  //   opacity: 0;
  //   pointer-events: none; 
  //   transition: opacity 1s ease; */
  // }
  // #page3.visible {
  //   opacity: 1;
  //   display: block; /* 当添加visible类时，显示page3元素 */
  //   pointer-events: auto; /* 不可选中，鼠标事件穿透 */
  // }
}
</style>
