<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Chat, Page2Data } from '../types'

const visible = ref(false)
const messages = ref<Chat[]>([])
const isLoading = ref(false)

const htmlText = ref('')
const wrapper$ = ref<HTMLDivElement>(null!)
const content$ = ref<HTMLUListElement>(null!)
let timer

onMounted(() => {
  ;(window as any).api.onListenDataGet((_, data: string) => {
    console.log('data', data)
    timer && clearInterval(timer)
    htmlText.value = ''
    const parsedData = JSON.parse(data) as Page2Data
    visible.value = parsedData.visible
    isLoading.value = parsedData.isLoading
    console.log(visible.value)
    if (!parsedData.messages.length)
      return
    if (parsedData.messages[parsedData.messages.length - 1].role === 'ai') {
      messages.value = parsedData.messages.slice(0, -1)
      textAnimation(parsedData.messages.slice(-1)[0].content)
    }

    else {
      messages.value = parsedData.messages.slice()
    }
  })
})

function textAnimation(text: string) {
  htmlText.value = ''
  const strArr = text.replace(/\n/g, '<br />').split('')
  timer = setInterval(() => {
    htmlText.value += strArr.shift()
    // auto scroll
    if (wrapper$.value.scrollHeight > wrapper$.value.offsetHeight)
      wrapper$.value.scrollTop = Math.floor(wrapper$.value.scrollHeight)

    if (!strArr.length)
      clearInterval(timer)
  }, 80)
}
</script>

<template>
  <div relative h-100vh w-100vw bg="[url(@renderer/assets/main-bg-2.png)] center cover">
    <!-- 中心圆 -->
    <div a-center aspect-square w-200 opacity-80 bg="[url(@renderer/assets/round.png)] center contain no-repeat" />
    <!-- 左上角 -->
    <div
      absolute left-55 top-180 h-130 w-200
      bg="[url(@renderer/assets/kuang_move.png)] center contain no-repeat "
    >
      <img w="90%" mx-auto mt-20 src="@renderer/assets/03.gif" alt="">
    </div>
    <!-- 左下角 -->
    <div
      absolute left-30 top-470 h-110 w-160
      bg="[url(@renderer/assets/kuang_move.png)] center contain no-repeat "
    >
      <img w="90%" mx-auto mt-15 src="@renderer/assets/01.gif" alt="">
    </div>
    <!-- 右下角 -->
    <div
      absolute bottom-130 right-30 h-140 w-230
      bg="[url(@renderer/assets/kuang_move.png)] center contain no-repeat "
    >
      <img w="90%" mx-auto mt-15 src="@renderer/assets/02.gif" alt="">
    </div>
    <div
      a-center z-10 h-full w-full overflow-hidden backdrop-blur-6 transition-all-300
      :class="visible ? 'opacity-100' : 'opacity-0'"
      @click="visible = !visible"
    >
      <div
        bg="[url(@renderer/assets/big_kuang.png)] center contain no-repeat"
        :class="visible ? 'scale-100' : 'scale-120'" a-center h-58vh w-80vw px-30 py-30
        transition-all-300
      >
        <div ref="wrapper$" h-full w-full overflow-scroll>
          <ul text-2em>
            <li v-for="chat, idx in messages" :key="idx" mb-6 last:mb-0>
              <span mr-4>{{ chat.role === 'user' ? 'Q:' : 'A:' }}</span>
              <span style="line-height: 1;" v-html="chat.content.replace(/\n/g, '<br />')" />
            </li>
            <!-- 最后一个文本生成 -->
            <li v-if="htmlText">
              <span mr-4>A:</span>
              <span v-html="htmlText" />
            </li>
            <li v-show="isLoading">
              <span mr-4>A:</span>
              <span>正在生成</span>
              <div inline-block w-20 class="sk-three-bounce">
                <div inline-block class="sk-child" />
                <div inline-block class="sk-child sk-bounce-1" />
                <div inline-block class="sk-child sk-bounce-2" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sk-three-bounce {
  margin: auto;
  text-align: center;
  .sk-child {
    width: 0.5rem;
    height: 0.5rem;
    background-color: currentcolor;
    border-radius: 100%;
    display: inline-block;
    animation: sk-three-bounce 1.4s ease-in-out 0s infinite both;
    margin-left: 4px;
  }

  .sk-bounce-1 {
    animation-delay: -0.32s;
  }
  .sk-bounce-2 {
    animation-delay: -0.16s;
  }
}

@keyframes sk-three-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}
</style>
