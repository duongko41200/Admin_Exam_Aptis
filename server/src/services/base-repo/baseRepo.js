const getAllWithQuery = async ({ filter, range, sort }, model) => {
	const [sortField, sortOrder] = sort;
	const [start, end] = range;

	console.log({ sort });

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
		.find()
		.sort({ _id: sortOrder === 'ASC' ? 1 : -1 })
		.skip(start || 0)
		.limit((end || 0) - (start || 0) + 1)
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
		.find({ 'data.questions.questionPart': partSkill })
		.sort({ _id: 1 })
		// .skip(start || 0)
		// .limit((end || 0) - (start || 0) + 1)
		.exec();

	return res;
}



// const getAllWithQuery = async ({ sort, range, filter }) => {
//     const [sortField, sortOrder] = sort;
//     const [start, end] = range;
//     console.log(':::filter getAllWithQuery', filter);

//     const whereClause = Object.fromEntries(
//       Object.entries(filter).map(([key, value]) => [
//         key,
//         {
//           $regex: new RegExp(
//             value
//               .trim()
//               .split(' ')
//               .map((word) => `${word} ${word}*`.toLowerCase())
//               .join(' '),
            
//           ),
//         },
//       ])
// 	);
// 	console.log(':::whereClause getAllWithQuery', whereClause);

//     const res = await model
//       .find(whereClause)
//       .sort({ [sortField]: sortOrder === 'ASC' ? 1 : -1 })
//       .skip(start || 0)
//       .limit((end || 0) - (start || 0) + 1)
//       .exec();

//     return res;
// };



module.exports = {
	getAllWithQuery,
	getAllWithFilters
};
