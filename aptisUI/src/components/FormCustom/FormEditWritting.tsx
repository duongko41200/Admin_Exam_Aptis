import { Box, Button, Stack } from '@mui/material'
import TextField from '@mui/material/TextField'
import { Title, useNotify, useRecordContext } from 'react-admin'

import SaveIcon from '@mui/icons-material/Save'
import InputEditorForm from '@renderer/components/InputEditor/InputEditorForm'
import { UPDATED_SUCCESS } from '@renderer/consts/general'
import dataProvider from '@renderer/providers/dataProviders/dataProvider'
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

const FormEditWritting = ({ handleCancel, content, idEditContent }) => {
  const [isLoading, setIsLoading] = useState(false)

  const record = useRecordContext()

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
    let valueUpdate = record
    if (valueUpdate) {
      valueUpdate.content[idEditContent] = values

      try {
        await dataProvider.update('writting', {
          id: record?.id,
          data: valueUpdate,
          previousData: record
        })

        notify(UPDATED_SUCCESS, {
          type: 'success'
        })
        handleCancel()
      } catch (error) {
        notify('エラー: 生産管理の更新に失敗しました: ' + error, {
          type: 'warning'
        })
      }
    }

    // handleCancel()
  }
  return (
    <Box sx={{ ...boxStyles, overflow: 'auto' }}>
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
              defaultValue={content.title}
              fullWidth
              {...register('title')}
            />
          </div>
          <TextField
            id="filled-basic"
            label="Question*"
            variant="filled"
            defaultValue={content.question}
            fullWidth
            {...register('question')}
          />

          <Controller
            name="des"
            control={control}
            defaultValue={content.des}
            render={({ field: { onChange } }) => (
              <InputEditorForm
                content={content.des}
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
            defaultValue={content.answer}
            render={({ field: { onChange } }) => (
              <InputEditorForm
                content={content.answer}
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
            defaultValue={content.note}
            render={({ field: { onChange } }) => (
              <InputEditorForm
                content={content.note}
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
              // disabled={isLoading === false && (watch('question') || watch('name')) ? false : true}
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

export default FormEditWritting
