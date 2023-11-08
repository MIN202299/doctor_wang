export interface Chat {
  role: 'user' | 'ai'
  content: string
}

export interface Page2Data {
  isLoading: boolean
  messages: Chat[]
  visible: boolean
}
