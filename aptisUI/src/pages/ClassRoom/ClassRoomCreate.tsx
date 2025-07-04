import {
  Button,
  Create,
  DateTimeInput,
  SelectInput,
  TextInput,
  useNotify,
} from "react-admin";

import CustomForm from "../../components/CustomForm";
import { BaseComponentProps } from "../../types/general";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { UPDATED_SUCCESS } from "../../consts/general";
import baseDataProvider from "../../providers/dataProviders/baseDataProvider";

const ClassRoomCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const notify = useNotify();
  const navigate = useNavigate();
  // assignments should be fetched from the server or context
  const [asssignments, setAssignments] = useState([]);

  const [assignmentCount, setAssignmentCount] = useState([]);

  const handleAddAssignment = () => {
    setAssignmentCount((prev) => [
      ...prev,
      { id: prev, name: "", count: 0 },
    ]);
  };
  const handleSave = async (values) => {
    // Handle the save logic here, e.g., send values to the server
    console.log("Saving values:", values);
    try {
      await baseDataProvider.create("classrooms", { data: values });
      notify(UPDATED_SUCCESS, { type: "success" });
      navigate(`/${resource}`);
    } catch (error) {
      console.error(error);
      notify("Không tạo thành công", { type: "error" });
    }
  };

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
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomForm
        pathTo={resourcePath}
        // validate={validateUserCreation}
        showDeleteButton={false}
        handleSave={handleSave}
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
          {assignmentCount && assignmentCount.length > 0 ? (
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
                  }}
                >
                  <Box>{index + 1}.</Box>
                  <SelectInput
                    source={`assignments[${index}].assignmentId`}
                    choices={asssignments}
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
            })
          ) : (
            <Box> Hãy nhấn nút Thêm để có thêm thêm Assignment </Box>
          )}
        </Box>
      </CustomForm>
    </Create>
  );
};

export default ClassRoomCreate;
