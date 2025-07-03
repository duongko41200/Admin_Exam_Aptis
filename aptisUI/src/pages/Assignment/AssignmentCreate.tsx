import { Create, PasswordInput, SelectInput, TextInput } from 'react-admin'
import { userRoles } from '../../consts/user'

import CustomForm from '../../components/CustomForm'
import { BaseComponentProps } from '../../types/general'
import { validateUserCreation } from './formValidator'


const AssignmentCreate = ({  resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`




  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomForm pathTo={resourcePath} validate={validateUserCreation} showDeleteButton={false}>
        <div style={{ display: 'flex', alignItems: 'center', columnGap: 20 }}>
          <TextInput source="userName" isRequired label="ユーザー名(*)" />
        </div>

        <SelectInput
          source="role"
          choices={userRoles}
          isRequired
          defaultValue={2}
          label="権限(*)"
        />
        <PasswordInput source="password" fullWidth isRequired label="パスワード(*)" />
        <TextInput source="name" fullWidth isRequired label="名前 (*)" />
      </CustomForm>
    </Create>
  )
}

export default AssignmentCreate
