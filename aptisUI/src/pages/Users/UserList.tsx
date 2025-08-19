import {
  CreateButton,
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  TopToolbar,
  FunctionField,
} from "react-admin";
import { CustomButtonByRoleDelete } from "../../components/CustomButtonByRoleDelete";
import { CustomButtonByRoleEdit } from "../../components/CustomButtonByRoleEdit";
// import { ListToolBar } from "../../components/ListToolBar";
import { validRole } from "../../core/role/permissions";
import { BaseComponentProps } from "../../types/general";
import StudyProcess from "./UserStudyProcess/StudyProcess";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { ProductFilterForm } from "./CustomFilter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//// TRee Item Component

export const ListToolBar = ({
  isShowCreate,
  classrooms,
}: {
  isShowCreate: boolean;
  isShowFilter?: boolean;
  classrooms: { id: string; name: string }[];
}) => {
  const theme = useTheme();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const router = useNavigate();

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      {/* Header Section với full width */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 2,
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
                startIcon={<PersonAddIcon />}
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
                onClick={() => {router("/users/create")}}
              >
                Thêm thành viên mới
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
              <ProductFilterForm
                productResource="products"
                classrooms={classrooms}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const UserList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>([
    {
      id: "",
      name: "Không có lớp học",
    },
  ]);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton
          variant="rectangular"
          height={60}
          sx={{ mb: 2, borderRadius: 2 }}
        />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.05
            )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Avatar
              sx={{
                backgroundColor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <BadgeIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                Quản Lý Thành Viên
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                Quản lý thông tin và quyền hạn của các thành viên trong hệ thống
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 0 }}>
          <List
            actions={
              <ListToolBar
                isShowCreate={validRole("create", actions)}
                classrooms={classrooms}
              />
            }
            sx={{
              "& .RaList-main": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
              "& .RaList-content": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Datagrid
              rowClick="show"
              bulkActionButtons={false}
              expand={<StudyProcess />}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "& .MuiTableHead-root": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
                "& .MuiTableCell-head": {
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: theme.palette.text.primary,
                  borderBottom: `2px solid ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  py: 2,
                },
                "& .MuiTableRow-root": {
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  },
                },
                "& .MuiTableCell-body": {
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.1
                  )}`,
                  py: 1.5,
                  fontSize: "0.875rem",
                },
                maxHeight: "calc(100vh - 350px)",
                overflow: "auto",
                "& .MuiTableContainer-root": {
                  borderRadius: 2,
                  boxShadow: "none",
                },
              }}
            >
              <TextField source="no" label="STT" />

              <FunctionField
                label="Thành viên"
                render={(record: any) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: theme.palette.primary.main,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {record?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {record?.name || "Chưa có tên"}
                    </Typography>
                  </Box>
                )}
              />

              <TextField source="email" label="Email" />
              <TextField source="phone" label="Số điện thoại" />

              <FunctionField
                label="Vai trò"
                render={(record: any) => {
                  const getRoleColor = (role: string) => {
                    switch (role?.toLowerCase()) {
                      case "admin":
                        return { bg: "#ffebee", color: "#c62828" };
                      case "teacher":
                        return { bg: "#e3f2fd", color: "#1565c0" };
                      case "student":
                        return { bg: "#e8f5e8", color: "#2e7d32" };
                      default:
                        return { bg: "#f5f5f5", color: "#616161" };
                    }
                  };

                  const roleStyle = getRoleColor(record?.roles);

                  return (
                    <Chip
                      label={record?.roles || "N/A"}
                      size="small"
                      sx={{
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.color,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 24,
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                      }}
                    />
                  );
                }}
              />

              {validRole("delete", actions) && (
                <CustomButtonByRoleDelete source="role" label="Thao tác">
                  <DeleteWithConfirmButton
                    confirmContent="Bạn có chắc chắn muốn xóa thành viên này?"
                    confirmTitle="Xác nhận xóa"
                    label="Xóa"
                    confirmColor="warning"
                    sx={{
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  />
                </CustomButtonByRoleDelete>
              )}

              {validRole("edit", actions) && (
                <CustomButtonByRoleEdit source="role" label="Chỉnh sửa">
                  <EditButton
                    label="Sửa"
                    sx={{
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  />
                </CustomButtonByRoleEdit>
              )}
            </Datagrid>
          </List>
        </Box>
      </Card>
    </Box>
  );
};
export default UserList;
