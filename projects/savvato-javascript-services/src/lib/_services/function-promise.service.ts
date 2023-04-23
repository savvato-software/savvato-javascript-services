import { Injectable } from '@angular/core';

// The point of this class is to cache the results of a function that does something.
//  Then it uses the cached result over and over, rather than making a new api call, 
//  a new calculation, etc.

// It takes an ID (think: the result ID), and maps it to a promise, which is the result
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

	freshnessLengthInMillis = 30 * 1000; // thirty seconds

	constructor() {

	}

	reset(resultKey) {
		this.results[resultKey] = undefined;
		this.promiseCache[resultKey] = { timestamp: undefined, results: undefined };
	}

	resetFuzzily(resultKey) {
		let self = this;

		let keys = Object.keys(self.results).filter((k) => k.startsWith(resultKey)).forEach((k2) => { 
			self.reset(k2);
		})
	}

	resetFunc(funcKey) {
		this.funcs[funcKey] = undefined;
	}

	/**
		Your function must:

			return a promise
				and that promise must resolve something other than [undefined | null | 0]. If you are trying to respond with something falsey,
				you need to put your response in an object, liked this: {value: undefined}, and return the object. This is because the 
				FunctionPromiseService takes a false value to mean your function has not yet completed.	
	*/
	initFunc(funcKey, func) {

		// TODO: ensure this parameter is actually a function. throw error otherwise. test that behavior

		this.funcs[funcKey] = func;
	}

	setFreshnessFactorInMillis(m) {
		this.freshnessLengthInMillis = m;
	}

	getFreshnessLengthInMillis(data) {
		if (data && data["freshnessLengthInMillis"])
			return data["freshnessLengthInMillis"];
		else
			return this.freshnessLengthInMillis;
	}

	/**
		This method gets the ball rolling. When you call it, it checks to see
		if a call with this set of parameters has already happened. If so, it
		returns the result of that previous call. If this is the first time a 
		call has been made for that set of parameters, this method calls the 
		promise that represents that function, and then returns undefined. You
		can call this method again, and it will continue to return undefined
		until the promise that represents the function returns a value. Then, 
		this function will return that value, whenever called with that set of 
		parameters.

		It is designed to be called repeatedly, and to return quickly. If your paradigm
		doesn't repeatedly call for updated data, then this method is not for 
		you. In your case, your framework is making one call, and saving the
		result. So you should call waitAndGet() which will return a promise that
		resolves to the result of the function call.
	**/
	get(resultKey, funcKey, data) {
		var timestamp = new Date().getTime();
		let self = this;

		/**
			You can pass 'freshnessLengthInMillis' in the data object
			to set a specific limit for this call. So, if the default
			time is 30 seconds, you can pass in 3000, and this call
			will be considered stale (and this will recalculate) after
			three seconds. If you don't pass anything, the default
			value is used.
		*/

		let freshnessLength = self.getFreshnessLengthInMillis(data);

		if (self.results[resultKey] !== undefined) {
			
			if (self.results[resultKey]["timestamp"] + freshnessLength < timestamp) {
				if (self.results[resultKey]["staleResults"] === undefined) {
					self.results[resultKey]["staleResults"] = self.results[resultKey]["results"];
				 	// console.log("FPS: Saving some stale results for ", resultKey, funcKey, self.results[resultKey]["staleResults"])
				}
			} else {
				return self.results[resultKey]["results"];
			}
		}

    self.results[resultKey] = { timestamp: Date.now(), results: undefined };

		let func = self.funcs[funcKey];

		if (func !== undefined) {
			func(data).then(
				(result) => {
					// if (self.results[resultKey]["staleResults"] !== undefined)
						// console.log(resultKey, funcKey, " got new results. REPLACING STALE RESULTS with fresh ones!", result);

					self.results[resultKey] = {timestamp: Date.now(), results: result};
				})
		} else {
			throw new Error("The given function key [" + funcKey + "] does not have a function associated with it.")
		}

		if (self.results[resultKey]["staleResults"] !== undefined)
			return self.results[resultKey]["staleResults"]
		else
			return self.results[resultKey]["results"];
	}

	promiseCache = { }
	waitAndGet(resultKey, funcKey, data) {
		let self = this;

		let timestamp = new Date().getTime();
		let freshnessLength = self.getFreshnessLengthInMillis(data);

		if (self.promiseCache[resultKey] && self.promiseCache[resultKey]["timestamp"] !== undefined) {
			
			if (self.promiseCache[resultKey]["timestamp"] + freshnessLength < timestamp) {
				self.reset(resultKey);
			} else {
				return self.promiseCache[resultKey]["results"];
			}
		}

		self.promiseCache[resultKey] = {timestamp: new Date().getTime(), results: new Promise((resolve, reject) => {
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
		})};

		return self.promiseCache[resultKey]["results"];
	}
}
