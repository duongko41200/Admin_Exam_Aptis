import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
import { ListToolBar } from "../../components/ListToolBar";
import { useState } from "react";
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  FunctionField,
  List,
  TextField,
  useRefresh,
} from "react-admin";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";
import { convertDate } from "../../utils/formatDate";

const TestBankList = ({
  actions,
  resource,
  dataProvider,
}: BaseComponentProps) => {
  const [userLogin, setUserLogin] = useState({});

  const refresh = useRefresh();

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
        <TextField source="title" label="Bộ đề" />

        {["speaking", "listening", "reading", "writing"].map((field) => (
          <FunctionField
            key={field}
            source={field}
            render={(record) =>
              `P1:${record[field].part1?.length} | P2:${
                record[field].part2?.length
              } | P3:${record[field].part3.length} | P4:${
                record[field].part4.length
              } | ${
                record[field]?.part5?.length
                  ? `P5:${record[field]?.part5?.length}`
                  : ""
              } `
            }
          />
        ))}

        <FunctionField
          source="createdAt"
          label="Ngày tạo"
          render={(record) => convertDate(record?.createdAt)}
        />
        <FunctionField
          source="updatedAt"
          label="Ngày tạo"
          render={(record) => convertDate(record?.createdAt)}
        />

        {validRole("delete", actions) && (
          <CustomButtonByRoleDelete
            source="role"
            label="Xóa"
            userLogin={userLogin}
          >
            <DeleteWithConfirmButton
              confirmContent="よろしいですか?"
              confirmTitle="削除"
              label="Xóa"
              confirmColor="warning"
            />
          </CustomButtonByRoleDelete>
        )}

        {validRole("edit", actions) && (
          <CustomButtonByRoleEdit source="role" label="Chỉnh Sửa">
            <EditButton label="Edit" />
          </CustomButtonByRoleEdit>
        )}
      </Datagrid>
    </List>
  );
};

export default TestBankList;
