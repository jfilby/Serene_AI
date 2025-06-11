export interface ChatMessage {
  type: string
  text: string
}

export class ServerOnlyTypes {

  // Google Gemini message roles
  static geminiUserMessageRole = 'user'
  static geminiModelMessageRole = 'model'

  // OpenAI message roles
  static chatGptAssistantMessageRole = 'assistant'
  static chatGptModelMessageRole = 'model'
  static chatGptUserMessageRole = 'user'
  static chatGptSystemMessageRole = 'system'

  // Tech
  static apolloIoApi = 'Apollo.io API'
  static restApi = 'REST API'
}
