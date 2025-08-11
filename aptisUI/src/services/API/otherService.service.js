import ApiService from "./api.service";



const serviceURL = "other";

const OtherService = {
  //suy nghĩ xem gộp api của câu vào không
  textToVoice(param) {
    return ApiService.get(
      `${serviceURL}/text-to-voice`,
      {
        "x-api-key": process.env.NEXT_PUBLIC_APP_API_KEY,
        "x-client-id": localStorage.getItem("userId"),
        authorization: localStorage.getItem("accessToken"),
      },
      { ...param }
    );
  },
};

export default OtherService;
