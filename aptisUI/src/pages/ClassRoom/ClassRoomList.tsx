import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  FunctionField,
  List,
  TextField,
  useUpdate,
  useNotify,
  useRefresh,
} from "react-admin";
import { ListToolBar } from "../../components/ListToolBar";
import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";
import { convertDate } from "../../utils/formatDate";
import baseDataProvider from "../../providers/dataProviders/baseDataProvider";
import { useState } from "react";
import Switch from "@mui/material/Switch";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 0,
  display: "flex",
  "&:active .MuiSwitch-thumb": {
    width: 22,
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#4caf50",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#fff",
    width: 24,
    height: 24,
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    borderRadius: "50%",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#bdbdbd",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

// ✅ Component Switch có xác nhận
const ToggleSwitchWithConfirm = ({ record, source, resource }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(record[source]);
  const [pendingValue, setPendingValue] = useState(record[source]);

  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleSwitchChange = (event) => {
    console.log("đã click vào switch");
    const value = event.target.checked;

    console.log("Switch changed:", value);
    setPendingValue(value);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    setChecked(pendingValue);

    try {
      await baseDataProvider.update(resource, {
        id: record?.id,
        data: { [source]: pendingValue },
        previousData: record,
      });
      notify("Cập nhật thành công", { type: "success" });
      refresh();
    } catch (error) {
      notify("Lỗi cập nhật: " + error.message, { type: "warning" });
    }

    // update(
    //   resource,
    //   { id: record.id, data: { [source]: pendingValue }, previousData: record },
    //   {
    //     onSuccess: () => {
    //       notify("Cập nhật thành công", { type: "info" });
    //       refresh();
    //     },
    //     onError: (error) => {
    //       notify("Lỗi cập nhật: " + error.message, { type: "warning" });
    //     },
    //   }
    // );
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <CustomSwitch checked={checked} onChange={handleSwitchChange} />
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Xác nhận thay đổi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn {pendingValue ? "bật" : "tắt"} trạng thái này
            không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ✅ Trang danh sách chính
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
      <Datagrid rowClick={false} bulkActionButtons={false}>
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
          source="dateEnd"
          label="Ngày kết thúc"
          render={(record) => convertDate(record?.createdAt)}
        />

        {/* ✅ Switch toggle có xác nhận */}
        <FunctionField
          label="Trạng thái"
          render={(record) => (
            <ToggleSwitchWithConfirm
              record={record}
              source="isPublic" // <-- thay bằng field của bạn
              resource={resource}
            />
          )}
        />

        {validRole("delete", actions) && (
          <CustomButtonByRoleDelete source="role" label="Xóa">
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

export default ClassRoomList;
