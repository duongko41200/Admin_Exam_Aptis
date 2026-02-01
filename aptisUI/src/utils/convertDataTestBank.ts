export const convertDataReadingBank = (data: any, part: number) => {
  if (part === 1) {
    // Conversion logic for part 1
    return data.map((item: any) => ({
      id: item._id,
      text: item.data.questions.questionTitle ,
      options: item.data.questions.subQuestion.map((subQ: any) => subQ.content),
      type: item.data.description,
      skill: "Reading",
      part: 1,
    }));
  }
  if (part === 2 || part === 3) {
    // Conversion logic for part 2 and 3
    return data.map((item: any) => ({
      id: item._id,
      text: item.data.questions.questionTitle,
      options: item.data.questions.answerList.map((subQ: any) => subQ.content),
      type: item.data.description,
      skill: "Reading",
      part: part,
    }));
  }
  if (part === 4) {
    // Conversion logic for part 4
    return data.map((item: any) => ({
      id: item._id,
      text: item.data.questions.questionTitle,
      options: item.data.questions.answerList.map((subQ: any) => subQ.content),
      type: item.data.description,
      skill: "Reading",
      part: 4,
    }));
  }
  if (part === 5) {
    // Conversion logic for part 5
    return data.map((item: any) => ({
      id: item._id,
      text: item.data.questions.questionTitle,
      options: item.data.questions.subQuestion.map((subQ: any) => subQ.content),
      type: item.data.description,
      skill: "Reading",
      part: 5,
    }));
  }
  return [];
};

export const convertDataListeningBank = (data: any, part: number) => {
  // Add conversion logic for Listening bank based on part

  if (part === 1) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].content,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Listening",
      part: 1,
    }));
  }
  if (part === 2) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].questionTitle,
      options: item.questions[0].answerList.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Listening",
      part: 2,
    }));
  }
  if (part === 3) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].questionTitle,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Listening",
      part: 3,
    }));
  }
  if (part === 4) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].questionTitle,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Listening",
      part: 4,
    }));
  }
};

export const convertDataWritingBank = (data: any, part: number) => {
  // Add conversion logic for Writing bank based on part
  if (part === 1) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].questionTitle,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 1,
    }));
  }
  if (part === 2) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].questionTitle,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 2,
    }));
  }

  if (part === 3) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].questionTitle,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 3,
    }));
  }
  if (part === 4) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].questionTitle,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 4,
    }));
  }
};

export const convertDataSpeakingBank = (data: any, part: number) => {
  // Add conversion logic for Writing bank based on part
  if (part === 1) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].content,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 1,
    }));
  }
  if (part === 2) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].content,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 2,
    }));
  }

  if (part === 3) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].content,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 3,
    }));
  }
  if (part === 4) {
    return data.map((item: any) => ({
      id: item._id,
      text: item.questions[0].content,
      options: item.questions[0].subQuestion.map((subQ: any) => subQ.content),
      type: item.description,
      skill: "Writing",
      part: 4,
    }));
  }
};
