import { CustomError } from '../../types/errors'
import { AiTechDefs } from '../../types/tech-defs'
import { LlmCacheModel } from '../../models/cache/llm-cache-model'
import { DetectContentTypeService } from '../content/detect-content-type-service'
import { GoogleGeminiLlmService } from './google-gemini/llm-api'

export class ChatService {

  // Consts
  clName = 'ChatService'

  // Models
  llmCacheModel = new LlmCacheModel()

  // Services
  detectContentTypeService = new DetectContentTypeService()
  googleGeminiLlmService = new GoogleGeminiLlmService()

  // Code
  cleanMultiLineFormatting(messages: string[]) {

    const contents: string[] = messages.join('\n').split('\n')
    var newContents: string[] = []

    for (const content of contents) {

      if (content.length < 3) {
        newContents.push(content)
      } else {
        // Check for leading chars with a space, e.g. `- ` and `o `
        if (this.isAlphaNumeric(content[0]) === false &&
            content[1] === ' ') {

          newContents.push(content.slice(2))
          continue
        }

        newContents.push(content)
      }
    }

    return newContents
  }

  convertToGenericMessageFormat(messages: any) {

    // Debug
    const fnName = `${this.clName}.convertToGenericMessageFormat()`

    // Convert
    var newMessages: any[] = []

    for (const message of messages) {

      // Try to determine the message type
      const type = this.detectContentTypeService.detect(message)

      // Add new message
      newMessages.push({
        type: type,
        text: message
      })
    }

    // Return
    return newMessages
  }

  isAlphaNumeric(chr: string) {

    // chr is a string that is meant to represent a single char
    const code = chr.charCodeAt(0)

    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false
    }

    return true
  }

  async llmRequest(
          agent: any,
          messagesWithRoles: any[],
          systemPrompt: string | undefined = undefined,
          jsonMode: boolean = false) {

    // Debug
    const fnName = `${this.clName}.llmRequest()`

    // Get the messages as a lowercase string
    const lowerMessagesStr = JSON.stringify(messagesWithRoles).toLowerCase()

    /* Try the cache
    const llmCache = await
            this.llmCacheModel.getByKey(
              prisma,
              lowerMessagesStr)

    if (llmCache != null) {
      return llmCache.value.split('\n')
    } */

    // Tech
    const tech = {
      variantName: AiTechDefs.defaultChatVariantName
    }

    const prepareMessagesResults =
            this.googleGeminiLlmService.prepareMessages(
              tech,
              agent.name,
              agent.role,
              systemPrompt,
              messagesWithRoles,
              false)  // anonymize

    // Gemini LLM request
    const results = await
            this.googleGeminiLlmService.sendChatMessages(
              tech,
              prepareMessagesResults.messages,
              jsonMode)

    // Get result output as a string
    var messageText = ''

    if (results != null) {

      for (const message of results.messages) {

        if (messageText.length > 0) {
          messageText += '\n'
        }

        messageText += message
      }

      /* Add to the cache
      this.llmCacheModel.upsert(
        prisma,
        undefined,  // id
        lowerMessagesStr,
        messageText) */

      // Convert to generic message format
      results.messages = this.convertToGenericMessageFormat(results.messages)
    } else {
      throw new CustomError(`${fnName}: results == null`)
    }

    // Return
    return results
  }
}
