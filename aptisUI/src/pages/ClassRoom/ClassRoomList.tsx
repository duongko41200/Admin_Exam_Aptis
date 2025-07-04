import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  FunctionField,
  List,
  TextField,
} from "react-admin";
import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
import { ListToolBar } from "../../components/ListToolBar";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";
import { convertDate } from "../../utils/formatDate";

const ClassRoomList = ({
  actions,
  resource,
  dataProvider,
}: BaseComponentProps) => {
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
        <TextField source="nameRoom" label="Tên lớp học" />

        <FunctionField
          source="assignments"
          label="Số lượng bài tập"
          render={(record) => record?.assignments?.length || 0}
        />

        <FunctionField
          source="dateStart"
          label="Ngày Khai giảng"
          render={(record) => convertDate(record?.createdAt)}
        />
        <FunctionField
          source="dateStart"
          label="ngày kết thúc"
          render={(record) => convertDate(record?.createdAt)}
        />

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
          <CustomButtonByRoleEdit source="role" label="Chỉnh Sửa">
            <EditButton label="Edit"></EditButton>
          </CustomButtonByRoleEdit>
        )}
      </Datagrid>
    </List>
  );
};

export default ClassRoomList;
