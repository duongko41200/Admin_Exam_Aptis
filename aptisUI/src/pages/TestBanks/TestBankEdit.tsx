import { ROLE_ACCOUNT, userRoles } from "../../consts/user";
import { useNotify, useRecordContext, EditBase, Title } from "react-admin";
import CustomForm from "../../components/CustomForm";
import { validateUserEdition } from "./formValidator";
import { BaseComponentProps, RecordValue } from "../../types/general";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { boxStyles } from "../../styles";
import TestBankCreate from "./TestBankCreate";

const TesBankEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext();

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <Box>
          <TestBankCreate recordEdit={record} statusHandler='edit'/>
        </Box>
      </EditBase>
    </Box>
  );
};

const TestBankEdit = (props: BaseComponentProps) => {
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <TesBankEditForm {...props} />
      </EditBase>
    </Box>
  );
};

export default TestBankEdit;
