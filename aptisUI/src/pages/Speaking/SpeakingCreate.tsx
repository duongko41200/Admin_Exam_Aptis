import { Create } from "react-admin";

import CustomTabPanel from "../../components/Tabs/TabsMenuSpeaking";
import { BaseComponentProps } from "../../types/general";

const SpeakingCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomTabPanel></CustomTabPanel>
    </Create>
  );
};

export default SpeakingCreate;
