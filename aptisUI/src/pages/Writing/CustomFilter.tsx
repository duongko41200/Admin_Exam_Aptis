import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Grid, useTheme, alpha, Typography } from "@mui/material";
import { useListContext, SearchInput, SelectInput } from "react-admin";
import {
  Search as SearchIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const ProductFilterForm = ({
  productResource,
}: {
  productResource: string;
}) => {
  const theme = useTheme();
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
        <Grid container spacing={3} alignItems="center">
          {/* Search Input - Wider */}
          <Grid item xs={12} sm={12} md={6} lg={5}>
            <Box sx={{ position: "relative" }}>
              <SearchInput
                source="title"
                alwaysOn
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                sx={{
                  width: "100%",
                  "& .MuiFormHelperText-root": {
                    display: "none",
                  },
                  "& .MuiFormControl-root": {
                    marginBottom: "0 !important",
                    width: "100%",
                  },
                  "& .MuiInputBase-root": {
                    height: {
                      md: "40px",
                      xs: "35px",
                      xl: "52px",
                    },
                    backgroundColor: "white",
                    borderRadius: 3,

                    border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                    fontSize: "0.95rem",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    },
                    "& .Mui-focused": {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 4px 16px ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )}`,
                      transform: "translateY(-1px)",
                    },

                    "& .MuiInputBase-input": {
                      padding: "16px 16px 16px 50px !important",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    },
                    transition: "all 0.2s ease-in-out",
                  },
                  "& .MuiInputAdornment-root": {
                    position: "absolute",
                    left: 16,
                    zIndex: 1,
                    color: theme.palette.text.secondary,
                    "& .MuiSvgIcon-root": {
                      fontSize: "1.2rem",
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Select Part Filter */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <SelectInput
              source="questionPart"
              choices={[
                { id: "ONE", name: "Part 1" },
                { id: "TWO", name: "Part 2" },
                { id: "THREE", name: "Part 3" },
                { id: "FOUR", name: "Part 4" },
              ]}
              alwaysOn
              label="Chọn Part"
              sx={{
                width: "100%",
                "& .MuiFormControl-root": {
                  margin: "0 !important",
                  width: "100%",
                },

                "& .MuiInputBase-root": {
                  height: {
                    md: "40px",
                    xs: "35px",
                    xl: "52px",
                  },
                  backgroundColor: "white",
                  borderRadius: 3,
                  border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                  fontSize: "0.95rem",
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    boxShadow: `0 2px 8px ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  },
                  "& .Mui-focused": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 4px 16px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiFormHelperText-root": {
                  display: "none",
                },
                "& .MuiSelect-select": {
                  padding: "16px",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                },
              }}
            />
          </Grid>

          {/* Submit Button - Enhanced */}
          <Grid item xs={12} sm={4} md={2} lg={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<SearchIcon />}
              sx={{
                height: {
                  md: "40px",
                  xs: "35px",
                  xl: "52px",
                },
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 16px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>

        {/* Quick Filter Tags */}
        <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              mr: 1,
              alignSelf: "center",
            }}
          >
            Lọc nhanh:
          </Typography>

          <Button
            size="small"
            variant="text"
            onClick={() => {
              // Clear all filters
              setFilters({}, []);
            }}
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.05),
                color: theme.palette.error.main,
              },
            }}
          >
            🗑️ Xóa bộ lọc
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export { ProductFilterForm };
