import { Create } from "react-admin";
import { BaseComponentProps } from "../../types/general";
import CustomTabPanel from "../../components/Tabs/TabsMenuListening";

const ListeningCreate = ({ resource }: BaseComponentProps) => {
  return (
    <Create redirect="list" title="Listening Management - Create">
      <CustomTabPanel />
    </Create>
  );
};

export default ListeningCreate;
