'use strict';

//define FACTORY parten
const { text, word, sentence } = require('../models/textform.model');
const { BadRequestError } = require('../cores/Error.response');
const {
	findAllInfoText,
	findListTextByFilter,
	deleteText,
	updateTextById,
	pendingReview,
	updateLevelText,
	getAllWithQuery,
	synchData,
	getAll,
} = require('../models/respositories/text.repo');
const dayjs = require('dayjs');

class TextFormFactory {
	/**
	 * type:"Word",
	 * payload
	 */
	static async createTextForm(type, payload) {
		switch (type) {
			case 'word':
				return new Word(payload).createTextForm();
			case 'sentence':
				return new Sentence(payload).createTextForm();

			default:
				throw new BadRequestError(`Invalid textForm Types ${type}`);
		}
	}

	//query

	static async findAllInfoText({ userId, limit, page }) {
		const query = { userId };

		console.log('limit:', limit, page);
		return await findAllInfoText({ query, limit, page, model: text });
	}

	static async getAllWithQuery({ filter, range, sort, userId }) {
		console.log({ filter, range, sort, userId });
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

		try {
			const res = await text
				.find({ userId: userId })
				.sort({ _id: sortOrder === 'ASC' ? 1 : -1 })
				// .skip(start || 0)
				// .limit((end || 0) - (start || 0) + 1)
				.exec();
			return res;
		} catch (error) {
			console.log('error:', error);
		}
	}

	static async findListTextByFilter({
		userId,
		limit,
		page,
		level,
		date,
		typeText,
	}) {
		return await findListTextByFilter({
			userId,
			limit,
			page,
			level,
			date,
			typeText,
			model: text,
		});
	}

	static async deleteText({
		userId,
		textId,
		limit,
		page,
		level,
		date,
		typeText,
	}) {
		return await deleteText({
			userId,
			textId,
			limit,
			page,
			level,
			date,
			typeText,
			model: text,
		});
	}

	static async updateLevelText(request) {
		return await updateLevelText({
			...request,
			model: text,
		});
	}
	static async synchDataText(request) {
		return await synchData({
			...request,
			model: text,
		});
	}

	static async getAll(request) {
		return await getAll({
			...request,
			model: text,
		});
	}

	static async updateTextbyId({
		userId,
		textId,
		typeText,
		textName,
		defind,
		attributes,
		topicId,
	}) {
		return await updateTextById({
			userId,
			textId,
			typeText,
			textName,
			defind,
			attributes,
			topicId,
			model: text,
		});
	}
	static async pendingReview({ userId }) {
		return await pendingReview({
			userId,
			model: text,
		});
	}
}

class TextForm {
	constructor({
		text,
		defind,
		userId,
		topicId,
		typeText,
		repeat,
		isRemind,
		dayReview,
		attributes,
	}) {
		this.text = text;
		this.defind = defind;
		this.userId = userId;
		this.topicId = topicId;
		this.typeText = typeText;
		this.repeat = repeat ? repeat : 1;
		this.isRemind = isRemind ? isRemind : true;
		this.dayReview = dayReview
			? dayReview
			: dayjs(new Date()).add(1, 'day').format('YYYY/MM/DD');
		this.attributes = attributes;
	}
	async createTextForm(text_id) {
		return await text.create({ ...this, _id: text_id });
	}
}

//define sub-class fro diff types word
class Word extends TextForm {
	async createTextForm() {
		const newWord = await word.create({
			...this.attributes,
			userId: this.userId,
		});
		if (!newWord) throw new BadRequestError('creat new Word error');
		super.attributes = newWord;
		const newTextForm = await super.createTextForm(newWord._id);
		if (!newTextForm) throw new BadRequestError('creat textFrom error');

		return newTextForm;
	}
}

//define sub-class fro diff types sentence
class Sentence extends TextForm {
	async createTextForm() {
		const newSentence = await sentence.create({
			...this.attributes,
			userId: this.userId,
		});

		console.log({ newSentence });
		if (!newSentence) throw new BadRequestError('creat new Word error');
		super.attributes = newSentence;
		const newTextForm = await super.createTextForm(newSentence._id);
		if (!newTextForm) throw new BadRequestError('creat textFrom error');

		return newTextForm;
	}
}
module.exports = TextFormFactory;
