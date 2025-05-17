import React, { useState } from 'react'
import { TextField, Button, List, ListItem, ListItemText, IconButton, Stack } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'

export interface Props {
  label: string
  values: string[]
  setValues: any
}

export default function EditableStringList({
                          label,
                          values,
                          setValues
                        }: Props) {

  const [input, setInput] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const handleAddOrUpdate = () => {

    if (input.trim() === '') return

    if (editIndex !== null) {
      const updated = [...values]
      updated[editIndex] = input.trim()
      setValues(updated.sort())
      setEditIndex(null)
    } else {
      setValues([...values, input.trim()].sort())
    }

    setInput('')
  }

  const handleEdit = (index: number) => {

    setInput(values[index])
    setEditIndex(index)
  }

  const handleDelete = (index: number) => {

    setValues(values.filter((_, i) => i !== index))
    if (editIndex === index) {
      setInput('')
      setEditIndex(null)
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction='row' spacing={1}>
        <TextField
          label={label}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
        <Button variant='contained' onClick={handleAddOrUpdate}>
          {editIndex !== null ? 'Update' : 'Add'}
        </Button>
      </Stack>

      <List>
        {values.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton edge='end' onClick={() => handleEdit(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge='end' onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}
