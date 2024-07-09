import { CustomError } from '@/serene-core-server/types/errors'
import { ServerOnlyTypes } from '../../../types/server-only-types'

export class OpenAiLlmUtilsService {

  // Consts
  clName = 'OpenAiLlmUtilsService'

  // Code
  buildMessagesWithRoles(
    chatMessages: any[],
    fromContents: any,
    userChatParticipantIds: string[],
    agentChatParticipantIds: string[]) {

    // Debug
    const fnName = `${this.clName}.buildMessagesWithRoles()`

    /* console.log(`${fnName}: chatMessages: ` + JSON.stringify(chatMessages))

    console.log(`${fnName}: userChatParticipantIds: ` +
                JSON.stringify(userChatParticipantIds))

    console.log(`${fnName}: agentChatParticipantIds: ` +
                JSON.stringify(agentChatParticipantIds)) */

    // Messages var
    var messagesWithRoles: any[] = []

    // If this is the first message, then add a system prompt
    if (chatMessages.length === 0) {
      messagesWithRoles.push()
    }

    // Build messages with roles
    for (const chatMessage of chatMessages) {

      // Determine the role
      var role: string = ''

      if (userChatParticipantIds.includes(chatMessage.fromChatParticipantId)) {
        role = ServerOnlyTypes.chatGptUserMessageRole
      } else if (agentChatParticipantIds.includes(chatMessage.fromChatParticipantId)) {
        role = ServerOnlyTypes.chatGptModelMessageRole
      } else {
        throw new CustomError(
          `${fnName}: unhandled chatMessage.fromChatParticipantId: ` +
          chatMessage.fromChatParticipantId)
      }

      // Validate
      if (chatMessage.sentByAi) {

        if (chatMessage.sentByAi === true &&
            role !== ServerOnlyTypes.chatGptModelMessageRole) {

          throw new CustomError(
                      `${fnName}: chatMessage.sentByAi === true, but ` +
                      `role !== ServerOnlyTypes.chatGptModelMessageRole ` +
                      `for chatMessage: ${JSON.stringify(chatMessage)}`)
        }

        if (chatMessage.sentByAi === false &&
            role !== ServerOnlyTypes.chatGptUserMessageRole) {

          throw new CustomError(
                      `${fnName}: chatMessage.sentByAi === false, but ` +
                      `role !== ServerOnlyTypes.chatGptUserMessageRole ` +
                      `for chatMessage: ${JSON.stringify(chatMessage)}`)
        }
      }

      // Add chat message
      messagesWithRoles.push({
        role: role,
        parts: JSON.parse(chatMessage.message)
      })
    }

    // Add latest message from the user
    messagesWithRoles.push({
      role: ServerOnlyTypes.chatGptUserMessageRole,
      parts: fromContents
    })

    // Return
    return messagesWithRoles
  }

  buildMessagesWithRolesForSinglePrompt(prompt: string) {

    // Debug
    const fnName = `${this.clName}.buildMessagesWithRolesForSinglePrompt()`

    // Messages var
    var messagesWithRoles: any[] = []

    // Add a system prompt
    messagesWithRoles.push()

    // Determine the role
    var role: string = ''

    role = ServerOnlyTypes.chatGptUserMessageRole

    // Add chat message
    messagesWithRoles.push({
      role: role,
      parts: [{ text: prompt }]
    })

    // Return
    return messagesWithRoles
  }
}
