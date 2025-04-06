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

const LectureList = ({
  actions,
  resource,
  dataProvider,
}: BaseComponentProps) => {
  const fetchapi = async () => {
    const PORT = 3052;

    const data = await fetch(`http://localhost:${PORT}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      // .then((data) => {
      //   console.log('Dữ liệu từ API:', data)
      //   // Xử lý dữ liệu ở đây
      // })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        // Xử lý lỗi ở đây
      });

    console.log({ data });
  };

  // useEffect(() => {
  //   // getUserLogin()
  //   // refresh()

  //   fetchapi()
  // }, [])

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
        <TextField source="lectureTitle" label="Tiêu đè bài học" />
        <TextField source="lectureDescription" label="Tóm tắt nội dung" />
        <TextField source="lectureType" label="thể loại bài học" />
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

        <CustomButtonByRoleDelete
          source="role"
          label="Xóa"
          // userLogin={userLogin}
        >
          <DeleteWithConfirmButton
            confirmContent="よろしいですか?"
            confirmTitle="削除"
            label="Xóa"
            confirmColor="warning"
          ></DeleteWithConfirmButton>
        </CustomButtonByRoleDelete>

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

export default LectureList;
