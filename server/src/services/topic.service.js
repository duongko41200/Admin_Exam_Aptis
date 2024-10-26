'use strict';

//define FACTORY parten
const { text, word, sentence } = require('../models/textform.model');
const { BadRequestError } = require('../cores/Error.response');
const {
	findAllInfoText,
} = require('../models/respositories/text.repo');

class TopicFactory {
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

	static async findAllInfoText({ userId, limit = 10, skip = 0 }) {
		const query = { userId };
		return await findAllInfoText({ query, limit, skip });
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
		this.dayReview = dayReview ? dayReview : new Date();
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

		console.log({newSentence})
		if (!newSentence) throw new BadRequestError('creat new Word error');
		super.attributes = newSentence;
		const newTextForm = await super.createTextForm(newSentence._id);
		if (!newTextForm) throw new BadRequestError('creat textFrom error');

		return newTextForm;
	}
}
module.exports = TopicFactory;
