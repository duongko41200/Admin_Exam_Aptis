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

module.exports = {
	getAllWithQuery,
};
