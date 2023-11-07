<script lang="ts" setup>
import CustomScrollbar from 'custom-vue-scrollbar'
import { onMounted, ref } from 'vue'
import BScroll from '@better-scroll/core'

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

onMounted(() => {
  // custom scrollbar
  const wrapper = document.querySelector('.scrollbar__scroller') as any
  const bs = new BScroll(wrapper, {})
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
</script>

<template>
  <div grid-center h-100vh w-100vw bg="[url(@renderer/assets/main-bg-1.png)] center cover">
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
              @click="active = Number(key)"
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
        <input
          flex="~ 1"
          bg="[url(@renderer/assets/input_chose.png)] contain no-repeat red/0"
          class="focus:bg-[url(@renderer/assets/input_show0.png)]"
          h-full items-center pl-10 text-6 outline-none placeholder:text-gray
          type="text"
          placeholder="请输入你的问题"
          @focus="focus = true"
          @blur="focus = false"
        >
        <div
          grid-center
          h-full w-40 shrink-0 items-center
          bg="[url(@renderer/assets/button_sma.png)] no-repeat right"
          style="background-size: 100% 100%;"
        >
          <div a-center bg="[url(@renderer/assets/key_show_sma.png)] center contain no-repeat" h-full w-10 />
        </div>
      </div>
    </div>
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
