import { Box, Card } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Button,
  DateTimeInput,
  EditBase,
  SelectInput,
  TextInput,
  Title,
  useNotify,
  useRecordContext,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { nanoid } from "nanoid";
import { useForm, FormProvider } from "react-hook-form";

import CustomForm from "../../components/CustomForm";
import { UPDATED_SUCCESS } from "../../consts/general";
import baseDataProvider from "../../providers/dataProviders/baseDataProvider";
import { boxStyles } from "../../styles";
import { BaseComponentProps, RecordValue } from "../../types/general";

const ClassRoomEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext();

  const methods = useForm();
  const { setValue, getValues } = methods;

  const [assignmentsList, setAssignmentsList] = useState([]);
  const [assignmentFields, setAssignmentFields] = useState<string[]>([]);

  // Thêm assignment mới (tạo fieldId)
  const handleAddAssignment = () => {
    setAssignmentFields((prev) => [...prev, nanoid()]);
  };

  // Xóa assignment theo index & cập nhật lại values
  const handleDeleteAssignment = (fieldIdToDelete: string) => {
    const indexToDelete = assignmentFields.findIndex(
      (id) => id === fieldIdToDelete
    );
    if (indexToDelete === -1) return;

    setAssignmentFields((prev) => prev.filter((_, i) => i !== indexToDelete));

    const dataRecord = record.assignments
      ? record.assignments.filter((_: any, i: number) => i !== indexToDelete)
      : [];

    record.assignments = dataRecord;
  };

  const handleUpdate = async (values: RecordValue) => {
    const { _id, id, ...cleanData } = values;

    console.log("Current record:", record);

    console.log("Cleaned data:", cleanData);

    try {
      await dataProvider.update(resource, {
        id: record?.id,
        data: cleanData,
        previousData: record,
      });
      notify(UPDATED_SUCCESS, { type: "success" });
      navigate(resourcePath);
    } catch (error) {
      notify("エラー: Cập nhật thất bại: " + error, { type: "warning" });
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

  // Khi load record thì tạo fieldId tương ứng
  useEffect(() => {
    if (record?.assignments) {
      const fieldIds = record.assignments.map(() => nanoid());
      setAssignmentFields(fieldIds);
    }
  }, [record]);

  // Cắt dữ liệu assignments theo fieldId đang có
  const getFilteredAssignments = () => {
    const original = record?.assignments || [];
    return assignmentFields.map((_, idx) => original[idx] || {});
  };

  const filteredAssignments = getFilteredAssignments();

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <FormProvider {...methods}>
          <Title title="Chỉnh sửa lớp học" />
          <CustomForm
            pathTo={resourcePath}
            showDeleteButton={false}
            showSaveButton={true}
            showCancelButton={true}
            handleSave={handleUpdate}
            alwaysEnable={true}
          >
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
                width: "100%",  
              }}
            >
              <TextInput
                source="nameRoom"
                isRequired
                label="Tên lớp học"
                fullWidth
                disabled
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
                  assignmentFields.map((fieldId, index) => {
                    const defaultAssignment = filteredAssignments[index] || {};

                    return (
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
                        }}
                      >
                        <Box sx={{ width: "30px" }}>{index + 1}.</Box>
                        <Box sx={{ flex: 2 }}>
                          <SelectInput
                            source={`assignments[${index}].assignmentId`}
                            choices={assignmentsList}
                            isRequired
                            label="Bài tập (*)"
                            fullWidth
                            defaultValue={defaultAssignment.assignmentId}
                          />
                        </Box>
                        <Box sx={{ flex: 2 }}>
                          <DateTimeInput
                            source={`assignments[${index}].datePublic`}
                            label="Ngày công khai"
                            fullWidth
                            isRequired
                            defaultValue={defaultAssignment.datePublic}
                          />
                        </Box>
                        <Button
                          onClick={() => handleDeleteAssignment(fieldId)}
                          color="error"
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    );
                  })
                ) : (
                  <Box sx={{ fontStyle: "italic", mt: 2 }}>
                    Không có bài tập nào. Hãy nhấn "Thêm bài tập".
                  </Box>
                )}
              </Box>
            </Card>
          </CustomForm>
        </FormProvider>
      </EditBase>
    </Box>
  );
};

const ClassRoomEdit = (props: BaseComponentProps) => {
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <ClassRoomEditForm {...props} />
      </EditBase>
    </Box>
  );
};

export default ClassRoomEdit;
