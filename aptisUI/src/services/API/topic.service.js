import ApiService from "./api.service";

const serviceURL = "topic";
const TopicService = {
  getAllTopic() {
    return ApiService.get(
      `${serviceURL}/all`,
      {
        "x-api-key": process.env.NEXT_PUBLIC_APP_API_KEY,
        "x-client-id": localStorage.getItem("userId"),
        authorization: localStorage.getItem("accessToken"),
      },
      {}
    );
  },
};

export default TopicService;
