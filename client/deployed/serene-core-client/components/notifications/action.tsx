import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'

export default function ActionNotification({ message, autoHideDuration, notificationOpened, setNotificationOpened }) {

  const handleNotificationClose =
    (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }

      // setOpened(false)
      setNotificationOpened(false)
    }

  const notificationAction = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleNotificationClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  return (
    <>
      <Snackbar
        open={notificationOpened}
        autoHideDuration={autoHideDuration}
        onClose={handleNotificationClose}
        message={message}
        action={notificationAction} />
    </>
  )
}
