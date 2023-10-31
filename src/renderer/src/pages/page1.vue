<script>
import axios from 'axios'

export default {
  data() {
    return {
      text_in: null,
      page1: null,
      page2: null,
      sma_img: null,
      page3: null,
      test_send_button: null,
      inputValue: '',
      keyboard: null,
      hovered: -1, // 被选中按钮的索引
      isFocus: false, // 输入模式
    }
  },
  watch: {
    isFocus(val) {
      val ? window.api.openKeyboard() : window.api.closeKeyboard()
    },
  },
  methods: {
    onTestSendButton() {
      console.log('onTestSendButton', this.$refs.text_in.value)
      this.timer && clearTimeout(this.timer)
      // send text to wang
      window.api.sendButtonText(this.$refs.text_in.value)
      this.sendPostRequest(this.$refs.text_in.value)
      this.$refs.text_in.focus()
    },
    sendPostRequest(data_in) {
      const params = new URLSearchParams()
      params.append('id', 23)
      params.append('content', data_in)
      params.append('user_id', 6)
      const config = {
        url: 'http://api.mpw.ai:9023/api/chat/completiontest',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        data: params,
      }
      // console.log(params)
      axios(config)
        .then((response) => {
          console.log(response)
          const data_get = JSON.stringify(response.data)
          console.log(data_get)
          const startIndex = data_get.indexOf('reply')
          const endIndex = data_get.indexOf('reply_array') + 8
          const extractedText = data_get.substring(startIndex, endIndex)
          window.api.onDataGet(extractedText)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onButtonClick(e) {
      const buttonText = e.currentTarget.textContent
      console.log(`Button ${buttonText} Clicked`)
      window.api.sendButtonText(buttonText)
      // 调用发送API请求的方法
      this.sendPostRequest(buttonText)
    },
    // fix 不触发onTestSendButton
    test() {
      this.timer = setTimeout(() => {
        this.isFocus = false
        this.$refs.text_in.value = ''
      }, 300)
    },
    showKeyBoard() {
      this.timer && clearTimeout(this.timer)
      this.$refs.text_in.focus()
      this.isFocus = true
    },
  },
}
</script>

<template>
  <div class="page">
    <div id="page1" class="page-content" :class="isFocus ? 'is-hidden' : ''">
      <!-- todo use v-for -->
      <button
        id="mybutton0"
        class="transparent-button"
        style="top: 284px; left: 430px; padding-left: 50px"
        :class="hovered === 0 ? 'selected' : 'blur-text'"
        @mouseover="hovered = 0"
        @mouseout="hovered = -1"
        @click="onButtonClick"
      >
        请帮我制定一份劳动合同?
      </button>
      <button
        id="mybutton1"
        class="transparent-button"
        style="top: 370px; left: 430px; padding-left: 50px"
        :class="hovered === 1 ? 'selected' : 'blur-text'"
        @mouseover="hovered = 1"
        @mouseout="hovered = -1"
        @click="onButtonClick"
      >
        请帮我写一张元旦请假条?
      </button>
      <button
        id="mybutton2"
        class="transparent-button"
        style="top: 456px; left: 430px; padding-left: 50px"
        :class="hovered === 2 ? 'selected' : 'blur-text'"
        @mouseover="hovered = 2"
        @mouseout="hovered = -1"
        @click="onButtonClick"
      >
        请帮我草拟一份律师函?
      </button>
      <button
        id="mybutton3"
        class="transparent-button"
        style="top: 542px; left: 430px; padding-left: 50px"
        :class="hovered === 3 ? 'selected' : 'blur-text'"
        @mouseover="hovered = 3"
        @mouseout="hovered = -1"
        @click="onButtonClick"
      >
        请帮我写一份2024年元旦放假通知?
      </button>
      <button
        id="mybutton4"
        class="transparent-button"
        style="top: 628px; left: 430px; padding-left: 50px"
        :class="hovered === 4 ? 'selected' : 'blur-text'"
        @mouseover="hovered = 4"
        @mouseout="hovered = -1"
        @click="onButtonClick"
      >
        请帮我制定一份杭州滨江区扶持AIGC生成式人工智能创新创业公司的政策?
      </button>
      <button
        id="mybutton5"
        class="transparent-button"
        style="top: 714px; left: 430px; padding-left: 50px"
        :class="hovered === 5 ? 'selected' : 'blur-text'"
        @mouseover="hovered = 5"
        @mouseout="hovered = -1"
        @click="onButtonClick"
      >
        请将古诗《静夜思》的情景扩写成一篇短的英文科幻故事?
      </button>
    </div>
    <div id="page2" class="page2-content" :class="isFocus ? 'is-input' : ''">
      <input
        id="text_get"
        ref="text_in"
        class="text-input"
        style="top: 800px; left: 430px"
        placeholder="请输入你的问题。"
        @focus="isFocus = true"
        @blur="test"
      >
      <button
        id="text_send"
        class="text_send_button"
        style="top: 810px; left: 1280px;"
        @click="onTestSendButton"
      />
      <button class="key_buttton" style="top: 800px; left: 1370px" @click="showKeyBoard" />
      <div id="key_sma0" class="key_sma" style="top: 815px; left: 1412px" />
    </div>
  </div>
</template>

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
.is-input {
  transform: translateY(-560px);
  ::placeholder {
    color: rgba(255,255,255, 0.5);
  }
  .text_send_button {
    opacity: 1;
    cursor: pointer;
    pointer-events: all;
  }
  .key_sma {
    transform: translateY(15px);
  }
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
