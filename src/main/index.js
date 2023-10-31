import path, { join } from 'node:path'
import process from 'node:process'
import childProcess from 'node:child_process'
import { BrowserWindow, app, ipcMain, screen, shell } from 'electron'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const isDev = process.env.NODE_ENV === 'development'
const cwd = isDev ? path.resolve(__dirname, '../../resources/scripts/') : path.resolve(app.getAppPath(), '../scripts/')
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    fullscreen: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  isDev && mainWindow.webContents.toggleDevTools()
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  let otherWindow
  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  const root = process.env.ELECTRON_RENDERER_URL
  if (externalDisplay) {
    otherWindow = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      autoHideMenuBar: true,
      show: false,
      fullscreen: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false,
      },
    })
    otherWindow.on('closed', () => {
      otherWindow = null
    })
  }
  otherWindow.on('ready-to-show', () => {
    otherWindow.show()
  })
  isDev && otherWindow.webContents.toggleDevTools()
  // double screen communte
  ipcMain.on('data_get', (_, message) => {
    if (mainWindow) {
      console.log(`datais com${message}`)
      otherWindow.webContents.send('data_is_com', message)
    }
  })
  ipcMain.on('button_is_clicked', (_, message) => {
    if (mainWindow) {
      console.log(`is clicked ${message}`)
      otherWindow.webContents.send('isclick', message)
    }
  })

  ipcMain.on('open-original-keyboard', () => {
    console.log('open')
    childProcess.exec('start osk.exe', { cwd }, (err) => {
      console.log(err)
    })
  })
  ipcMain.on('close-original-keyboard', () => {
    console.log('close')
    // 关闭屏幕键盘需要管理员权限
    // 没有管理员权限无法正常执行
    childProcess.exec('taskkill /f /im osk.exe', { cwd }, (err) => {
      console.log(err)
    })
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    otherWindow.loadURL(`${root}/#/page2`)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    otherWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: 'page2',
    })
  }
  // fix cors error
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, cb) => {
    console.log('mainWindow', details)
    cb({
      requestHeaders: { Origin: '*', ...details.requestHeaders },
    })
  })
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, cb) => {
    console.log('mainWindow', details)
    cb({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        // We use this to bypass headers
        'Access-Control-Allow-Headers': ['*'],
        ...details.responseHeaders,
      },
    })
  })
  if (otherWindow) {
    otherWindow.webContents.session.webRequest.onBeforeSendHeaders((details, cb) => {
      cb({
        requestHeaders: { Origin: '*', ...details.requestHeaders },
      })
    })
    otherWindow.webContents.session.webRequest.onHeadersReceived((details, cb) => {
      cb({
        responseHeaders: {
          'Access-Control-Allow-Origin': ['*'],
          // We use this to bypass headers
          'Access-Control-Allow-Headers': ['*'],
          ...details.responseHeaders,
        },
      })
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
