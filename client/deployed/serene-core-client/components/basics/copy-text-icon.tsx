import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { IconButton, Tooltip } from '@mui/material'

interface Props {
  text: string
  title?: string
}

export default function CopyTextIcon({
                          text,
                          title = 'Copy'
                        }: Props) {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  // Render
  return (
    <Tooltip title={title}>
      <IconButton onClick={(e) => handleCopy()} size='small'>
        <ContentCopyIcon fontSize='small' />
      </IconButton>
    </Tooltip>
  )
}
