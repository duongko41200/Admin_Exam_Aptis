import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  EditBase,
  FunctionField,
  PasswordInput,
  SelectInput,
  TextInput,
  Title,
  useNotify,
  useRecordContext,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import CustomForm from "../../components/CustomForm";
import { UPDATED_SUCCESS } from "../../consts/general";
import { userRoles } from "../../consts/user";
import { boxStyles } from "../../styles";
import { BaseComponentProps, RecordValue } from "../../types/general";
import { validateUserEdition } from "./formValidator";

const UserEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext();

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
      notify("Call api class room lỗi", { type: "error" });
    }
  };

  const handleUpdate = async (values: RecordValue) => {
    try {
      await dataProvider.update(resource, {
        id: record?.id,
        data: values,
        previousData: record,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate(resourcePath);
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <Box sx={{ ...boxStyles, maxHeight: "calc(100vh - 100px)" }}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <CustomForm
          pathTo={resourcePath}
          // validate={validateUserEdition}
          showDeleteButton={false}
          showSaveButton={true}
          showCancelButton={true}
          handleSave={handleUpdate}
        >
          <TextInput
            source="name"
            fullWidth
            isRequired
            label="Tên người dùng"
          />
          <TextInput source="email" fullWidth isRequired label="Email" />
          <TextInput source="phone" fullWidth label="Số điện thoại" />
          <TextInput source="identityCard" fullWidth label="Số CMND/CCCD" />

          <TextInput
            source="operationMobile"
            fullWidth
            label="Thông tin thiết bị min app"
            multiline
            rows={10}
          />

          <PasswordInput source="newPassword" fullWidth label="Mật khẩu mới" />
          <SelectInput
            source="classRoomId"
            choices={classrooms}
            isRequired
            label="lớp học "
            fullWidth
          />

          <SelectInput
            source="role"
            choices={userRoles}
            defaultValue={"USER"}
            label="Vai trò"
            fullWidth
          />

          <Box
            sx={{
              width: "100%",
              height: "50px",
            }}
          ></Box>
        </CustomForm>
      </EditBase>
    </Box>
  );
};

const UserEdit = (props: BaseComponentProps) => {
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <UserEditForm {...props} />
      </EditBase>
    </Box>
  );
};

export default UserEdit;
