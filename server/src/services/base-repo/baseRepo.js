const getAllWithQuery = async (
  { filter, range, sort, populate = null },
  model
) => {
  const [sortField, sortOrder] = sort;
  const [start, end] = range;

  const res = await model
    .find()
    .sort({ _id: sortOrder === "ASC" ? 1 : -1 })
    .skip(start || 0)
    .limit((end || 0) - (start || 0) + 1)
    .populate(populate)
    .exec();

  return res;
};

const getAll = async (model) => {
  const res = await model
    .find()
    .populate(
      `reading.part1 reading.part2 reading.part3 reading.part4 reading.part5 writing.part1 writing.part2 writing.part3 writing.part4 speaking.part1 speaking.part2 speaking.part3 speaking.part4 listening.part1 listening.part2 listening.part3 listening.part4`
    )
    .exec();

  return res;
};

const getAllWithFilters = async ({ partSkill }, model) => {
  // console.log()
  // const [sortField, sortOrder] = sort;
  // const [start, end] = range;

  // const whereClause = Object.fromEntries(
  //   Object.entries(filter).map(([key, value]) => [
  //     key,
  //     {
  //       search: (value)
  //         .trim()
  //         .split(' ')
  //         .map((word) => `${word} ${word}*`.toLowerCase())
  //         .join(' '),
  //     },
  //   ])
  // );

  const res = await model
    .find({ "data.questions.questionPart": partSkill })
    .sort({ _id: 1 })
    // .skip(start || 0)
    // .limit((end || 0) - (start || 0) + 1)
    .exec();

  return res;
};

const getAllWithFiltersWritting = async ({ partSkill }, model) => {
  // console.log()
  // const [sortField, sortOrder] = sort;
  // const [start, end] = range;

  // const whereClause = Object.fromEntries(
  //   Object.entries(filter).map(([key, value]) => [
  //     key,
  //     {
  //       search: (value)
  //         .trim()
  //         .split(' ')
  //         .map((word) => `${word} ${word}*`.toLowerCase())
  //         .join(' '),
  //     },
  //   ])
  // );

  const res = await model
    .find({ questionPart: partSkill })
    .sort({ _id: 1 })
    // .skip(start || 0)
    // .limit((end || 0) - (start || 0) + 1)
    .exec();

  return res;
};

const getOneById = async ({ id }, model) => {
  const res = await model.findById({ _id: id }).exec();

  return res;
};

const getOneByIdExtend = async ({ id, populate }, model) => {
  const res = await model.findById({ _id: id }).populate(populate).exec();

  return res;
};

const findOneAndUpdate = async ({ id, data, populate = null }, model) => {
  const options = { new: true };
  const res = await model
    .findOneAndUpdate({ _id: id }, { ...data }, options)
    .populate([populate])
    .exec();
  return res;
};

const findQuery = async ({ populate= null, query }, model) => {
  const res = await model
    .find({ ...query })
    .populate(populate)
    .exec();

  return res;
};

export default {
  getAllWithQuery,
  getAllWithFilters,
  getAll,
  getOneById,
  getAllWithFiltersWritting,
  getOneByIdExtend,
  findOneAndUpdate,
  findQuery,
};
