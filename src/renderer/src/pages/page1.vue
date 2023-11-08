<script lang="ts" setup>
import CustomScrollbar from 'custom-vue-scrollbar'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import BScroll from '@better-scroll/core'
import axios from 'axios'
import type { Page2Data } from '../types'

// 谦贞测试用户ID
const TEST_UER_ID = 40
// 模型ID
const MODEL_ID = {
  AGREEMENT: 85, // 合同
  LEAVE_LETTER: 86, // 请假条
  LEGAL_LETTER: 87, // 律师函
  NOTICE_OF_HOLIDAYS: 88, // 放假通知
  AIGC_POLICY: 89, // AIGC政策
  POETRY_TO_ENGLISH: 90, // 静夜思改写英文
  GENERAL_MODEL: 91, // 通用模型
}

const PROMPTS = {
  [MODEL_ID.AGREEMENT]: '请帮我制定一份劳动合同?',
  [MODEL_ID.LEAVE_LETTER]: '请帮我写一张元旦请假条?',
  [MODEL_ID.LEGAL_LETTER]: '请帮我草拟一份律师函?',
  [MODEL_ID.NOTICE_OF_HOLIDAYS]: '请帮我写一份2024年元旦放假通知?',
  [MODEL_ID.AIGC_POLICY]: '请帮我制定一份杭州滨江区扶持AIGC生成式人工智能创新创业公司的政策?',
  [MODEL_ID.POETRY_TO_ENGLISH]: '请将古诗《静夜思》的情景扩写成一篇短的英文科幻故事?',
}

const active = ref(-1)
const focus = ref(false)
const input$ = ref<HTMLInputElement>(null!)
const content = ref('')
const page2Data = reactive<Page2Data>({
  messages: [],
  visible: false,
  isLoading: false,
})

let token

onMounted(() => {
  // custom scrollbar
  const wrapper = document.querySelector('.scrollbar__scroller') as any
  const bs = new BScroll(wrapper, {})
  getToken().then((res) => {
    token = res
  })
})

function customScrollBarStyle() {
  if (!focus.value) {
    return {
      height: 'calc(100% - 0px)',
      opacity: '1',
      transition: 'all 300ms',
    }
  }
  else {
    return {
      opacity: '0',
      transition: 'all 300ms',
    }
  }
}
let timer
function handleSend() {
  timer && clearTimeout(timer)
  input$.value.focus()
  if (!content.value)
    return
  page2Data.visible = true
  page2Data.isLoading = true
  page2Data.messages.push({ role: 'user', content: content.value })
  sendPostRequest(active.value, content.value)
  content.value = ''
}

function delayBlur() {
  timer = setTimeout(() => {
    focus.value = false
    content.value = ''
  }, 150)
}

function autoSend(e: KeyboardEvent) {
  if (e.key === 'Enter')
    handleSend()
}
async function sendPostRequest(modelId, content = '') {
  const params = new URLSearchParams()
  params.append('id', modelId)
  params.append('user_id', TEST_UER_ID.toString())
  content && params.append('content', content)
  if (!token)
    token = await getToken()

  const config = {
    url: 'http://api.mpw.ai:9023/api/chat/completiontest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': token,
    },
    data: params,
  }
  // console.log(params)

  axios(config)
    .then(async (response) => {
      // 出现错误可能是token失效
      if (response.data.error) {
        token = await getToken()
        return
      }
      // 更换模型了，结果意义
      if (active.value !== modelId)
        return
      const reply = response.data.data.reply
      page2Data.isLoading = false
      page2Data.messages.push({ role: 'ai', content: reply })
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
    })
}

async function getToken() {
  const params = new URLSearchParams()
  params.append('category', '1')
  params.append('telephone', '66666666666')
  params.append('password', 'binjiang666')
  const res = await axios.post('http://api.mpw.ai:9023/api/login', params)
  return `Bearer ${res.data.data.token}`
}

function handleBack() {
  // 防止请求未完成
  active.value = -1
  page2Data.isLoading = false
  page2Data.visible = false
  page2Data.messages = []
}

