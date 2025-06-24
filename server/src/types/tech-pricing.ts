import { AiTechDefs } from './tech-defs'

export class AiTechPricing {

  // Paid/free tiers
  static free = 'free'
  static paid = 'paid'

  // Resource type
  static text = 'text'

  // Pricing list
  // Key format: <variantName>/<paid or free>/<text, audio, etc>
  static pricing = {

    // OpenAI: https://platform.openai.com/docs/pricing
    // ChatGPT4o (gpt-4o-2024-08-06) / paid / text
    [AiTechDefs.chatGpt4o + `/${this.paid}/${this.text}`]: {
      inputTokens: 2.50,
      outputTokens: 10.00
    },

    // Gemini: https://ai.google.dev/gemini-api/docs/pricing
    // Gemini 2.0 Flash / free / text
    [AiTechDefs.googleGeminiV2Flash + `/${this.free}/${this.text}`]: {
      inputTokens: 0.00,
      outputTokens: 0.00
    },
    // Gemini 2.0 Flash / paid / text
    [AiTechDefs.googleGeminiV2Flash + `/${this.paid}/${this.text}`]: {
      inputTokens: 0.10,
      outputTokens: 0.40
    }
  }
}
