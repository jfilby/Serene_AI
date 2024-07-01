import { Link, Typography } from '@mui/material'

export default function ViewLinkField({
                          label,
                          href,
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
        <Link href={href}>
          {value}
        </Link>
      </Typography>
    </div>
  )
}
