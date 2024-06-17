import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getChatSessionsQuery } from '@/apollo/chats'
import { Divider, Typography } from '@mui/material'

interface Props {
  instanceId: string
  status: string
  userProfileId: string
}

export default function ChatSessionsList({
                          instanceId,
                          status,
                          userProfileId
                        }: Props) {

  // State
  const [chatSessions, setChatSessions] = useState<any[] | undefined>(undefined)

  // GraphQL
  const [fetchGetChatSessionsQuery] =
    useLazyQuery(getChatSessionsQuery, {
      fetchPolicy: 'no-cache'
      /* onCompleted: data => {
        console.log('elementName: ' + elementName)
        console.log(data)
      },
      onError: error => {
        console.log(error)
      } */
    })

  // Functions
  async function getInstances() {

    // Query
    const getChatSessionsData =
      await fetchGetChatSessionsQuery(
        {
          variables: {
            instanceId: instanceId,
            status: status,
            userProfileId: userProfileId
          }
        })

        setChatSessions(getChatSessionsData.data.getChatSessions)
  }

  // Effects
  useEffect(() => {

    const fetchData = async () => {
      await getInstances()
    }

    // Async call
    const result = fetchData()
      .catch(console.error)

  }, [])

  // Render
  return (
    <div>
      <Divider variant='fullWidth' />

      {chatSessions != null ?
        <>
          {chatSessions.length > 0 ?
            <>
              {chatSessions.map(chatSession => (
                <>
                  <Typography
                    style={{ marginBottom: '0.5em' }}
                    variant='body1'>
                    {chatSession.name}
                  </Typography>

                  <Divider />
                </>
              ))}
            </>
          :
            <Typography
              style={{ marginTop: '2em' }}
              variant='body1'>
              No chats to list.
            </Typography>
          }
        </>
      :
        <></>
      }
    </div>
  )
}
