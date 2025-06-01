import { Button, ButtonProps, styled } from '@mui/material'
import { grey } from '@mui/material/colors'

interface Props {
  icon: any
  label: string
  onClick: any
  color?: string
  textColor?: string
  backgroundColor?: string
  style?: any
}

export default function LabeledIconButton({
                          icon,
                          label,
                          onClick,
                          color = grey[700],
                          textColor = grey[500],
                          backgroundColor = grey[100],
                          style = {}
                        }: Props) {

  // Consts
  const Icon = icon

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: color,
    backgroundColor: 'transparent',
    '&:hover': {
      color: theme.palette.getContrastText(textColor),
      backgroundColor: backgroundColor,
    },
  }))

  // Render
  return (
    <ColorButton
      onClick={onClick}
      variant='text'
      startIcon={<Icon />}
      style={style}>
      {label}
    </ColorButton>
  )
}
