<script setup>
import img1 from '../assets/public/kuang_move.png'
import img2 from '../assets/public/big_kuang.png'
import img_gif1 from '../assets/public/01.gif'
import img_gif2 from '../assets/public/02.gif'
import img_gif3 from '../assets/public/03.gif'
</script>

<script>
export default {
  data() {
    return {
      img_gif_3: null,
      text_show: null,
    }
  },
  mounted() {
    const text_con = document.getElementById('my_text')
    const move_kuang = document.getElementById('kuang3')
    let index = 0
    window.api.onListenIsClick((_event, message) => {
      this.$refs.img_gif_3.style.display = 'none'
      move_kuang.style.transform = 'translate(-63%, -200%) scaleX(2.5) scaleY(6.5)'
      move_kuang.src = img2
      console.log(`button is click${message}`)
      text_con.textContent += '\n'
      text_con.textContent += `Q :${message}\n`
      const timeid = setTimeout(() => {
        this.$refs.text_show.style.display = 'block'
        clearTimeout(timeid)
      }, 1000)
    })
    window.api.onListenDataGet((_event, message) => {
      const startIndex = message.indexOf('reply":') + 7
      const endIndex = message.indexOf('reply_ar') - 3
      index = startIndex
      animateText(message, startIndex, endIndex)
    })
    function animateText(in_str, start, end) {
      if (index < end) {
        if (text_con)
          text_con.textContent += in_str[index]

        index++
        setTimeout(() => {
          animateText(in_str, index, end)
        }, 80)
      }
    }
  },
  methods: {},
}
</script>

<template>
  <div class="page_other">
    <div
      style="
        position: absolute;
        display: flex;
        /* top: 702px;
        left:187px; */
        z-index: 1;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
    >
      <img id="image-container" src="../assets/public/round.png" alt="Image">
    </div>

    <div class="show_lable">
      <label id="my_text" ref="text_show" style="color: white; display: none;" />
    </div>

    <img id="kuang1" src="../assets/public/kuang.png" alt="kuang_in=mage">
    <img id="gif_01" :src="img_gif1">
    <img id="kuang2" src="../assets/public/kuang.png" alt="kuang_in=mage">
    <img id="gif_02" :src="img_gif2">
    <img id="kuang3" :src="img1" alt="kuang_in=mage">
    <img id="gif_03" ref="img_gif_3" :src="img_gif3">
  </div>
</template>

<style lang="scss" scoped>
.page_other {
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
  background-image: url('../assets/public/background_other.png');
  /* 设置背景尺�?�和重�?�方�? */
  background-size: auto;
  background-repeat: no-repeat;
}
#my_text {
  white-space: pre-line;
  font-size: 40px; /* 设置字体大小，可以根�?需要调�? */
  max-width: 80%;
  top: 17%;
  left: 10%;
  position: absolute;
}
.show_lable {
  z-index: 99;
  max-width: 80%;
}
#gif_01 {
  width: 750px;
  height: 380px;
  position: absolute;
  top: 24.2%;
  left: 18.5%;
}
#gif_02 {
  width: 750px;
  height: 380px;
  position: absolute;
  top: 57.6%;
  left: 9.3%;
  z-index: 3;
}
#gif_03 {
  width: 750px;
  height: 380px;
  position: absolute;
  top: 70%;
  left: 56%;
  z-index: 3;
}
@import '../assets/css/round.css';
@import '../assets/css/kuang.css';
</style>
