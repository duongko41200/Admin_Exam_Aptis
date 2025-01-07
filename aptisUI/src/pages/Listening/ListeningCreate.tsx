import { Create, PasswordInput, SelectInput, TextInput } from "react-admin";
import { userRoles } from "../../consts/user";

import CustomForm from "../../components/CustomForm";
import { BaseComponentProps } from "../../types/general";
import { validateUserCreation } from "./formValidator";
import dataProvider from "../../providers/dataProviders/dataProvider";
import CustomTabPanel from "../../components/Tabs/TabsMenuListening";

const ListeningCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomTabPanel></CustomTabPanel>
    </Create>
  );
};

export default ListeningCreate;
