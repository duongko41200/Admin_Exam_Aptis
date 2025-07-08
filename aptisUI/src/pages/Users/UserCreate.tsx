import {
  Create,
  PasswordInput,
  SelectInput,
  TextInput,
  useNotify,
} from "react-admin";
import { userRoles } from "../../consts/user";

import CustomForm from "../../components/CustomForm";
import { BaseComponentProps } from "../../types/general";
import { validateUserCreation } from "./formValidator";
import { useEffect, useState } from "react";
import dataProvider from "../../providers/dataProviders/baseDataProvider";
import { UPDATED_SUCCESS } from "../../consts/general";

const UserCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const notify = useNotify();
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
  const handleSave = async (values: any) => {
    try {
      await dataProvider.create("users", { data: values });
      notify(UPDATED_SUCCESS, { type: "success" });
      // navigate(`/${resource}`);
    } catch (error) {
      console.error("Lỗi tạo lớp:", error);
      notify("Không tạo thành công", { type: "error" });
    }
  };
  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomForm
        pathTo={resourcePath}
        // validate={validateUserCreation}
        showDeleteButton={false}
        handleSave={handleSave}
      >
        <TextInput source="name" fullWidth isRequired label="Tên người dùng" />
        <TextInput source="email" fullWidth isRequired label="Email" />
        <TextInput source="phone" fullWidth label="Số điện thoại" />
        <TextInput source="identityCard" fullWidth label="Số CMND/CCCD" />

        <PasswordInput source="password" fullWidth label="Mật khẩu" />
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
      </CustomForm>
    </Create>
  );
};

export default UserCreate;
