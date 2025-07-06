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
  FormDataConsumer,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import CustomForm from "../../components/CustomForm";
import { UPDATED_SUCCESS } from "../../consts/general";
import { boxStyles } from "../../styles";
import { BaseComponentProps, RecordValue } from "../../types/general";
import { useFormContext } from "react-hook-form";
import baseDataProvider from "../../providers/dataProviders/dataProvider";

const skillList = [
  { id: "reading", name: "Reading" },
  { id: "writing", name: "Writing" },
  { id: "listening", name: "Listening" },
  { id: "speaking", name: "Speaking" },
];

const FIRST_INDEX = 0;

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

  const [testBankList, setTestBankList] = useState([]);
  const [partList, setPartList] = useState([]);
  const [selectedTestBank, setSelectedTestBank] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [boDe, setBoDe] = useState([]);
  const [options, setOptions] = useState([]);
  const [idQuesMap, setIdQuesMap] = useState<{ [part: string]: string[] }>({});

  const handleOnChangeTestBank = async (event) => {
    const selectedBank = event.target.value;
    setSelectedTestBank(selectedBank);
    const res = await dataProvider.getOneExtend("test-banks", { id: selectedBank });
    setBoDe(res.data);
    setSelectedSkill("");
    setSelectedPart("");
    setPartList([]);
  };

  const handleOnChangeSkill = (event) => {
    const skill = event.target.value;
    setSelectedSkill(skill);
    setPartList(partListMap[skill] || []);
  };

  const handleOnChangePart = (event) => {
    setSelectedPart(event.target.value);
  };

  useEffect(() => {
    if (!boDe) return;
    const metadata: any = boDe;
    const currentSkill = selectedSkill || "";
    const currentPart = parseInt(selectedPart) || 0;
    let arr = [];

    const getQuestionLabel = (q) => ({ id: q._id, name: q.content || q.title });

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
      if ([2, 3, 4].includes(currentPart)) {
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

    setOptions(arr);
  }, [selectedSkill, selectedPart, boDe]);

  useEffect(() => {
    const fetch = async () => {
      const res = await dataProvider.getAll("test-banks");
      setTestBankList(res.data.map((b) => ({ id: b._id, name: b.title })));
    };
    fetch();
  }, []);

  useEffect(() => {
    if (record) {
      const parts = partListMap[record.skill] || [];
      setSelectedTestBank(record.MaBoDe || "");
      setSelectedSkill(record.skill);
      setSelectedPart(record.partOfSkill.toString() || "");
      setPartList(parts);
      const fetchBoDe = async () => {
        const res = await dataProvider.getOneExtend("test-banks", {
          id: record.MaBoDe,
        });
        setBoDe(res.data);
      };
      fetchBoDe();
    }
  }, [record]);

  const handleUpdate = async (values: RecordValue) => {
    try {
      await dataProvider.update(resource, {
        id: record?.id,
        data: values,
        previousData: record,
      });
      notify(UPDATED_SUCCESS, { type: "success" });
      navigate(resourcePath);
    } catch (error) {
      notify("Cập nhật thất bại", { type: "warning" });
    }
  };

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="Chỉnh sửa bài học" />
        <CustomForm
          pathTo={resourcePath}
          showDeleteButton={false}
          showSaveButton
          showCancelButton
          handleSave={handleUpdate}
        >
          <TextInput source="name" isRequired label="Tên bài học" />
          <TextInput source="description" label="Mô tả" />
          <DateTimeInput source="dueDate" fullWidth label="Ngày hết hạn" />
          <SelectInput
            source="MaBoDe"
            choices={testBankList}
            isRequired
            label="Chọn bộ đề"
            disabled
            onChange={handleOnChangeTestBank}
          />
          <SelectInput
            source="skill"
            choices={skillList}
            isRequired
            label="Chọn kỹ năng"
            disabled
            onChange={handleOnChangeSkill}
          />
          <SelectInput
            source="partOfSkill"
            choices={partList}
            isRequired
            label="Chọn PART"
            onChange={handleOnChangePart}
            disabled
          />

          <FormDataConsumer>
            {({ formData }) => {
              const { setValue, getValues } = useFormContext();
              const currentPart = formData.partOfSkill;

              // console.log("Current Part:", currentPart);
              // console.log("record:", record);
              const currentValues = getValues("idQues");
              // console.log("Current Values:", currentValues);
              // console.log("Current idQuesMap:", idQuesMap);

              // if (currentPart && !idQuesMap[currentPart]) {
              //   setIdQuesMap((prev) => ({
              //     ...prev,
              //     [currentPart]: currentValues,
              //   }));
              // }
              // useEffect(() => {
              //   if (!currentPart) return;

              //   console.log("Updating idQuesMap for part:", currentPart);
              //   console.log("Current Values:", idQuesMap);

              //   const currentValues = getValues("idQues") || [];

              //   console.log("Current Values:", currentValues);
              //   setIdQuesMap((prev) => ({
              //     ...prev,
              //     [record.partOfSkill]: currentValues,
              //   }));

              //   setValue("idQues", idQuesMap[currentPart] || []);
              // }, []);

              return (
                <CheckboxGroupInput
                  source="idQues"
                  choices={options}
                  key={currentPart}
                  label="Danh sách câu hỏi"
                  row={false}
                />
              );
            }}
          </FormDataConsumer>
        </CustomForm>
      </EditBase>
    </Box>
  );
};

const AssignmentEdit = (props: BaseComponentProps) => (
  <Box sx={boxStyles}>
    <EditBase>
      <AssignmentEditForm {...props} />
    </EditBase>
  </Box>
);

export default AssignmentEdit;