function setFocus() {
  console.log('set focus')
  input$.value.focus()
}

function handleClick(id: number) {
  active.value = -1
  nextTick(() => {
    active.value = id
  })
}

watch(focus, (val) => {
  val && (active.value = MODEL_ID.GENERAL_MODEL)
  val ? (window as any).api.openKeyboard() : (window as any).api.closeKeyboard()
})

watch(active, (val) => {
  if (val > 0) {
    if (val === MODEL_ID.GENERAL_MODEL) {
      page2Data.isLoading = false
      page2Data.visible = false
      page2Data.messages = []
    }
    else {
      sendPostRequest(val)
      page2Data.isLoading = true
      page2Data.visible = true
      page2Data.messages = [{
        role: 'user',
        content: PROMPTS[val],
      }]
    }
  }
  else {
    page2Data.isLoading = false
    page2Data.visible = false
    page2Data.messages = []
  }
}, { immediate: true })

watch(page2Data, (val) => {
  ;(window as any).api.onDataGet(JSON.stringify(val))
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <div relative grid-center h-100vh w-100vw bg="[url(@renderer/assets/main-bg-1.png)] center cover">
    <!-- prompts -->
    <div relative h-70vh w-70vw px-30 py-25>
      <div h-full w-full :style="customScrollBarStyle()" :class="focus ? 'pointer-events-none' : 'pointer-events-auto'">
        <CustomScrollbar :style="{ height: 'calc(100% - 0px)' }" :thumb-width="8">
          <div w-full>
            <div
              v-for="val, key in PROMPTS"
              :key="key"
              bg="contain no-repeat center"
              mt-4 h-18 flex select-none items-center pl-10 text-6 font-bold
              :class="active === Number(key) ? 'bg-[url(@renderer/assets/button_on.png)]' : 'bg-[url(@renderer/assets/button_chose.png)]'"
              class="hover:bg-[url(@renderer/assets/button_on.png)]"
              @click="handleClick(Number(key))"
            >
              {{ val }}
            </div>
          </div>
        </CustomScrollbar>
      </div>
      <div
        left="1/2"
        translate-x="-1/2"
        absolute
        bottom-0
        h-16 w-full
        flex px-30
        transition-all-300
        :class="focus ? '-translate-y-135' : ''"
      >
        <div relative flex="~ 1">
          <input
            ref="input$"
            v-model="content"
            bg="[url(@renderer/assets/input_chose.png)] contain no-repeat red/0"
            class="focus:bg-[url(@renderer/assets/input_show0.png)]"
            h-full w-full cursor-default items-center pl-10 text-6 outline-none placeholder:text-gray
            type="text"
            placeholder="请输入你的问题"
            @focus="focus = true"
            @blur="delayBlur"
            @keydown="autoSend"
          >
          <div absolute right-8 top-0 aspect-square h-full p-3 @click="handleSend">
            <div h-full bg="[url(@renderer/assets/text_send.png)] contain no-repeat" />
          </div>
        </div>
        <div
          relative
          grid-center
          h-full w-40 shrink-0 items-center
          bg="[url(@renderer/assets/button_sma.png)] no-repeat right"
          style="background-size: 100% 100%;"
          @click="setFocus"
        >
          <div a-center bg="[url(@renderer/assets/key_show_sma.png)] center contain no-repeat" h-full w-10 />
        </div>
      </div>
    </div>
    <!-- 返回按钮 -->
    <div
      absolute left-20 top="1/2" translate-y="-1/2" aspect-square w-10
      bg="[url(@renderer/assets/back-btn.png)] contain center no-repeat"
      @click="handleBack"
    />
  </div>
</template>

<style lang="scss" scoped>
// 覆写custom scrollbar 样式
:deep(.scrollbar__wrapper) {
  height: 100%;
}
// Beautiful Scroll 不兼容 CustomScrollbar, 所以隐藏触控条
:deep(.scrollbar__thumb) {
  background-color: rgba(255,255,255,0);
}
</style>
