import { Typography } from '@mui/material'

export default function ViewTextField({
                          label,
                          value,
                          style = {}
                        }) {

  // Render
  return (
    <div style={style}>
      <Typography
        variant='caption'>
        {label}
      </Typography>
      <Typography variant='body1'>
        {value}
      </Typography>
    </div>
  )
}
