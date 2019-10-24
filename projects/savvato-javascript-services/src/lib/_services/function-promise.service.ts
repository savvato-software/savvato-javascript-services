import { Injectable } from '@angular/core';

// The point of this class is to cache the results of a function that does something.
//  Then using the cached result over and over, rather than making a new api call, 
//  a new calculation, etc.

// It takes an ID, the result ID, and maps it to a promise, which is the result
//  of a function.

// So for instance the result ID could be the user ID, and the function, a call
//  to download a file and return the local filename. You could call that function
//  over and over, and only call the API once.

// If results become stale (older than a user-defined length of time), they are 
//  discarded on the subsequent call for those results. A call to the function then
//  occurs, and its results are cached.

@Injectable({
  providedIn: 'root'
})
export class FunctionPromiseService { 
	
	results = {};
	funcs = {};

	freshnessLengthInMillis = 60 * 1000; // thirty seconds

	constructor() {

	}

	reset(resultKey) {
		console.log("resetting " + resultKey)
		this.results[resultKey] = undefined;
		this.promiseCache[resultKey] = undefined;
	}

	initFunc(funcKey, func) {
		this.funcs[funcKey] = func;
	}

	setFreshnessFactorInMillis(m) {
		this.freshnessLengthInMillis = m;
	}

	get(resultKey, funcKey, data) {
		var timestamp = new Date().getTime();
		let self = this;

		if (this.results[resultKey] !== undefined) {
			
			if (this.results[resultKey]["timestamp"] + this.freshnessLengthInMillis < timestamp) {
				this.reset(resultKey);
			} else {
				return this.results[resultKey]["results"];
			}
		}

		self.results[resultKey] = {timestamp: new Date().getTime(), results: undefined};

		let func = self.funcs[funcKey];

		if (func !== undefined) {
			func(data).then(
				(result) => { 
					self.results[resultKey] = {timestamp: new Date().getTime(), results: result}; 
				})
		}

		return self.results[resultKey]["results"];
	}

	promiseCache = { }
	waitAndGet(resultKey, funcKey, data) {
		let self = this;
		let prm = undefined;

		prm = self.promiseCache[resultKey];

		if (!prm) {
			prm = new Promise((resolve, reject) => {
				function to() {
					setTimeout(() => {
						let result = self.get(resultKey, funcKey, data);

						if (result)
							resolve(result);
						else
							to();
					}, 500);
				}

				to();
			})

			self.promiseCache[resultKey] = prm;
		}

		return prm;
	}
}
