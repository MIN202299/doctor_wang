import process from 'node:process'
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 主屏点击初始提示词
  sendButtonText: (text) => {
    ipcRenderer.send('button_is_clicked', text)
  },
  // 大语言返回的结果
  onDataGet: (text) => {
    ipcRenderer.send('data_get', text)
  },
  // 打开屏幕键盘
  openKeyboard() {
    ipcRenderer.send('open-original-keyboard')
  },
  // 关闭屏幕键盘
  closeKeyboard() {
    ipcRenderer.send('close-original-keyboard')
  },
  // 副屏按钮点击prompt监听
  onListenIsClick(cb) {
    ipcRenderer.on('isclick', cb)
  },
  // 副屏收到结果的监听
  onListenDataGet(cb) {
    ipcRenderer.on('data_is_com', cb)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  }
  catch (error) {
    console.error(error)
  }
}
else {
  window.electron = electronAPI
  window.api = api
}
