import { SereneCoreServerTypes } from '@/serene-core-server/types/user-types'
import { AiTechDefs } from './tech-defs'

export class AiTechPricing {

  // Resource type
  static text = 'text'

  // Pricing list
  // Key format: <variantName>/<paid or free>/<text, audio, etc>
  static pricing = {

    // Mocked
    [AiTechDefs.mockedLlmPaid + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 1.00,
      outputTokens: 1.00
    },

    // OpenAI: https://platform.openai.com/docs/pricing
    // GPT4o (gpt-4o-2024-08-06) / paid / text
    [AiTechDefs.openAi_Gpt4o + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 2.50,
      outputTokens: 10.00
    },
    // GPT4.1 / paid / text
    [AiTechDefs.openAi_Gpt4pt1 + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 2.00,
      outputTokens: 8.00
    },
    // o4-mini / paid / text
    [AiTechDefs.openAi_O4Mini + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 1.10,
      outputTokens: 4.40
    },
    // o3 / paid / text
    [AiTechDefs.openAi_O3 + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 2.00,
      outputTokens: 8.00
    },

    // Gemini: https://ai.google.dev/gemini-api/docs/pricing
    // Gemini 2.0 Flash / free / text
    [AiTechDefs.googleGemini_V2Flash + `/${SereneCoreServerTypes.free}/${AiTechPricing.text}`]: {
      inputTokens: 0.00,
      outputTokens: 0.00
    },
    // Gemini 2.0 Flash / paid / text
    [AiTechDefs.googleGemini_V2Flash + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 0.10,
      outputTokens: 0.40
    },
    // Gemini 2.5 Pro / paid / text
    [AiTechDefs.googleGemini_V2pt5Pro + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: [{
      inputTokens: 1.25,
      outputTokens: 10.00,
      tokensLte: 200_000
    },
    {
      inputTokens: 2.50,
      outputTokens: 15.00,
      tokensGt: 200_000
    }],
    // Gemini 2.5 Flash / paid / text
    [AiTechDefs.googleGemini_V2pt5Flash + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 0.30,
      outputTokens: 2.50
    },
    // Gemini 2.5 Flash-Lite / paid / text
    [AiTechDefs.googleGemini_V2pt5FlashLite + `/${SereneCoreServerTypes.paid}/${AiTechPricing.text}`]: {
      inputTokens: 0.10,
      outputTokens: 0.40
    },
  }
}
