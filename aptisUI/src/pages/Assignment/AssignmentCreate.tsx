import { useEffect, useState } from "react";
import {
  Create,
  DateTimeInput,
  SelectInput,
  TextInput,
  useNotify,
} from "react-admin";

import { Box } from "@mui/material";
import { CheckboxGroupInput } from "react-admin";
import CustomForm from "../../components/CustomForm";
import dataProvider from "../../providers/dataProviders/dataProvider";
import { BaseComponentProps } from "../../types/general";

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

const AssignmentCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const notify = useNotify();
  // const form = useForm();
  const [testBankList, setTestBankList] = useState([]);
  const [partList, setPartList] = useState([]);

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
    const res = await dataProvider.getOneExtend("test-banks", {
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
  }, [selectedSkill, selectedPart]);

  const handleSave = async (values: any) => {
    console.log("Saving values:", values);
    try {
      await dataProvider.create(resource, { data: values });
      // form.change("idQues", []);
      // form.change("name", "");
      // form.change("description", "");
      notify("Tạo mới thành công", { type: "success" });
    } catch (error) {
      console.error(error);
      notify("Không tạo thành công", { type: "error" });
    }
  };

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

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomForm
        pathTo={resourcePath}
        // validate={validateUserCreation}
        showDeleteButton={false}
        handleSave={handleSave}
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
    </Create>
  );
};

export default AssignmentCreate;
