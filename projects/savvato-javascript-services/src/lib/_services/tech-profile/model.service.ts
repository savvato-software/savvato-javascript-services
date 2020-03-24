import { Injectable } from '@angular/core';

import { TechProfileAPIService } from './api.service';
import { SequenceService } from '../sequence.service';

@Injectable({
  providedIn: 'root'
})
export class TechProfileModelService {

	techProfile = undefined;
	questionCountsPerCell = undefined;

	resetCalculatedStuffCallback = undefined;

	environment = undefined;

	constructor(protected _techProfileAPI: TechProfileAPIService,
				protected _sequenceService: SequenceService	) { }

	setEnvironment(env) {
		this.environment = env;

		this._techProfileAPI.setEnvironment(env);
	}

	// This service is initialized two different ways.. By _init(), which calls the API directly,
	//  and setProviderForTechProfile, which uses a passed-in function from a third party. 

	_init(force?: boolean) {
		let self = this;

		if (!self.environment)
			throw new Error("The environment object has not been set on the TechProfileModelService");


		if (force || self.techProfile === undefined) {
			self.techProfile = null;
			self.questionCountsPerCell = null;

			self._techProfileAPI.get(1).then((tp) => {
				self.techProfile = tp;

				if (self.resetCalculatedStuffCallback) 
					self.resetCalculatedStuffCallback();
			})
		}
	}


	setProviderForTechProfile(func) {
		this.techProfile = func();
	}

	waitingPromise() {
		let self = this;
		return new Promise((resolve, reject) => {

			function to() {
				setTimeout(() => {
					if (self.isTechProfileAvailable())
						resolve();
					else
						to();
				}, 600);
			}

			to();
		})
	}

	setResetCalculatedStuffCallback(func) {
		this.resetCalculatedStuffCallback = func;
	}

	getModel() {
		return this.techProfile;
	}

	getName() {
		let model = this.getModel();

		if (model) 
			return model['name']
		else
			return undefined;
	}

	getTopics() {
		return this.techProfile && this.techProfile["topics"].sort((a, b) => { return a["sequence"] - b["sequence"]; });
	}

	getTopicById(id) {
		return this.techProfile && this.techProfile["topics"].filter((t) => { return t['id'] === id; });
	}

	getLineItemsForATopic(topicId) {
		return this.getTechProfileLineItemsByTopic(topicId);
	}

	isTechProfileAvailable() {
		return this.techProfile && this.techProfile != null
	}

	// setTechProfile(techProfile) {
	// 	this.techProfile = techProfile;
	// }

	isTopicAbleToMoveUp(topicId) {
		let rtn = false;

		if (topicId) {
			let topic = this.techProfile && this.techProfile["topics"].find((t) => { return t['id'] === topicId });

			if (topic)
				rtn = this._sequenceService.isAbleToMove(this.techProfile["topics"], topic, -1);
		}
	
		return rtn;
	}

	isTopicAbleToMoveDown(topicId) {
		let rtn = false;

		if (topicId) {

			let topic = this.techProfile && this.techProfile["topics"].find((t) => { return t['id'] === topicId });

			if (topic)
				return this._sequenceService.isAbleToMove(this.techProfile["topics"], topic, 1);
		}

		return rtn;
	}

	moveSequenceForTechProfileTopic(topicId, direction) {
		let topic = this.techProfile && this.techProfile["topics"].find((t) => { return t['id'] === topicId });

		if (topic)
			return this._sequenceService.moveSequenceByOne(this.techProfile["topics"], topic, direction);
		else
			console.error("Topic with ID " + topicId + " not found. Nothing to move.");
	}

	isLineItemAbleToMoveUp(topicId, lineItemId) {
		let topic = this.techProfile && this.techProfile["topics"].find((t) => { return t['id'] === topicId });

		let lineItem = topic && topic["lineItems"] && topic["lineItems"].find((li) => { return li['id'] === lineItemId });

		if (lineItem)
			return this._sequenceService.isAbleToMove(topic["lineItems"], lineItem, -1);

		return false;
	}

