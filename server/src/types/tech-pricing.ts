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
    [AiTechDefs.chatGpt4o + `/${this.paid}/${this.text}`]: {
      inputTokens: 1.25,
      outputTokens: 5.00
    },

    // Gemini: https://ai.google.dev/gemini-api/docs/pricing
    [AiTechDefs.googleGeminiV2Flash + `/${this.free}/${this.text}`]: {
      inputTokens: 0.00,
      outputTokens: 0.00
    },
    [AiTechDefs.googleGeminiV2Flash + `/${this.paid}/${this.text}`]: {
      inputTokens: 0.10,
      outputTokens: 0.40
    }
  }
}
