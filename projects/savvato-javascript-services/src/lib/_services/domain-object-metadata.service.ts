import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Observable';

@Injectable({
	providedIn: 'root'
})

/*
	Provides metadata about a domain object, as it relates to another domain object. For instance, a user
	and a set of orders, or a skills matrix and the highest number of questions attached to any cell.

	Metadata is provided by a function, which is associated with a unique key. When a call is made for that
	bit of metadata in association with a given domain object, the function is called, and its return value
	is returned to the caller.

	To implement, a service should extend this class. The extending class should initialize this class with
	the functions that provide the metadata it uses. To do this, in the init() method, call addMetadataCalculationFunction(functionKey, func).

	Then, to get a metadata value, call getMetadataValue(domainObject, functionKey).
*/

export class DomainObjectMetadataService {
	
	_domainObjectProvider = undefined;

	constructor() {

	}

	cachedValueValidityDuration = 15000;

	mapPrimaryDomainObjectIdToCachedCalculationResultObjects = {}
	mapPrimaryDomainObjectIdToInProgressCalculationObjects = {};
	mapPropertyKeyToCalcFunction: Array<Object> = [];

	init(domainObjectProv) {
		if (!domainObjectProv) {
			throw new Error("Invalid domain object provider passed to domain-object-metadata.service.");
		}

		this._domainObjectProvider = domainObjectProv;
		
		this.mapPrimaryDomainObjectIdToCachedCalculationResultObjects = {};
		this.mapPrimaryDomainObjectIdToInProgressCalculationObjects = {};
	}

	addMetadataCalculationFunction(functionKey, _func) {
		this.mapPropertyKeyToCalcFunction.push({property: functionKey, func: _func}); 
	}

	getMetadataValue(_domainObject, functionKey) {
		let self = this;
		if (this.mapPropertyKeyToCalcFunction.length === 0) {
			return undefined; // TODO: handle this error better
		}

		if (!this.mapPropertyKeyToCalcFunction.some((obj) => { return obj["property"] === functionKey; })) {
			return undefined;
		}

		let domObj = self._domainObjectProvider.get();
		if (self.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[domObj["id"]] === undefined) {
			self.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[domObj["id"]] = [];
		}

		// get the calculated value we saved the last time we came through here
		let obj = self.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[domObj["id"]].find((obj) => { 
			return self.isObjectTheResultOfTheGivenDomainObjectAndFunctionKey(obj, _domainObject, functionKey);
		});

		// check if this calculated value from the last time has expired.. if so, refresh it.
		let time = new Date().getTime();
		if (obj != undefined && obj["expirationTime"] < time) {
			let coll = self.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[domObj["id"]].filter((obj) => {
				return !self.isObjectTheResultOfTheGivenDomainObjectAndFunctionKey(obj, _domainObject, functionKey);
			})

			self.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[domObj["id"]] = coll;
			obj = undefined;
		}

		// if there is no calculated value from the last time
		if (obj === undefined) {

			let rtn = new Promise((resolve, reject) => {

				// then do the calculation
				let mvr : any = this.getMetadataValueResult(_domainObject, functionKey);

				// the result of the calculation will be either a Javascript Promise...
				if ( mvr !== undefined && typeof mvr.then == 'function' )
					 mvr.then((data) => {
					 	self.setValueForCachedCalculationResultObject(domObj, data, _domainObject, functionKey);
					 	resolve(data);
					});
				else { // the result of the calculation is an actual value, or object.
					self.setValueForCachedCalculationResultObject(domObj, mvr, _domainObject, functionKey);
					resolve(mvr);
				}
			});

			return rtn;
		}

		// return the calculated value from last time
		return new Promise((resolve, reject) => { resolve(obj["value"]); });
	}

