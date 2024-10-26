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

const ReadingEditForm = ({  resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`
  const notify = useNotify()
  const navigate = useNavigate()
  const record = useRecordContext()
  const [userLogin, setUserLogin] = useState({ id: null, role: null })
  const [isAdmin, setIsAdmin] = useState(true)
  const [isDisableName, setIsDisableName] = useState(false)

  const getUserLogin = async () => {
    try {
      const userId = getClientCookieValue(HEADER.CLIENT_ID)
      const getUser = await dataProvider.getOne(resource, { id: userId })
      setUserLogin({ id: getUser.data.id, role: getUser.data.role })

      const checkRole = getUser.data.role === ROLE_ACCOUNT['admin']
      const isDisableName = getUser.data.role === ROLE_ACCOUNT['view']

      setIsAdmin(checkRole)
      setIsDisableName(isDisableName)
    } catch (error) {
      console.log({ error })
    }
  }

  useEffect(() => {
    getUserLogin()
  }, [])

  const handleUpdate = async (values: RecordValue) => {
    try {
      await dataProvider.update(resource, {
        id: record?.id,
        data: values,
        previousData: record
      })

      await notify(UPDATED_SUCCESS, {
        type: 'success'
      })
      navigate(resourcePath)
    } catch (error) {
      notify('エラー: 生産管理の更新に失敗しました: ' + error, {
        type: 'warning'
      })
    }
  }

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
          handleSave={handleUpdate}
        >
          <TextInput source="userName" label="ユーザー名" isRequired fullWidth disabled />

          <SelectInput
            source="role"
            choices={userRoles}
            isRequired
            label="椎限(*)"
            disabled={!isAdmin}
          />
          {userLogin?.role === ROLE_ACCOUNT['admin'] || record?.id === userLogin?.id ? (
            <PasswordInput source="newPassword" label="パスワード(*)" fullWidth />
          ) : (
            <></>
          )}

          <TextInput source="name" label="名前(*)" fullWidth isRequired disabled={isDisableName} />
        </CustomForm>
      </EditBase>
    </Box>
  )
}

const ReadingEdit = (props: BaseComponentProps) => {
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <ReadingEditForm {...props} />
      </EditBase>
    </Box>
  )
}

export default ReadingEdit
