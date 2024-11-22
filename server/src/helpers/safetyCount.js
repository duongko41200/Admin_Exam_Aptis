// count records are not deleted
export const safetyCount = async ({ model, query }) => {
	return await model.countDocuments({ userId: query.userId });
};
