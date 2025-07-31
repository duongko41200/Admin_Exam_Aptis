import { useForm, FormProvider } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { useListContext, SearchInput, SelectInput } from "react-admin";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const ProductFilterForm = ({
  productResource,
  classrooms,
}: {
  productResource: string;
  classrooms: { id: string; name: string }[];
}) => {
  const { displayedFilters, filterValues, setFilters, hideFilter } =
    useListContext();

  const form = useForm({
    defaultValues: filterValues,
  });

  const onSubmit = (values: { name: string }) => {
    if (Object.keys(values).length > 0) {
      setFilters(values, displayedFilters);
    } else {
      hideFilter("main");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Box
          width="40%"
          display="flex"
          sx={{
            margin: "10px 0 0",
            columnGap: "1%",
            alignItems: "start",
          }}
        >
          <SearchInput
            key={1}
            source="name"
            alwaysOn
            placeholder="Tìm kiếm tên người dùng"
            sx={{
              "& .MuiFormHelperText-root": { display: "none" },

              "& .MuiInputBase-root": {
                height: "48px !important",
                margin: "0 !important",
              },
            }}
          />

          <SelectInput
            key="classRoomId"
            source="classRoomId"
            label="Lớp học"
            choices={classrooms}
            emptyText=" Tất cả lớp học"
            sx={{
              // Giảm margin của FormControl (phần bao ngoài)
              "& .MuiFormControl-root": {
                margin: "0 !important",
                width: "100px !important",
              },
              // Hoặc dùng chính root luôn (tùy mục tiêu)
              margin: 0,
              width: "100px !important",
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ height: "48px", padding: "10px 16px" }}
          >
            Submit
          </Button>
        </Box>
        <Box
          width="60%"
          display="flex"
          sx={{
            margin: "0 ",
            columnGap: "5%",
          }}
        ></Box>
      </form>
    </FormProvider>
  );
};

export { ProductFilterForm };
