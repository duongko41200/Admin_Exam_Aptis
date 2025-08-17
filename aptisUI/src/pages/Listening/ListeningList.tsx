import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
import { ListToolBar } from "../../components/ListToolBar";
import { useState } from "react";
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  useRefresh,
} from "react-admin";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";

const ListeningList = ({
  actions,
  resource,
  dataProvider,
}: BaseComponentProps) => {
  const [userLogin, setUserLogin] = useState({});

  const [dataTest, setDataTest] = useState("");
  const refresh = useRefresh();

  const getUserLogin = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const getUser = await dataProvider.getOne(resource, { id: userId });
      setUserLogin({ id: getUser.data.id, role: getUser.data.role });
      refresh();
    } catch (error) {
      console.log({ error });
    }
  };

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

    setDataTest(data.data);
  };

  // useEffect(() => {
  //   // getUserLogin()
  //   // refresh()

  //   fetchapi()
  // }, [])

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
      <Datagrid
        rowClick="show"
        bulkActionButtons={false}
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          maxHeight: "calc(100vh - 200px)",
          overflow: "auto",
        }}
      >
        <TextField source="no" label="NO" />
        <TextField source="title" label="Chủ đề Reading" />
        <TextField
          source="questions[0].questionTitle"
          label="Chủ đề từng phần"
        />
        <TextField source="questionPart" label="Listening Part" />
        <TextField source="createdAt" label="Ngày tạo" />
        <TextField source="updatedAt" label="Ngày Cập nhập" />

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

export default ListeningList;
