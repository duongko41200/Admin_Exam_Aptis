import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
} from "react-admin";
import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
// import { ListToolBar } from "../../components/ListToolBar";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ListToolBar } from "../../components/ListToolBar";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";
import { ProductFilterForm } from "./CustomFilter";
import { PlusCircle } from "lucide-react";

export const ListToolBar = ({
  isShowCreate,
}: {
  isShowCreate: boolean;
  isShowFilter?: boolean;
}) => {
  const theme = useTheme();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const router = useNavigate();

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Header Section với full width */}
      <Card
        elevation={0}
        sx={{
          mt: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          // borderRadius: 2,
          overflow: "visible",
        }}
      >
        <CardContent sx={{ pb: "16px !important" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterListIcon sx={{ color: theme.palette.primary.main }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                >
                  Bộ lọc và tìm kiếm
                </Typography>
              </Box>

              {/* Toggle Filter Button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  isFilterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.primary.main,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {isFilterExpanded ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </Button>
            </Box>

            {isShowCreate && (
              <Button
                variant="contained"
                startIcon={<PlusCircle />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 6px 16px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => {
                  router("/speakings/create");
                }}
              >
                Thêm mới
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Filter Section - Full Width với Animation */}
      <Box
        sx={{
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          maxHeight: isFilterExpanded ? "200px" : "0px",
          opacity: isFilterExpanded ? 1 : 0,
        }}
      >
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.02
            )} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
          }}
        >
          <CardContent sx={{ pb: "16px !important" }}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "white",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.primary.main,
                  0.05
                )}`,
              }}
            >
              <ProductFilterForm productResource="products" />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const SpeakingList = ({
  actions,
  resource,
  dataProvider,
}: BaseComponentProps) => {
  return (
    <List
      title=""
      actions={<ListToolBar isShowCreate={validRole("create", actions)} />}
    >
      <Datagrid
        rowClick="show"
        bulkActionButtons={false}
        sx={{
          backgroundColor: "white",

          boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
          maxHeight: "calc(100vh - 220px)",
          overflow: "auto",
          "& .RaDatagrid-headerCell": {
            background: "#accfecff",
            color: "#0d47a1",
            fontWeight: 600,
            fontSize: "1rem",
            borderBottom: "2px solid #90caf9",
            py: 1.5,
          },
          "& .RaDatagrid-row": {
            background: "#fff",
            transition: "background 0.2s",
            "&:hover": {
              background: "rgba(25, 118, 210, 0.07)",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
            },
            "&:nth-of-type(even)": {
              background: "#f8fafc",
            },
          },
          "& .RaDatagrid-cell": {
            py: 1.5,
            px: 1.5,
            fontSize: "0.95rem",
            borderBottom: "1px solid #e3e3e3",
          },
          "&::-webkit-scrollbar": {
            width: 6,
            background: "#e3f2fd",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#060f16ff",
            borderRadius: 4,
          },
          "@media (max-width: 900px)": {
            fontSize: "0.92rem",
            "& .RaDatagrid-headerCell": { fontSize: "0.95rem", py: 1 },
            "& .RaDatagrid-cell": { fontSize: "0.92rem", py: 1 },
          },
        }}
      >
        <TextField source="no" label="NO" />
        <TextField source="title" label="Chủ đề Reading" />
        <TextField
          source="questions[0].questionTitle"
          label="Chủ đề từng phần"
        />
        <TextField source="questionPart" label="Reading Part" />
        <TextField source="createdAt" label="Ngày tạo" />
        <TextField source="updatedAt" label="Ngày Cập nhập" />

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

export default SpeakingList;
