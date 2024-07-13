import ViewTextField from '@/serene-core-client/components/basics/view-text-field'
import { Card, CardContent, Typography } from '@mui/material'

interface Props {
  chatSession: any
}

export default function ViewChatSessionCard({
                          chatSession
                        }: Props) {

  // Render
  return (
    <div>
      {chatSession != null ?
        <Card>
          <CardContent>
            <Typography
              style={{ marginBottom: '0.5em' }}
              variant='h6'>
              {chatSession.name}
            </Typography>

            {chatSession.userProfile.user.name != null &&
             chatSession.userProfile.user.name !== '' ?
              <ViewTextField
                label='Description'
                value={chatSession.userProfile.user.name}
                style={{ marginBottom: '0.5em' }} />
            :
              <></>
            }
          </CardContent>
        </Card>
      :
        <></>
      }
    </div>
  )
}
