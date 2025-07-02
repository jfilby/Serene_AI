const { GoogleGenerativeAI } = require('@google/generative-ai')

export class GoogleVertexEmbeddingService {

  // Consts
  clName = 'GoogleVertexEmbeddingService'

  genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_FREE_API_KEY)

  model = this.genAI.getGenerativeModel({
    model: 'text-embedding-004',
  })

  // Code
  async requestBatchEmbeddings(texts: string[]) {

    // Debug
    const fnName = `${this.clName}.requestBatchEmbeddings()`

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
    const results = await this.model.batchEmbedContents({
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

    // Make request
    const results = await this.model.embedContent(text)

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
