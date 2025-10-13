import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Alert, Typography } from '@mui/material'
import { getOrCreateChatSessionMutation } from '../../../apollo/chats'

interface Props {
  chatSessionId: string
  userProfileId: string
  setChatSession: any
}

export default function AddChatSession({
                          chatSessionId,
                          userProfileId,
                          setChatSession
                        }: Props) {

  // State
  const [alertSeverity, setAlertSeverity] = useState<any>(undefined)
  const [message, setMessage] = useState<string>('')

  // GraphQL
  const [sendGetOrCreateChatSessionMutation] =
    useMutation(getOrCreateChatSessionMutation, {
      /* onCompleted: data => {
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getOrCreateChatSession() {

    // Send GraphQL request to create the workbook
    var getOrCreateChatSessionData: any = undefined

    await sendGetOrCreateChatSessionMutation({
      variables: {
        chatSessionId: chatSessionId,
        // chatSettingsId: chatSettingsId,
        userProfileId: userProfileId
      }
    }).then((result: any) => getOrCreateChatSessionData = result)

    // Process the results
    const results = getOrCreateChatSessionData.data.getOrCreateChatSession

    if (results.status === true) {

      // Success
      setAlertSeverity(undefined)
      setMessage('')

      // Set the chatSession
      // console.log(`results.chatSession: ` +
      //             JSON.stringify(results.chatSession))

      setChatSession(results.chatSession)
    } else {
      // Error
      setAlertSeverity('error')
      setMessage(results.message)
    }
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {

      // Get/create chat session
      await getOrCreateChatSession()
    }

    // Get async results
    const result = fetchData()
      .catch(console.error)
  }, [])

  // Render
  return (
    <>
      {alertSeverity && message ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
        :
        <></>
      }

      <Typography variant='body1'>
        Loading chat session..
      </Typography>
    </>
  )
}
