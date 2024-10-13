import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FunctionService {
    /*
        This service is used to execute functions and store the results. It is used to prevent
        the same function from being executed too frequently. It is also used to prevent the
        same function from being executed with the same data too frequently. This is useful
        for functions that are called frequently, but return the same result for the same data.

        All function calls are cached. There is a delay between function calls. If the function
        is called before the delay has expired, the cached result is returned. If the delay expires,
        it checks to see if the data has changed by calling the function again. If the data has
        not changed, the cached result is returned, and the delay is increased. If the data has
        changed, the result is cached, and the delay is reset.

        In your model init(), do something like:

          self.funcKey = 'announcement-get-by-id';
          self._functionService.saveFunction(self.funcKey, (data) => {
            return new Promise((resolve, reject) => {
                self._announcementApiService.getById(data['id']).then((response: Announcement) => {
                    self.model[data['id']] = response;

                    resolve({response: response});   //    <-- IMPORTANT! You must return an object with a property called 'response'
                });
            });
          });

        Then, in your model get(), do something like:

            return this._functionService.getLastResult(self.funcKey, {id: id, moreparams: { .. }}).response;
     */

    private functions: Map<string, (data) => Promise<any>> = new Map();
    private executionStates: Map<string, {
        lastResult?: any,
        lastExecutionTime: number,
        delay: number,
        previousDelay: number
    }> = new Map();
    private pendingPromises: Map<string, Promise<any>> = new Map(); // New map to store promises

    private defaultDelayInSeconds = 10;

    constructor() {

    }

    private generateStateKey(funcIdentifier: string, data: any): string {
        return `${funcIdentifier}-${JSON.stringify(data)}`;
    }

    saveFunction(funcIdentifier: string, theFunction: (data) => Promise<any>): void {
        this.functions.set(funcIdentifier, theFunction);
    }

    async executeFunction(funcIdentifier: string, theFunction: (data) => Promise<any>, data?: any): Promise<any> {

        if (typeof theFunction !== 'function') {
            throw new Error('functionService, theFunction is not a function');
        }

        const isStale = this.isDataStale(funcIdentifier, data);
        const stateKey = this.generateStateKey(funcIdentifier, data);

        if (isStale) {
            this.pendingPromises.delete(stateKey); // Remove stale promise
        }

        this.functions.set(funcIdentifier, theFunction);

        let state = null;

        if (this.weHaveState(funcIdentifier, data)) {
            state = this.getExecutionState(funcIdentifier, data);

            const currentTime = Date.now();

            if (isStale) {
                state.lastExecutionTime = currentTime;

                const result = await theFunction(data);

                if (this.areResultsEqual(state.lastResult, result, data)) {
                    state.previousDelay = state.delay;
                    state.delay = Math.min(state.delay + state.previousDelay, 60 * 60 * 5); // Increase delay if result is the same
                } else {
                    state.delay = data ? data['delay'] ? data['delay'] : this.defaultDelayInSeconds : this.defaultDelayInSeconds; // Reset delay if result is different
                    state.lastResult = result;
                }
            }
        } else {
            state = this.createExecutionState(funcIdentifier, data);
            let response = await theFunction(data)
            state.lastResult = response;
        }

        // assert that lastResult has a property called response
        if (state.lastResult && !state.lastResult.hasOwnProperty('response')) {
            throw new Error('functionService, lastResult does not have a property called response');
        }

        return state.lastResult;
    }

    getLastResult(funcIdentifier: string, data?: any): {response: any} {
        const key = this.generateStateKey(funcIdentifier, data);
        const lastFunction = this.functions.get(funcIdentifier);

        if (lastFunction == null || lastFunction == undefined) {
            throw new Error('functionService, no function found for ' + funcIdentifier);
        }

        let state = this.executionStates.has(key) ?
            this.getExecutionState(funcIdentifier, data) :
            this.createExecutionState(funcIdentifier, data);

        this.setDelayPropertiesOnStateObject(data, state);
        this.executeFunction(funcIdentifier, lastFunction, data);

        // assert that lastResult has a property called response
        if (state.lastResult && !state.lastResult.hasOwnProperty('response')) {
            throw new Error('functionService, lastResult does not have a property called response');
        }

        return state.lastResult || {response: undefined};
    }

    private setDelayPropertiesOnStateObject(data: any, state) {
        if (data && data['delay']) {
            state.delay = data['delay'];
            state.previousDelay = data['delay'];
        }
    }

    waitUntilAvailable<T>(
        funcIdentifier: string,
        data?: any,
        initialDelayBetweenCallsWhileWaiting: number = 100,
        maxDelayBetweenCallsWhileWaiting: number = 5000
    ): Promise<T> {
        const key = this.generateStateKey(funcIdentifier, data);
        if (this.pendingPromises.has(key) && !this.isDataStale(funcIdentifier, data)) {
            return this.pendingPromises.get(key); // Return existing promise if it exists
        }

        // these delays refer to the amount of time in between calls to getLastResult() in milliseconds
        let prevDelay = 100;
        let currentDelay = initialDelayBetweenCallsWhileWaiting;

        const attempt = (): Promise<T> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const result = this.getLastResult(funcIdentifier, data)
                        if (result && result['response'] !== undefined) {
                            this.pendingPromises.delete(key); // Clear promise after resolution
                            resolve(result['response']);
                        } else {
                            const nextDelay = Math.min(prevDelay + currentDelay, maxDelayBetweenCallsWhileWaiting);
                            prevDelay = currentDelay;
                            currentDelay = nextDelay;
                            resolve(attempt());
                        }
                    } catch (error) {
                        this.pendingPromises.delete(key); // Clear promise after rejection
                        reject(error);
                    }
                }, currentDelay);
            });
        };

        const promise = attempt();
        this.pendingPromises.set(key, promise); // Store the new promise
        return promise;
    }

    resetDelay(funcIdentifier: string, delay?: number): void {
        const state = this.executionStates.get(funcIdentifier);
        if (state) {
            state.delay = delay ? delay : this.defaultDelayInSeconds;
        }
    }

    reset(funcIdentifier: string): void {

        // remove each element with a key that starts with the key variable above
        this.executionStates.forEach((value, key) => {
            if (key.startsWith(funcIdentifier)) {
                this.executionStates.delete(key);
            }
        });

        this.pendingPromises.forEach((value, key) => {
            if (key.startsWith(funcIdentifier)) {
                this.pendingPromises.delete(key);
            }
        });
    }

    private areResultsEqual(result1: any, result2: any, data: any): boolean {
        if (result1 === result2) {
            return true;
        }

        if (result1 === undefined && result2 !== undefined) {
            return false;
        }

        if (result1 !== undefined && result2 === undefined) {
            return false;
        }

        const differences = this.findDifferences(result1, result2);
        if (Object.keys(differences).length > 0) {
            return false;
        }

        return true;
    }

    private findDifferences(obj1: any, obj2: any, path: string = ''): any {
        if (obj1 === obj2) {
            return {};
        }

        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
            return { [path]: { obj1, obj2 } };
        }

        const differences = {};
        for (const key in obj1) {
            if (obj2 == null || !(key in obj2)) {
                differences[path + '.' + key] = { obj1: obj1[key], obj2: undefined };
            } else {
                const subPath = path ? `${path}.${key}` : key;
                const subDiffs = this.findDifferences(obj1[key], obj2[key], subPath);
                Object.assign(differences, subDiffs);
            }
        }

        for (const key in obj2) {
            if (obj1 == null || !(key in obj1)) {
                differences[path + '.' + key] = { obj1: undefined, obj2: obj2[key] };
            }
        }

        return differences;
    }

    private weHaveState(funcIdentifier: string, data?: any): boolean {
        const key = this.generateStateKey(funcIdentifier, data);
        return this.executionStates.has(key);
    }

    private createExecutionState(funcIdentifier: string, data?: any): any {
        const key = this.generateStateKey(funcIdentifier, data);
        const obj = {
            lastExecutionTime: 0,
            delay: this.defaultDelayInSeconds,
            previousDelay: this.defaultDelayInSeconds
        };
        this.executionStates.set(key, obj);

        this.setDelayPropertiesOnStateObject(data, obj);

        return obj;
    }

    private getExecutionState(funcIdentifier: string, data?: any): any {
        const key = this.generateStateKey(funcIdentifier, data);
        return this.executionStates.get(key);
    }

    private isDataStale(funcIdentifier: string, data?: any): boolean {
        const state = this.getExecutionState(funcIdentifier, data);

        if (!state) {
            return undefined;
        }

        const now = Date.now();
        const rtn = state && (now - state.lastExecutionTime > (state.delay * 1000));

        return rtn;
    }
}
