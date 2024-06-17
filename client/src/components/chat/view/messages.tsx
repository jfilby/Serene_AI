const { v4: uuidv4 } = require('uuid')
import { useLayoutEffect, useRef } from 'react'
import { LinearProgress, List } from '@mui/material'
import Message from './message'

interface Props {
  messages: any[]
  myTurn: boolean
  userProfileId: string
}

export default function ChatSessionMessages({
                          messages,
                          myTurn,
                          userProfileId
                        }: Props) {

  // Use of a ref and useLayoutEffect to scroll to the bottom on new messages.
  // Source: https://stackoverflow.com/a/73094341

  // Refs
  const bottomRef = useRef<null | HTMLDivElement>(null)

  // Effects
  useLayoutEffect(() => {

    // Only once there's at least 1 message
    if (messages.length === 0) {
      return
    }

    // Scroll to the bottom of the chat
    setTimeout(function () {
      if (bottomRef.current) {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight
      }
    }, 10)
  }, [messages])

  // Render
  return (
    <div style={{ height: '100%', marginBottom: '1em', overflowY: 'auto' }} ref={bottomRef}>
      <List>
        {messages ?
          <>
            {messages.map(function(message: any, index: number) {
              return (
                <Message
                  key={uuidv4()}
                  message={message} />
              )
            })}
          </>
        :
          <></>
        }
        {myTurn === false ?
          <LinearProgress style={{ marginTop: '1em', marginRight: '0.5em' }} />
        :
          <></>
        }
      </List>
    </div>
  )
}