	getMetadataValueResult(_domainObject, functionKey): Object {
		let self = this;
		if (_domainObject === undefined) {
			console.log("ERROR: _domainObject cannot be undefined.");
			return undefined; // TODO Handle this error better
		}

		let domObj = self._domainObjectProvider.get();
		if (self.mapPrimaryDomainObjectIdToInProgressCalculationObjects[domObj["id"]] === undefined) 
			self.mapPrimaryDomainObjectIdToInProgressCalculationObjects[domObj["id"]] = [];

		let obj = self.mapPrimaryDomainObjectIdToInProgressCalculationObjects[domObj["id"]].find((result) => {
			return self.isObjectTheResultOfTheGivenDomainObjectAndFunctionKey(result, _domainObject, functionKey);
		});

		// check if this calculated value from the last time has expired.. if so, refresh it.
		let time = new Date().getTime();
		if (obj != undefined && obj["expirationTime"] < time) {
			let coll = self.mapPrimaryDomainObjectIdToInProgressCalculationObjects[domObj["id"]].filter((obj) => {
				return !self.isObjectTheResultOfTheGivenDomainObjectAndFunctionKey(obj, _domainObject, functionKey);
			})

			self.mapPrimaryDomainObjectIdToInProgressCalculationObjects[domObj["id"]] = coll;
			obj = undefined;
		}

		if (obj === undefined) {
			let calcFunctionObject = self.getCalcFunctionObject(functionKey);
			let calcFunc: (Any) => Observable<any> = calcFunctionObject["func"];

			obj = self.createDomainObjectMetadataCalculationObject(calcFunc(_domainObject), _domainObject, functionKey );
			self.mapPrimaryDomainObjectIdToInProgressCalculationObjects[domObj["id"]].push(obj);
		}

		return obj["value"];
	}

	getCalcFunctionObject(functionKey) {
		return this.mapPropertyKeyToCalcFunction.find((propKeyToFunctionObj) => {
				return (functionKey === propKeyToFunctionObj["property"]);
			});
	}

	setCachedValueValidityDuration(millis) {
		this.cachedValueValidityDuration = millis;
	}

	createDomainObjectMetadataCalculationObject(val, _domainObject, functionKey) {
		return {domainObject: _domainObject, property: functionKey, value: val, expirationTime: new Date().getTime() + this.cachedValueValidityDuration};
	}

	isObjectTheResultOfTheGivenDomainObjectAndFunctionKey(calculationResultObject, domainObject, functionKey) {
		return 	calculationResultObject["domainObject"]["id"] === domainObject["id"] &&
				calculationResultObject["property"] === functionKey; 	
	}

	setValueForCachedCalculationResultObject(domObj, data, _domainObject, functionKey) {
		let self = this;
		
		let currentlyCachedCalculationResultObject = 
			self.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[domObj["id"]].find((o) => { 
				return self.isObjectTheResultOfTheGivenDomainObjectAndFunctionKey(o, _domainObject, functionKey);
			})

		if (currentlyCachedCalculationResultObject !== undefined) {
			currentlyCachedCalculationResultObject["value"] = data;
		}
		else {
			let obj = self.createDomainObjectMetadataCalculationObject(data, _domainObject, functionKey);
			self.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[domObj["id"]].push(obj);
		}
	}

	markDirty(params) {
		let primaryDomainObject = params["primaryDomainObject"] || this._domainObjectProvider.get()
		let mappedDomainObject = params["domainObject"];
		
		if (mappedDomainObject !== undefined && this.mapPrimaryDomainObjectIdToInProgressCalculationObjects[primaryDomainObject["id"]] !== undefined ) {
			let filteredMap = this.mapPrimaryDomainObjectIdToInProgressCalculationObjects[primaryDomainObject["id"]].filter((result) => { return result["domainObject"]["id"] !== mappedDomainObject["id"]; });
			this.mapPrimaryDomainObjectIdToInProgressCalculationObjects[primaryDomainObject["id"]] = filteredMap;

			filteredMap = this.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[primaryDomainObject["id"]].filter((result) => { return result["domainObject"]["id"] !== mappedDomainObject["id"]; });
			this.mapPrimaryDomainObjectIdToCachedCalculationResultObjects[primaryDomainObject["id"]] = filteredMap;
		}
	}
}
