import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Button,
  DateTimeInput,
  EditBase,
  SelectInput,
  TextInput,
  Title,
  useNotify,
  useRecordContext
} from "react-admin";
import { useNavigate } from "react-router-dom";
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
  const [userLogin, setUserLogin] = useState({ id: null, role: null });
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDisableName, setIsDisableName] = useState(false);

  // Fetch assigned api
  const [assignments, setAssignments] = useState([]);

  const [assignmentCount, setAssignmentCount] = useState([]);

  const handleAddAssignment = () => {
    setAssignmentCount((prev) => [
      ...prev,
      { id: prev.length, name: "", count: 0 },
    ]);
  };

  console.log({ record });

  const handleUpdate = async (values: RecordValue) => {
    console.log("values:::::", values);
    try {
      await dataProvider.update(resource, {
        id: record?.id,
        data: values,
        previousData: record,
      });

      notify(UPDATED_SUCCESS, {
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
    console.log("record:::::", record);

    if (record) {
      console.log("record.id:::::", record.assignments);

      const assignments = record.assignments || [];
      const assignmentList = assignments.map((assignment, index) => ({
        id: assignment.assignmentId,
        name: "",
      }));

      console.log("assignmentList:::::", assignmentList);

      setAssignmentCount(
        assignmentList.map((item, index) => ({
          id: index,
          name: item.name,
          count: 0,
        }))
      );
    }
  }, [record]);
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await baseDataProvider.getAll("assignments");
        const formattedAssignments = response.data.map((assignment) => ({
          id: assignment._id,
          name: assignment.name,
        }));
        setAssignments(formattedAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <Box sx={boxStyles}>
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
          <TextInput source="nameRoom" isRequired label="Tên lớp học" />
          <DateTimeInput
            source="dateStart"
            fullWidth
            label="ngày bắt đầu"
            isRequired
          />
          <DateTimeInput
            source="dateEnd"
            fullWidth
            label="ngày kết thúc"
            isRequired
          />
          <Box sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="info"
              sx={{ padding: "5px 10px !important" }}
              onClick={handleAddAssignment}
            >
              <Box sx={{ fontSize: "15px !important" }}>Thêm</Box>
            </Button>
          </Box>

          <Box
            sx={{
              gap: "20px",
              marginTop: "10px",
              width: "100%",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {assignmentCount &&
              assignmentCount.map((item, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      marginTop: "10px",
                      width: "100%",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    <Box>{index + 1}.</Box>
                    <SelectInput
                      source={`assignments[${index}].assignmentId`}
                      choices={assignments}
                      isRequired
                      defaultValue={2}
                      label="Bài tập (*)"
                    />
                    <DateTimeInput
                      source={`assignments[${index}].datePublic`}
                      fullWidth
                      label="Ngày được công khai"
                      isRequired
                    />
                  </Box>
                );
              })}
          </Box>
        </CustomForm>
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
