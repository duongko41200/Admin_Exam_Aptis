import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
} from "react-admin";
import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
import { ListToolBar } from "../../components/ListToolBar";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";

const UserList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  return (
    <List
      title="管理ユーザー　一覧"
      actions={
        <ListToolBar
          resource={resource}
          isShowCreate={validRole("create", actions)}
        />
      }
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField source="no" label="NO" />
        <TextField source="name" label="User" />
        <TextField source="email" label="Email" />
        <TextField source="phone" label="Số điện thoại" />
        <TextField source="roles" label="Role" />

        {validRole("delete", actions) && (
          <CustomButtonByRoleDelete source="role" label="Xóa">
            <DeleteWithConfirmButton
              confirmContent="よろしいですか?"
              confirmTitle="削除"
              label="Xóa"
              confirmColor="warning"
            ></DeleteWithConfirmButton>
          </CustomButtonByRoleDelete>
        )}

        {validRole("edit", actions) && (
          <CustomButtonByRoleEdit
            source="role"
            label="Chỉnh Sửa"
            // userLogin={userLogin}
          >
            <EditButton label="Edit"></EditButton>
          </CustomButtonByRoleEdit>
        )}
      </Datagrid>
    </List>
  );
};

export default UserList;
