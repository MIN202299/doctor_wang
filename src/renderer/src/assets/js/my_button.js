// const { ipcRenderer } = require('electron');

// import sendPostRequest from '../request_api/request_api.js'

var axios = require('axios')
const { ipcRenderer } = require('electron')
const buttons = document.querySelectorAll('.transparent-button')
const text_in = document.getElementById('text_get')
const page1 = document.getElementById('page1')
const page2 = document.getElementById('page2')
const sma_img = document.getElementById('key_sma')
const page3 = document.getElementById('page3')

// const button_sm = document.getElementById('key_buttton')

// var bouth_val

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
    //����API����
    sendPostRequest(buttonText)
  })
})

text_in.addEventListener('click', () => {
  // ������ť���ֺ���Ч��
  // ����������л���ť����ʽ�����?/���ذ�ť
  // �л�ҳ�����������������Ч��??
  page1.classList.add('hidden')
  page2.style.transform = 'translateY(-560px)'
  sma_img.style.transform = 'translateY(15px)'
  page3.classList.add('visible')
  // ���������??
})
document.addEventListener('click', (event) => {
  const mouseX = event.clientX // ��ȡ�����λ�õ�X����
  const mouseY = event.clientY // ��ȡ�����λ�õ�Y����

  if (mouseX <= 400 || mouseX >= 1500 || mouseY <= 100 || mouseY >= 900) {
    page2.style.transform = 'translateY(0)'
    page2.style.transform = 'translateX(-10px)'
    page1.classList.remove('hidden')
    sma_img.style.transform = 'translateY(0)'
    page3.classList.remove('visible')
  }
})

function sendPostRequest(data_in) {
  const params = new URLSearchParams() // ????????
  params.append('id', 23) // ???????
  params.append('content', data_in) // ???????
  params.append('user_id', 6) // ???????
  var config = {
    method: 'POST',
    url: 'http://api.mpw.ai:9023/api/chat/completiontest',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      //   ...data.getHeaders()
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
      ipcRenderer.send('button-clicked', extractedText)
    })
    .catch(function (error) {
      console.log(error)
    })
}
