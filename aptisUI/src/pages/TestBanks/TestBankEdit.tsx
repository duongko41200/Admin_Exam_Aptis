import { ROLE_ACCOUNT, userRoles } from '../../consts/user'
import {
  TextInput,
  SelectInput,
  PasswordInput,
  useNotify,
  useRecordContext,
  EditBase,
  Title
} from 'react-admin'
import CustomForm from '../../components/CustomForm'
import { validateUserEdition } from './formValidator'
import { BaseComponentProps, RecordValue } from '../../types/general'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { boxStyles } from '../../styles'
import { useEffect, useState } from 'react'
import { getClientCookieValue } from '../../utils/cookies'
import { HEADER } from '../../consts/access'
import { UPDATED_SUCCESS } from '../../consts/general'

const TesBankEditForm = ({  resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`
  const notify = useNotify()
  const navigate = useNavigate()
  const record = useRecordContext()


  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <CustomForm
          pathTo={resourcePath}
          validate={validateUserEdition}
          showDeleteButton={false}
          showSaveButton={true}
          showCancelButton={true}
          // handleSave={handleUpdate}
        >
          <TextInput source="userName" label="ユーザー名" isRequired fullWidth disabled />

    

        </CustomForm>
      </EditBase>
    </Box>
  )
}

const TestBankEdit = (props: BaseComponentProps) => {
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <TesBankEditForm {...props} />
      </EditBase>
    </Box>
  )
}

export default TestBankEdit
