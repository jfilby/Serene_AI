import ReactMarkdown from 'react-markdown'
import { Typography } from '@mui/material'

interface Props {
  label: string
  value: string
  style?: any
}

export default function ViewMarkdownField({
                          label,
                          value,
                          style = {}
                        }: Props) {

  // Render
  return (
    <div style={style}>
      <Typography
        variant='caption'>
        {label}
      </Typography>

      <div style={{ marginTop: '-1em' }}>
        <ReactMarkdown>
          {value}
        </ReactMarkdown>
      </div>
    </div>
  )
}
