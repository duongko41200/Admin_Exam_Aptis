import ApiService from "./api.service";

const serviceURL = "test-banks";

const TestBankService = {
  createWord({ TestBank, defind, topicId, typeTestBank, attributes }) {
    return ApiService.post(`${serviceURL}/info/all`, {
      TestBank,
      defind,
      topicId,
      typeTestBank,
      attributes,
    });
  },

  getAll() {
    return ApiService.get(`${serviceURL}/batch`, {}, {});
  },

  findQuery(query) {
    return ApiService.post(`${serviceURL}/query`, { query });
  },

  getListTestBankByFilter({ page, limit, level, typeTestBank, date }) {
    return ApiService.get(
      `${serviceURL}/review`,
      {},
      {
        page,
        limit,
        level,
        typeTestBank,
        date,
      }
    );
  },

  deleteTestBank({ page, limit, level, typeTestBank, date, TestBankId }) {
    return ApiService.delete(
      `${serviceURL}/delete`,
      {},
      {
        page,
        limit,
        level,
        typeTestBank,
        date,
        TestBankId,
      }
    );
  },

  patchTestBank({
    TestBankId,
    TestBank,
    defind,
    typeTestBank,
    attributes,
    topicId,
  }) {
    return ApiService.patch(`${serviceURL}/update-id`, {
      TestBankId,
      TestBank,
      defind,
      typeTestBank,
      attributes,
      topicId,
    });
  },

  getListPendding() {
    return ApiService.get(`${serviceURL}/listPending`, {}, {});
  },

  updateLevelTestBank({ TestBankId, repeat, dayReview }) {
    return ApiService.patch(`${serviceURL}/update-level`, {
      TestBankId,
      repeat,
      dayReview,
    });
  },
};

export default TestBankService;
