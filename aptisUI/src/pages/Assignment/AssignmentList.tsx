import { convertDate } from "../../utils/formatDate";
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

const AssignmentList = ({
  actions,
  resource,
  dataProvider,
}: BaseComponentProps) => {
  return (
    <List
      title=""
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
        <TextField source="skill" label="Kỹ năng" />
        <TextField source="partOfSkill" label="Số Part " />
        <TextField source="idQues.length" label="Số câu hỏi " />

        <FunctionField
          source="createdAt"
          label=" Ngày tạo"
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

export default AssignmentList;
