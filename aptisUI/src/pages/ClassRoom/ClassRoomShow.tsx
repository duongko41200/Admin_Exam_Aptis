import CustomForm from '../../components/CustomForm'
import { BaseComponentProps } from '@/types/general'
import { Box } from '@mui/material'
import { ShowBase, TextInput, Title } from 'react-admin'
import { boxStyles, disabledInputBackgroundStyle } from '../../styles'

const ClassRoomShow = ({  resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`

  return (
    <Box sx={boxStyles}>
      <ShowBase>
        <>
          <Title title="管理ユーザー管理　参照" />
          <CustomForm
            pathTo={resourcePath}
            showDeleteButton={false}
            showCancelButton={true}
            showSaveButton={false}
          >
            {/* <TextInput
              source="userName"
              label="ユーザー名"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            /> */}

            {/* <CustomTextInput label="作成時" source="role" /> */}
            <TextInput
              source="name"
              label="User"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            />
            <TextInput
              source="email"
              label="Email"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            />
            <TextInput
              source="roles"
              label="Vai trò"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            />

            <TextInput
              source="createdAt"
              label="createdAt"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            />
            {/* <FormatInputDateShow label="作成時" source="createAt" />
            <FormatInputDateShow label="更新日時" source="updateAt" />
            <TextInput
              source="updateBy"
              label="アップデーター"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            /> */}
          </CustomForm>
        </>
      </ShowBase>
    </Box>
  )
}

export default ClassRoomShow
