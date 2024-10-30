import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// import { SET_QUESTION_RANDOM } from '@renderer/store/features/speakVoice/slice'
import { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import * as React from 'react'

export default function CheckboxList({ values }) {

  // const questionsRandom = useSelector((state: any) => state.speaking.questionsRandom)
  // const [checked, setChecked] = useState(questionsRandom)

  // const dispatch = useDispatch()

  const handleToggle = (value: number) => () => {


    console.log({value})
    // const currentIndex = checked.indexOf(value)
    // const newChecked = [...checked]

    // if (currentIndex === -1) {
    //   newChecked.push(value)
    //   // dispatch(SET_QUESTION_RANDOM(newChecked))
    // } else {
    //   newChecked.splice(currentIndex, 1)
    // }

    // // dispatch(SET_QUESTION_RANDOM(newChecked))

    // setChecked(newChecked)
  }




  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {values &&
        values.map((value: any) => {
          const labelId = `checkbox-list-label-${value}`

          return (
            <ListItem key={value} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    // checked={checked?.includes(value)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${value.value}`}
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
    </List>
  )
}
