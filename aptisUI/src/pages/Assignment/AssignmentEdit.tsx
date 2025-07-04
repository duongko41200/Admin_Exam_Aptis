import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  CheckboxGroupInput,
  DateTimeInput,
  EditBase,
  SelectInput,
  TextInput,
  Title,
  useNotify,
  useRecordContext,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import CustomForm from "../../components/CustomForm";
import { UPDATED_SUCCESS } from "../../consts/general";
import { boxStyles } from "../../styles";
import { BaseComponentProps, RecordValue } from "../../types/general";
import { validateUserEdition } from "./formValidator";
import { useForm } from "react-hook-form";

const skillList = [
  {
    id: "reading",
    name: "Reading",
  },
  {
    id: "writing",
    name: "Writing",
  },
  { id: "listening", name: "Listening" },
  { id: "speaking", name: "Speaking" },
];
const FIRST_INDEX = 0;
const skills = ["LISTENING", "SPEAKING", "READING", "WRITING"];
const partListMap = {
  listening: [
    { id: "1", name: "Part 1" },
    { id: "2", name: "Part 2" },
    { id: "3", name: "Part 3" },
    { id: "4", name: "Part 4" },
  ],
  speaking: [
    { id: "1", name: "Part 1" },
    { id: "2", name: "Part 2" },
    { id: "3", name: "Part 3" },
    { id: "4", name: "Part 4" },
  ],
  reading: [
    { id: "1", name: "Part 1" },
    { id: "2", name: "Part 2" },
    { id: "3", name: "Part 3" },
    { id: "4", name: "Part 4" },
    { id: "5", name: "Part 5" },
  ],
  writing: [
    { id: "1", name: "Part 1" },
    { id: "2", name: "Part 2" },
    { id: "3", name: "Part 3" },
    { id: "4", name: "Part 4" },
  ],
};
const AssignmentEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const notify = useNotify();
  const navigate = useNavigate();
  const record = useRecordContext();

  const form = useForm();
  const { setValue } = form;
  const [userLogin, setUserLogin] = useState({ id: null, role: null });
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDisableName, setIsDisableName] = useState(false);

  const [testBankList, setTestBankList] = useState([]);
  const [partList, setPartList] = useState(
    partListMap[record?.partOfSkill] || []
  );

  const [selectedTestBank, setSelectedTestBank] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedPart, setSelectedPart] = useState("");

  const [boDe, setBoDe] = useState([]);

  const [options, setOptions] = useState([]);

  const handleOnChangeTestBank = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedBank = event.target.value;
    setSelectedTestBank(selectedBank);
    const res = await dataProvider.getOne("test-banks", {
      id: selectedBank,
    });

    console.log("Test Bank Data:", res.data);

    const TestBankData = res.data;
    setBoDe(TestBankData);

    // Reset skill and part selections when test bank changes
    setSelectedSkill("");
    setSelectedPart("");
    setPartList([]);
  };

  const handleOnChangeSkill = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSkill = event.target.value;
    const parts = partListMap[selectedSkill] || [];
    setPartList(parts);
    setSelectedSkill(selectedSkill);
  };

  const handleOnChangePart = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!selectedTestBank) {
      notify("Bạn chưa chọn bộ đề ", { type: "error" });
      return;
    }
    const selectedPart = event.target.value;
    console.log("Selected Part:", selectedPart);

    setSelectedPart(selectedPart);

    console.log("Test ::: ", record?.partOfSkill.toString(), selectedPart);

    // if (selectedPart !== record?.partOfSkill.toString()) {

    // }
  };

  useEffect(() => {
    if (!boDe) return;
    const metadata: any = boDe;

    console.log("boDe::::", boDe);
    if (!metadata) {
      console.error("No metadata found in the selected test bank");
      return;
    }

    console.log("Metadata::::", metadata);
    const currentSkill = selectedSkill || "";
    const currentPart = parseInt(selectedPart) || 0;

    console.log("currentSkill", currentSkill);
    console.log("currentPart:::::::", currentPart);
    let arr = [];

    const getQuestionLabel = (q) => ({
      id: q._id,
      name: q.content || q.title,
    });

    if (currentSkill === "listening" && metadata?.listening) {
      const partData = metadata.listening[`part${currentPart}`] || [];
      partData.forEach((item) => {
        const questions = item.questions;
        if (currentPart === 1) {
          arr.push(...questions[FIRST_INDEX].subQuestion.map(getQuestionLabel));
        } else {
          arr.push(...questions.map(getQuestionLabel));
        }
      });
    }

    if (currentSkill === "speaking" && metadata?.speaking) {
      const partData = metadata.speaking[`part${currentPart}`] || [];

      console.log("partData", partData);

      if (currentPart === 2 || currentPart === 3 || currentPart === 4) {
        arr.push(...partData.map(getQuestionLabel));
      } else {
        partData.forEach((item) => {
          const q = item.questions[FIRST_INDEX];
          if (q.subQuestion) {
            arr.push(...q.subQuestion.map(getQuestionLabel));
          } else {
            arr.push(getQuestionLabel(q));
          }
        });
      }
    }

    if (currentSkill === "writing" && metadata?.writing) {
      const partData = metadata.writing[`part${currentPart}`] || [];
      partData.forEach((item) => {
        const q = item.questions[FIRST_INDEX];
        arr.push(getQuestionLabel(q));
      });
    }

    if (currentSkill === "reading" && metadata?.reading) {
      // Reading cấu trúc khác -> cần kiểm tra kỹ
      const remap = {
        part1: metadata.reading.part1,
        part2: [...metadata.reading.part2, ...metadata.reading.part3],
        part3: metadata.reading.part4,
        part4: metadata.reading.part5,
      };

      const data = remap[`part${currentPart}`] || [];
      data.forEach((item) => {
        const questions = item.data?.questions || [];
        if (Array.isArray(questions)) {
          arr.push(...questions.map(getQuestionLabel));
        } else {
          arr.push(getQuestionLabel(questions));
        }
      });
    }

    console.log("arr:::", arr);

    setOptions(arr);
  }, [selectedSkill, selectedPart, boDe]);

  const fetchData = async () => {
    const response = await dataProvider.getAll("test-banks");

    const testBanks = response.data;

    if (!testBanks || testBanks.length === 0) {
      console.error("No test banks found");
      return;
    }

    const formattedTestBanks = testBanks.map((bank) => ({
      id: bank._id,
      name: bank.title,
    }));

    setTestBankList(formattedTestBanks);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (record) {
      console.log("record:::::", record);
      const parts = partListMap[record.skill] || [];

      setSelectedTestBank(record.MaBoDe || "");

      setPartList(parts);
      setSelectedPart(record.partOfSkill || "");
      setSelectedSkill(record.skill);
      setSelectedPart(record.partOfSkill.toString() || "");

      console.log("record.partOfSkill", record.partOfSkill.toString());

      const fetchtestBanks = async () => {
        const res = await dataProvider.getOne("test-banks", {
          id: record.MaBoDe,
        });

        const TestBankData = res.data;

        console.log("Test Bank Data:", TestBankData);
        setBoDe(TestBankData);
      };

      fetchtestBanks();
    }
  }, [record]);

  const handleUpdate = async (values: RecordValue) => {
    console.log("values:::::", values);
    try {
      await dataProvider.update(resource, {
        id: record?.id,
        data: values,
        previousData: record,
      });

      await notify(UPDATED_SUCCESS, {
        type: "success",
      });
      navigate(resourcePath);
    } catch (error) {
      notify("エラー: 生産管理の更新に失敗しました: " + error, {
        type: "warning",
      });
    }
  };

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
          <TextInput source="name" isRequired label="Tên bài học" />
          <TextInput source="description" label="mô tả thêm về bài học " />
          <DateTimeInput source="dueDate" fullWidth label="Ngày hết hạn" />
          <SelectInput
            source="MaBoDe"
            choices={testBankList}
            isRequired
            label="Chọn bộ đề"
            onChange={handleOnChangeTestBank}
          />

          <SelectInput
            source="skill"
            choices={skillList}
            isRequired
            label="Chọn kỹ năng"
            onChange={handleOnChangeSkill}
          />
          <SelectInput
            source="partOfSkill"
            choices={partList}
            isRequired
            label="Chọn PART cho kỹ năng"
            onChange={handleOnChangePart}
          />
          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              width: "100%",
              marginBottom: "15px",
            }}
          >
            <CheckboxGroupInput
              source="idQues"
              row={false}
              choices={options}
              label="Danh sách câu hỏi"
            />
          </Box>
        </CustomForm>
      </EditBase>
    </Box>
  );
};

const AssignmentEdit = (props: BaseComponentProps) => {
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <AssignmentEditForm {...props} />
      </EditBase>
    </Box>
  );
};

export default AssignmentEdit;
