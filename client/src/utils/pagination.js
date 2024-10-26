import { LIMIT_LIST_TEXT_OF_PAGE } from '../Constant/global';

const functionPagination = async (page, textData) => {
	const startIndex = (parseInt(page) - 1) * LIMIT_LIST_TEXT_OF_PAGE;
	const endIndex = parseInt(page) * LIMIT_LIST_TEXT_OF_PAGE;

	const paginatePage = await textData.slice(startIndex, endIndex);
	return paginatePage;
};

export { functionPagination };
