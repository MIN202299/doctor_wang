<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'

function debounce(fn: (...args: any[]) => any, delay: number) {
  let timer: NodeJS.Timeout
  return function (...args: any[]) {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
const fitWindow = debounce(setFont, 50)
function setFont() {
  const normal_size = 1920
  document.documentElement.style.fontSize = `${window.innerWidth / normal_size * 16}px`
}

onMounted(() => {
  window.addEventListener('resize', fitWindow)
  setFont()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', fitWindow)
})
</script>

<template>
  <router-view />
</template>
