
export const boxStyles = {
  backgroundColor: "#fff",
  color: "#000000de",
  WebkitTransition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  borderRadius: "4px",
  boxShadow:
    "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  overflow: "auto",
  marginTop: "1em",

};

export const disabledInputBackgroundStyle = {
  "& .MuiFilledInput-input": {
    background: "#f4f4f5c4",
  },
  "& .Mui-disabled": {
    WebkitTextFillColor: "#4d4d4d !important",
  },
};

export const textareaStyles = {
  width: "100%",
  height: 500,
  padding: "20px",
  borderRadius: 4,
  background: "#f8f8f8",
  fontSize: 16,
  overflow: "auto",
};

export const imageFieldStyles = {
  "& img": {
    maxWidth: 100,
    maxHeight: 100,
    objectFit: "contain",
  },
};

export const styleBoxCustom = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 5,
  paddingTop: "6px",
  paddingRight: "12px",
  paddingBottom: "4px",
  paddingLeft: "12px",
  boxSizing: "content-box",
  color: "rgba(0, 0, 0, 0.6)",
  background: "rgba(0, 0, 0, 0.04)",
  marginTop: "8px",
  marginBottom: "4px",
  fontWeight: "400",
  fontSize: "1rem",
  lineHeight: "1.4375em",
  letterSpacing: "0.00938em",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  borderBottom: "1px solid",
  borderColor: "light-dark(rgb(118, 118, 118), rgb(133, 133, 133))",
  width: "fit-content",
  minWidth: "300px",
};
export const smallHelperTextStyle = {
  "& .MuiFormHelperText-root": {
    lineHeight: "1",
    width: "fit-content !important",
    display: "none",
  },
};

export const noMarginVertical = {
  "& .MuiTextField-root": {
    margin: "0px 0px",
  },
};

export const smallTextInputStyles = {
  "& .MuiOutlinedInput-input": {
    padding: "8px 8px 8px 8px",
    height: "1.2rem",
    backgroundColor: "#fff",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
  },
  ...noMarginVertical,
  ...smallHelperTextStyle,
};

export const wrapperCenter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const customStyleBox = {
  backgroundColor: "#fff",
  marginTop: "20px",
  color: " rgba(0, 0, 0, 0.87)",
  transition: " box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  borderRadius: "4px",
  boxShadow:
    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
  width: "100%",
  overflowY: "auto",
};

export const textInputStylesProduct = {
  "& .MuiOutlinedInput-input": {
    padding: "8px 8px 8px 8px",
    height: "1.2rem",
    backgroundColor: "#fff",
    width: "100%",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
  },
  "& .MuiInputBase-root": {
    width: "fit-content !important",
  },
  ...noMarginVertical,
  ...smallHelperTextStyle,
};

export const stylesInpection = {
  dropzone: {
    position: "relative",
    margin: "20px 0",
    top: "0",
    left: "0",
    border: "2px dashed #4267b2",
    width: "100%",
    height: "80px",
    cursor: "pointer",
  },
  dropzoneContent: {
    display: "flex",
    justifyContent: "center",
    height: "70px",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fafafb",
    color: "rgba(0, 0, 0, 0.87)",
    fontWeight: "500",
    cursor: "pointer",
    border: "1px dashed", // Changed to dashed
  },
  inputFile: {
    opacity: "0",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
    border: "1px dashed", // Changed to dashed
    cursor: "progress",
  },
  infoBox: {
    ...customStyleBox,
    maxHeight: "500px",
    overflow: "auto",
  },
  listBox: {
    ...customStyleBox,
    maxHeight: "500px",
    overflow: "auto",
  },
  imageBox: {
    display: "flex",
    gap: "10",
    justifyContent: "space-between",
    width: "500px",
    padding: "10px 20px",
  },
  imageContainer: {
    ...wrapperCenter,
    width: "150px",
    height: "fit-content",
  },
  deleteButton: {
    ...wrapperCenter,
  },
  loadingBox: {
    display: "flex",
    gap: "10",
    justifyContent: "space-between",
    width: "500px",
    padding: "20px 20px",
  },
};
