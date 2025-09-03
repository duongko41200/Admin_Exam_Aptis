import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField as MuiTextField,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CleaningServices as CleanIcon,
} from "@mui/icons-material";
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
import VideoService from "../../services/API/video.service";

const LectureList = ({
  actions,
  resource,
  dataProvider,
}: BaseComponentProps) => {
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupOptions, setCleanupOptions] = useState({
    deleteAllVideos: false,
    abortOngoingUploads: true,
    deleteExpiredOnly: true,
    olderThanHours: 24,
  });
  const refresh = useRefresh();

  const handleCleanup = async () => {
    setCleanupLoading(true);

    console.log("🧹 Starting cleanup with options:", cleanupOptions);

    try {
      const [result, error] = await VideoService.cleanupVideos(cleanupOptions);

      console.log("🧹 Cleanup response - result:", result);
      console.log("🧹 Cleanup response - error:", error);

      if (error) {
        console.error("Cleanup error:", error);
        alert(`Lỗi dọn dẹp: ${error.message || JSON.stringify(error)}`);
      } else if (result && result.data) {
        // Đảm bảo có data trước khi truy cập thuộc tính
        const abortedUploads = result.data.abortedUploads ?? 0;
        const deletedVideos = result.data.deletedVideos ?? 0;
        const errors = Array.isArray(result.data.errors)
          ? result.data.errors
          : [];

        alert(`Dọn dẹp thành công:
        - Đã hủy ${abortedUploads} multipart uploads
        - Đã xóa ${deletedVideos} video files
        ${errors.length > 0 ? `\n- Có ${errors.length} lỗi` : ""}`);

        refresh(); // Refresh the list
      } else {
        console.log("🧹 No data received from server:", result);
        alert("Không nhận được kết quả từ server.");
      }
    } catch (error) {
      console.error("❌ Cleanup failed:", error);
      alert(`Lỗi không xác định khi dọn dẹp: ${error.message}`);
    } finally {
      setCleanupLoading(false);
      setCleanupDialogOpen(false);
    }
  };

  return (
    <>
      <List
        title=""
        actions={
          <ListToolBar
            resource={resource}
            isShowCreate={validRole("create", actions)}
            customActions={
              <Button
                variant="outlined"
                color="warning"
                startIcon={<CleanIcon />}
                onClick={() => setCleanupDialogOpen(true)}
                sx={{ ml: 1 }}
              >
                Clean Videos
              </Button>
            }
          />
        }
      >
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <TextField source="no" label="NO" />
          <TextField source="lectureTitle" label="Tiêu đề bài học" />
          <TextField source="lectureDescription" label="Tóm tắt nội dung" />
          <TextField source="lectureType" label="Thể loại bài học" />
          <FunctionField
            source="createdAt"
            label="Ngày tạo"
            render={(record: any) => convertDate(record?.createdAt)}
          />
          <FunctionField
            source="updatedAt"
            label="Ngày cập nhật"
            render={(record: any) => convertDate(record?.updatedAt)}
          />

          <CustomButtonByRoleDelete
            source="role"
            label="Xóa"
            // userLogin={userLogin}
          >
            <DeleteWithConfirmButton
              confirmContent="Bạn có chắc chắn muốn xóa?"
              confirmTitle="Xác nhận xóa"
              label="Xóa"
              confirmColor="warning"
            />
          </CustomButtonByRoleDelete>

          {validRole("edit", actions) && (
            <CustomButtonByRoleEdit
              source="role"
              label="Chỉnh Sửa"
              // userLogin={userLogin}
            >
              <EditButton label="Sửa" />
            </CustomButtonByRoleEdit>
          )}
        </Datagrid>
      </List>

      {/* Cleanup Dialog */}
      <Dialog
        open={cleanupDialogOpen}
        onClose={() => setCleanupDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>🧹 Dọn dẹp Videos Folder</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={cleanupOptions.abortOngoingUploads}
                onChange={(e) =>
                  setCleanupOptions((prev) => ({
                    ...prev,
                    abortOngoingUploads: e.target.checked,
                  }))
                }
              />
            }
            label="Hủy các multipart uploads đang pending"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={cleanupOptions.deleteExpiredOnly}
                onChange={(e) =>
                  setCleanupOptions((prev) => ({
                    ...prev,
                    deleteExpiredOnly: e.target.checked,
                  }))
                }
              />
            }
            label="Chỉ xóa files cũ (thay vì tất cả)"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={cleanupOptions.deleteAllVideos}
                onChange={(e) =>
                  setCleanupOptions((prev) => ({
                    ...prev,
                    deleteAllVideos: e.target.checked,
                  }))
                }
                disabled={cleanupOptions.deleteExpiredOnly}
              />
            }
            label="⚠️ XÓA TẤT CẢ VIDEO FILES"
          />

          <MuiTextField
            fullWidth
            type="number"
            label="Xóa files cũ hơn (giờ)"
            value={cleanupOptions.olderThanHours}
            onChange={(e) =>
              setCleanupOptions((prev) => ({
                ...prev,
                olderThanHours: parseInt(e.target.value) || 24,
              }))
            }
            disabled={!cleanupOptions.deleteExpiredOnly}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCleanupDialogOpen(false)}
            disabled={cleanupLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCleanup}
            variant="contained"
            color="warning"
            disabled={cleanupLoading}
            startIcon={
              cleanupLoading ? <CircularProgress size={16} /> : <CleanIcon />
            }
          >
            {cleanupLoading ? "Đang dọn dẹp..." : "Bắt đầu dọn dẹp"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LectureList;
