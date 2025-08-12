import {
  CreateButton,
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  TopToolbar,
} from "react-admin";
import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
// import { ListToolBar } from "../../components/ListToolBar";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";
import StudyProcess from "./UserStudyProcess/StudyProcess";
import { Box, Button } from "@mui/material";
import { ProductFilterForm } from "./CustomFilter";
import { useEffect, useState } from "react";

//// TRee Item Component

export const ListToolBar = ({
  isShowCreate,
  classrooms,
}: {
  isShowCreate: boolean;
  isShowFilter?: boolean;
  classrooms: { id: string; name: string }[];
}) => {
  return (
    <Box width="100%" sx={{ marginBottom: "20px" }}>
      <TopToolbar>
        {isShowCreate && (
          <>
            <CreateButton label="新規登録" />
          </>
        )}
      </TopToolbar>
      <ProductFilterForm productResource="products" classrooms={classrooms} />
    </Box>
  );
};

const UserList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>([
    {
      id: "",
      name: "Không có lớp học",
    },
  ]);
  const fetchClassrooms = async () => {
    try {
      const response = await dataProvider.getAll("classrooms");

      console.log("Classrooms response:", response);

      const classroomList = response.data ?? [];

      const formattedClassrooms = classroomList.map((classroom: any) => ({
        id: classroom._id,
        name: classroom.nameRoom,
      }));

      setClassrooms(formattedClassrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);
  return (
    <List
      title="Quản Lý Thành Viên"
      actions={
        <ListToolBar
          isShowCreate={validRole("create", actions)}
          classrooms={classrooms}
        />
      }
    >
      <Datagrid
        rowClick="show"
        bulkActionButtons={false}
        expand={<StudyProcess />}
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "none",

          },
          maxHeight: "calc(100vh - 200px)",
          overflow: "auto",
        }}
      >
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
