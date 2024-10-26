// count records are not deleted
const safetyCount = async ({ model, query }) => {
	
	return await model.countDocuments({ userId:query.userId });
};

module.exports = safetyCount;
