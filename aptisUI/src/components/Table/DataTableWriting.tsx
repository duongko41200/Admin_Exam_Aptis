import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box } from "@mui/material";
import clsx from "clsx";
import { GridColDef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { SET_TESTBANK_DATA } from "../../store/feature/testBank";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "title",
    headerName: "Tiêu đề",
    description: "tiêu đề chính từng bài tập",
    width: 130,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "subTitle",
    headerName: "Tiêu đề phụ",
    description: "tiêu đề Phu từng bài tập",
    width: 130,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "timeToDo",
    headerName: "Thời gian",
    description: "thời gian làm bài",
    width: 130,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "questionPart",
    headerName: "Part ",
    type: "string",
    width: 90,
    cellClassName: (params) => {
      if (params.value == null) {
        return "";
      }

      return clsx("super-app", {
        negative: params.value === "FOUR",
        positive: params.value !== "FOUR",
      });
    },
  },
  {
    field: "createdAt",
    headerName: "Thời gian tạo",
    description: "Thời gian tạo bài tập",
    sortable: false,
    width: 160,
    headerClassName: "super-app-theme--header",
  },
  {
    field: "updatedAt",
    headerName: "Thời gian Update",
    description: "Thời gian Cập nhập  bài tập",
    sortable: false,
    width: 160,
    headerClassName: "super-app-theme--header",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTableWriting({
  rows,
  partSkill,
}: {
  rows: any;
  partSkill: any;
}) {
  const [selectionModel, setSelectionModel] = React.useState([]);

  const dispatch = useDispatch();
  const testBankData = useSelector(
    (state: any) => state.testBankStore.testBankData
  );

  const handleSelectionChange = (newSelection: any) => {
    setSelectionModel(newSelection);
    const payload = { type: "writing", newSelection, partSkill };
    dispatch(SET_TESTBANK_DATA(payload));
  };

  React.useEffect(() => {

    console.log("testBankData là: ", testBankData);
    setSelectionModel(testBankData["writing"][`part${partSkill}`]);
  }, []);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <Box
        sx={{
          height: 300,
          width: "100%",
          "& .super-app-theme--cell": {
            backgroundColor: "rgba(224, 183, 60, 0.55)",
            color: "#1a3e72",
            fontWeight: "600",
          },
          "& .super-app.negative": {
            backgroundColor: "rgba(157, 255, 118, 0.49)",
            color: "#1a3e72",
            fontWeight: "600",
          },
          "& .super-app.positive": {
            backgroundColor: "#d47483",
            color: "#1a3e72",
            fontWeight: "600",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={handleSelectionChange}
          sx={{ border: 0 }}
          //   loading
          //   slotProps={{
          //     loadingOverlay: {
          //       variant: "linear-progress",
          //       noRowsVariant: "skeleton",
          //     },
          //   }}
        />
      </Box>
    </Paper>
  );
}
