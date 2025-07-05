import {
  Button,
  Create,
  DateTimeInput,
  SelectInput,
  TextInput,
  useNotify,
} from "react-admin";
import { Box, Card } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { nanoid } from "nanoid";

import baseDataProvider from "../../providers/dataProviders/baseDataProvider";
import { BaseComponentProps } from "../../types/general";
import { UPDATED_SUCCESS } from "../../consts/general";

const ClassRoomCreate = ({ resource }: BaseComponentProps) => {
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const resourcePath = `/${resource}`;
  const notify = useNotify();
  const navigate = useNavigate();

  const [assignmentsList, setAssignmentsList] = useState([]);
  const [assignmentFields, setAssignmentFields] = useState<string[]>([]);

  const handleAddAssignment = () => {
    setAssignmentFields((prev) => [...prev, nanoid()]);
  };

  const handleDeleteAssignment = (fieldIdToDelete: string) => {
    const indexToDelete = assignmentFields.findIndex(
      (id) => id === fieldIdToDelete
    );

    // Remove fieldId from UI tracking
    setAssignmentFields((prev) => prev.filter((id) => id !== fieldIdToDelete));

    // Remove corresponding value from form state
    const currentAssignments = getValues("assignments") || [];
    const updatedAssignments = currentAssignments.filter(
      (_: any, i: number) => i !== indexToDelete
    );
    setValue("assignments", updatedAssignments);
  };

  const handleSave = async (values: any) => {
    try {
      await baseDataProvider.create("classrooms", { data: values });
      notify(UPDATED_SUCCESS, { type: "success" });
      navigate(`/${resource}`);
    } catch (error) {
      console.error("Lỗi tạo lớp:", error);
      notify("Không tạo thành công", { type: "error" });
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await baseDataProvider.getAll("assignments");
        const formatted = response.data.map((a) => ({
          id: a._id,
          name: a.name,
        }));
        setAssignmentsList(formatted);
      } catch (error) {
        console.error("Lỗi lấy bài tập:", error);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <Create redirect="list" title="Tạo lớp học mới">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              border: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
            }}
          >
            <TextInput
              source="nameRoom"
              isRequired
              label="Tên lớp học"
              fullWidth
            />
            <DateTimeInput
              source="dateStart"
              fullWidth
              label="Ngày bắt đầu"
              isRequired
            />
            <DateTimeInput
              source="dateEnd"
              fullWidth
              label="Ngày kết thúc"
              isRequired
            />

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="info"
                sx={{ px: 2, py: 1 }}
                onClick={handleAddAssignment}
              >
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                  Thêm bài tập
                </span>
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 3,
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {assignmentFields.length > 0 ? (
                assignmentFields.map((fieldId, index) => (
                  <Box
                    key={fieldId}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      borderRadius: 2,
                      backgroundColor: "#fff",
                      boxShadow: 1,
                      border: "1px solid #e0e0e0",
                      "& .MuiFormHelperText-root": {
                        ml: 2,
                        fontSize: "0.875rem",
                        color: "error.main",
                        display: "none", // Hide helper text by default
                      },
                    }}
                  >
                    <Box sx={{ width: "30px" }}>{index + 1}.</Box>
                    <Box sx={{ flex: 2 }}>
                      <SelectInput
                        source={`assignments[${index}].assignmentId`}
                        choices={assignmentsList}
                        label="Bài tập (*)"
                        fullWidth
                        isRequired
                      />
                    </Box>
                    <Box sx={{ flex: 2 }}>
                      <DateTimeInput
                        source={`assignments[${index}].datePublic`}
                        label="Ngày công khai"
                        fullWidth
                        isRequired
                      />
                    </Box>
                    <Button
                      onClick={() => handleDeleteAssignment(fieldId)}
                      color="error"
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                ))
              ) : (
                <Box sx={{ fontStyle: "italic", mt: 2 }}>
                  Hãy nhấn "Thêm bài tập" để bắt đầu thêm.
                </Box>
              )}
            </Box>
          </Card>

          {/* === Footer cố định === */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              borderTop: "1px solid #ddd",
              boxShadow: "0 -2px 6px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              gap: 2,
              zIndex: 10,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: 120 }}
            >
              <span>Lưu</span>
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(resourcePath)}
              sx={{ minWidth: 120 }}
            >
              <span>Hủy</span>
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Create>
  );
};

export default ClassRoomCreate;
