import { Create, PasswordInput, SelectInput, TextInput } from "react-admin";
import { userRoles } from "../../consts/user";

import CustomForm from "../../components/CustomForm";
import { BaseComponentProps } from "../../types/general";
import { validateUserCreation } from "./formValidator";
import dataProvider from "../../providers/dataProviders/dataProvider";
import CustomTabPanel from "../../components/Tabs/TabsMenu";
import ReadingPartOne from "./ReadingPart/ReadingPartOne";

const ReadingCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;
  const handleSave = async (values: any) => {
    try {
      const data = {
        title: "Reading 5 - BC",
        timeToDo: 35,
        questions: [
          {
            questionTitle: "Reading - Test 5 - Part 1",
            content:
              '<p><strong style="color: rgb(22, 22, 22);">Read the email from Janice to her friend.&nbsp;Choose one word from the list for each gap. The first one is done for you.</strong></p><p><span style="color: rgb(22, 22, 22);">﻿Dear Sally,</span></p> tentisspace <p>Love,</p><p>Janice</p>',
            answerList: [],
            correctAnswer: "",
            file: null,
            subQuestionAnswerList: [],
            suggestion: null,
            subQuestion: [
              {
                content:
                  "Tim and I are on holiday in Greece. We have a nice  tentisspace  of the sea from our hotel.",
                correctAnswer: "view",
                file: null,
                answerList: [],
                image: null,
                suggestion: null,
              },
              {
                content: "The weather is  tentisspace  and it’s really hot.",
                correctAnswer: "large",
                file: null,
                answerList: [
                  {
                    content: "large",
                  },
                  {
                    content: "great",
                  },
                  {
                    content: "big",
                  },
                ],
                image: null,
                suggestion: null,
              },
              {
                content:
                  "Yesterday we went on a  tentisspace  Yesterday we went on a",
                correctAnswer: "train",
                file: null,
                answerList: [
                  {
                    content: "boat",
                  },
                  {
                    content: "train",
                  },
                  {
                    content: "bus",
                  },
                ],
                image: null,
                suggestion: null,
              },
              {
                content:
                  "We had lunch and then we visited an old   tentisspace",
                correctAnswer: "cup",
                file: null,
                answerList: [
                  {
                    content: "window.",
                  },
                  {
                    content: "cup.",
                  },
                  {
                    content: "town.",
                  },
                ],
                image: null,
                suggestion: null,
              },
            ],
            questionType: "READING",
            isExample: false,
            questionPart: "ONE",
            image: null,
          },
        ],
        skill: "READING",
        description: null,
      };

      const CreateData = await dataProvider.create(resource, { data });
      console.log({ CreateData });
    } catch (error) {
      console.log({ error });
    }
  };



  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomTabPanel></CustomTabPanel>
      
      
    </Create>
  );
};

export default ReadingCreate;