	isLineItemAbleToMoveDown(topicId, lineItemId) {
		let topic = this.techProfile && this.techProfile["topics"].find((t) => { return t['id'] === topicId });

		let lineItem = topic && topic["lineItems"] && topic["lineItems"].find((li) => { return li['id'] === lineItemId });

		if (lineItem) 
			return this._sequenceService.isAbleToMove(topic["lineItems"], lineItem, 1)

		return false;
	}

	moveSequenceForTechProfileLineItem(topicId, lineItemId, direcionPlusOrMinus) {
		let topic = this.techProfile && this.techProfile["topics"].find((t) => { return t['id'] === topicId });
		let lineItem = topic && topic["lineItems"].find((li) => { return li['id'] === lineItemId });

		if (lineItem)
			return this._sequenceService.moveSequenceByOne(topic["lineItems"], lineItem, direcionPlusOrMinus);
		else
			console.error("LineItem with ID " + lineItemId + " not found. Nothing to move.");
	}

	saveSequenceInfo() {
		return new Promise((resolve, reject) => {
			let arr1 = [];

			this.techProfile['topics'].forEach((topic) => {
				let arr = [];

				if (topic['lineItems'].length > 0) {
					topic['lineItems'].forEach((lineItem) => {
						let row = []
						row.push(1) // techProfileId
						row.push(topic['id'])
						row.push(topic['sequence'])

						row.push(lineItem['id'])
						row.push(lineItem['sequence'])

						arr.push(row);
					})
				} else {
					// this topic does not have line items
					arr.push([1 /* tech profile id */, topic['id'], topic['sequence'], -1, -1])
				}

				arr1.push(arr);
			})

			this._techProfileAPI.saveSequenceInfo(arr1).then((data) => {
				resolve(data);
			}, (err) => {
				reject(err);
			})
		})
	}

	getTechProfileLineItemsByTopic(topicId) {
		let rtn = undefined;
		let topic = this.techProfile && this.techProfile["topics"].find((t) => { return t["id"] === topicId; });

		if (topic) {
			rtn = topic["lineItems"].sort((a, b) => { return a["sequence"] - b["sequence"]; });
		}

		return rtn;
	}

	getTechProfileLineItemById(lineItemId) {
		let rtn = undefined;

		for (var x=0; this.techProfile && !rtn && x < this.techProfile["topics"].length; x++) {
			rtn = this.techProfile["topics"][x]["lineItems"].find((li) => { return li["id"] === lineItemId; });
		}

		return rtn;
	}

	updateTechProfileTopic(topic) {
		let self = this;
		if (topic.id !== -1) {
			return self._techProfileAPI.updateTopic(topic).then(() => self._init(true));
		} else {
			console.error("A topic with no backend id was passed to updateTechProfileTopic.");
		}
	}

	updateTechProfileLineItem(lineItem) {
		let self = this;
		if (lineItem.id !== -1) {
			return self._techProfileAPI.updateLineItemWithDescriptions(lineItem).then(() => self._init(true));
		} else {
			console.error("A lineItem with no backend id was passed to updateTechProfileLineItem.");
		}
	}

	addTopic(name) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.addTopic(name).then(() => {
				self._init(true);

				resolve();
			})
		});
	}

	addLineItem(parentTopicId, lineItemName) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.addLineItem(parentTopicId, lineItemName).then(() => {
				self._init(true);

				resolve();
			})
		})
	}

	addExistingLineItem(parentTopicId, lineItemId) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.addExistingLineItem(parentTopicId, lineItemId).then(() => {
				self._init(true);

				resolve();
			})
		})
	}
	
	deleteExistingLineItem(parentTopicId, lineItemId) {
		let self = this;
		return new Promise((resolve, reject) => {
			self._techProfileAPI.deleteExistingLineItem(parentTopicId, lineItemId).then(() => {
				self._init(true);

				resolve();
			})
		})
	}
	
}
