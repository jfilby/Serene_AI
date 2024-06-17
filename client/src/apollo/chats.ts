import { gql } from '@apollo/client'

export const getOrCreateChatSessionMutation = gql`
  mutation getOrCreateChatSession(
             $chatSessionId: String,
             $prompt: String,
             $userProfileId: String!) {
    getOrCreateChatSession(
      chatSessionId: $chatSessionId,
      prompt: $prompt,
      userProfileId: $userProfileId) {

      status
      message
      chatSession {
        id
        status
        chatParticipants {
          id
          userProfileId
          name
        }
      }
    }
  }
`

export const getChatMessagesQuery = gql`
  query getChatMessages(
          $chatSessionId: String,
          $userProfileId: String!,
          $lastMessageId: String) {
    getChatMessages(
      chatSessionId: $chatSessionId,
      userProfileId: $userProfileId,
      lastMessageId: $lastMessageId) {

      status
      message
      chatMessages {
        id
        name
        message
        created
        updated
      }
    }
  }
`

export const getChatParticipantsQuery = gql`
  query getChatParticipants(
          $chatSessionId: String,
          $userProfileId: String!) {
    getChatParticipants(
      chatSessionId: $chatSessionId,
      userProfileId: $userProfileId) {

      status
      message
      chatParticipants {
        id
        userProfileId
        name
      }
    }
  }
`

export const getChatSessionQuery = gql`
  query getChatSession(
          $chatSessionId: String,
          $userProfileId: String!) {
    getChatSession(
      chatSessionId: $chatSessionId,
      userProfileId: $userProfileId) {

      status
      message
      chatSession {
        id
        status
        chatParticipants {
          id
          userProfileId
          name
        }
      }
    }
  }
`

export const getChatSessionsQuery = gql`
  query getChatSessions(
          $status: String,
          $userProfileId: String!) {
    getChatSessions(
      status: $status,
      userProfileId: $userProfileId) {

      id
      status
      chatParticipants {
        id
        userProfileId
        name
      }
    }
  }
`
