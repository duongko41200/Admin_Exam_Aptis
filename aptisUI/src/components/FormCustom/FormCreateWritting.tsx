import { Box, Button, Stack } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Title, useNotify } from 'react-admin'

import SaveIcon from '@mui/icons-material/Save'
import InputEditorForm from '@renderer/components/InputEditor/InputEditorForm'
import { boxStyles } from '@renderer/styles'
import { RecordValue } from '@renderer/types/general'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface ContentItem {
  id: number
  title: string
  question: string
  des: string
  note: string
  answer: string
}

interface DataItem {
  id: number
  name: string
  createdAt: Date // This should be a Date object
  totalContent: number // Assuming totalContent is a number
  content: ContentItem[]
}

const FormCreateWritting = ({ addContentQuestion }) => {
  const [isLoading, setIsLoading] = useState(false)

  const notify = useNotify()
  const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    control,
    handleSubmit,
    watch
  } = useForm<any>({
    mode: 'onTouched'
  })

  const handleSave = async (values: RecordValue) => {
    console.log({ values })
    addContentQuestion(values)
  }
  return (
    <Box sx={boxStyles}>
      <Title title={`管理ユーザー管理　新規作成`} />
      <form onSubmit={handleSubmit(handleSave)}>
        <Box
          sx={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', columnGap: 20, width: '100%' }}>
            <TextField
              id="filled-basic"
              label="Tên Tiêu Đề*"
              variant="filled"
              fullWidth
              {...register('title')}
            />
          </div>
          <TextField
            id="filled-basic"
            label="Question*"
            variant="filled"
            fullWidth
            {...register('question')}
          />

          <Controller
            name="des"
            control={control}
            render={({ field: { onChange } }) => (
              <InputEditorForm
                content=" "
                isShowFoter={false}
                hieghtInput="250px"
                labelInput="Mô tả"
                onChange={onChange}
              />
            )}
          />

          <Controller
            name="answer"
            control={control}
            render={({ field: { onChange } }) => (
              <InputEditorForm
                content=" "
                isShowFoter={false}
                hieghtInput="250px"
                labelInput="Câu trả lời"
                onChange={onChange}
              />
            )}
          />

          <Controller
            name="note"
            control={control}
            render={({ field: { onChange } }) => (
              <InputEditorForm
                content=" "
                isShowFoter={false}
                hieghtInput="250px"
                labelInput="NOTE"
                onChange={onChange}
              />
            )}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            width="100%"
            sx={{
              backgroundColor: '#f1f1f1',
              padding: '1rem',
              borderRadius: '4px',
              marginTop: '1rem'
            }}
          >
            {/* {validRole('edit', actions) && ( */}
            <Button
              startIcon={<SaveIcon />}
              type="submit"
              variant="contained"
              disabled={isLoading === false && (watch('question') || watch('title')) ? false : true}
            >
              保存
            </Button>
            {/* )} */}
          </Stack>
        </Box>
      </form>
    </Box>
  )
}

export default FormCreateWritting
