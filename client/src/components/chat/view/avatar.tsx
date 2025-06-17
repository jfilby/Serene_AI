import { Avatar } from '@mui/material'
import { deepOrange, deepPurple } from '@mui/material/colors'

interface Props {
  from: string
}

export default function MessageAvatar({ from }: Props) {

  // Functions
  const renderSwitch = () => {

    // Render switch in a function: https://stackoverflow.com/a/52618847
    switch (from) {

      case undefined:
      case `User`:
        return <Avatar sx={{ bgcolor: deepPurple[500] }}>You</Avatar>

      default:
        return <Avatar sx={{ bgcolor: deepOrange[500] }}>
            {from.substring(0, 2).toUpperCase()}
          </Avatar>
    }
  }

  // Render
  return (
    <span>
      {/* <p>from: {JSON.stringify(from)}</p> */}
      {renderSwitch()}
    </span>
  )
}
