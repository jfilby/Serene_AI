import { GoogleGeminiLlmService } from './llm-api'

// Services
const googleGeminiLlmService = new GoogleGeminiLlmService()

// Class
export class GoogleVertexEmbeddingsService {

  // Consts
  clName = 'GoogleVertexEmbeddingsService'

  // Code
  async requestBatchEmbeddings(texts: string[]) {

    // Debug
    const fnName = `${this.clName}.requestBatchEmbeddings()`

    // Get/create Gemini AI client
    // TOFIX: need to pass the model in the Gemini client instantiation: model: 'text-embedding-004'
    const geminiAiClient = await
            googleGeminiLlmService.getOrCreateClient(
              prisma,
              undefined)  // tech

    // Convert texts to requests
    var requests: any[] = []

    for (const text of texts) {

      requests.push({
        content: {
          role: 'user',
          parts: [{ text }]
        }
      })
    }

    // Make request
    const results = await geminiAiClient.batchEmbedContents({
      requests: requests
    })

    // Validate
    if (results.embeddings == null) {

      return {
        status: false,
        message: `results.embeddings == null`
      }
    }

    // Debug
    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Return
    return {
      status: true,
      embeddings: results.embeddings
    }
  }

  async requestEmbedding(text: string) {

    // Debug
    const fnName = `${this.clName}.requestEmbedding()`

    // Get/create Gemini AI client
    // TOFIX: need to pass the model in the Gemini client instantiation: model: 'text-embedding-004'
    const geminiAiClient = await
            googleGeminiLlmService.getOrCreateClient(
              prisma,
              undefined)  // tech

    // Make request
    const results = await geminiAiClient.embedContent(text)

    // Validate
    if (results.embedding == null) {

      return {
        status: false,
        message: `results.embedding == null`
      }
    }

    // Debug
    // console.log(`${fnName}: results: ` + JSON.stringify(results))

    // Return
    return {
      status: true,
      embedding: results.embedding
    }
  }
}
