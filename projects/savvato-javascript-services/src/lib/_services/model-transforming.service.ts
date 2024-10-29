import { Injectable } from '@angular/core';

@Injectable()
export class ModelTransformingService {

	/**
		This class asynchronously fires off tasks, who's purpose is to
		update (transform) a model.

		The tasks are independent, they should not depend on any attribute
		outside of their perview being present in the model.

		// ** BEGIN EXAMPLE TRANSFORMER **
			this._modelTransformingService.addTransformer((model, done) => {
				let currentUser = this._userService.getCurrentUser();

				if (model['userId'] === currentUser['id']) {

					// call an api. set the results in the model

					this._pointsService.getCurrentUserPointsAsSum().then((pts) => {
						model["points"]["total"] = pts;

						// call done() to finish the transformation func

						done("pointsService pointsAssum");
					});
				} else {

					// call done() to finish the transformation func
					done("pointsService pointsAssum");
				}
			});
		// ** END EXAMPLE TRANSFORMER **


		then call transform(), passing in your model, to fire all the
		transformers off.
	*/

	transformers = [];
	transformPromise = undefined;
	activeCount = 0;

	constructor() {

	}

	reset() {
		this.transformPromise = undefined;
		this.activeCount = 0;
	}

	addTransformer(func: (model: any, fin: Function) => void) {
		this.transformers.push(func);
	}

	clearAllTransformers() {
		this.transformers = [];
    this.transformPromise = undefined;
		// reset(); ?
	}

	transform(model) {

		let self = this;
		if (!self.transformPromise) {

			self.transformPromise = new Promise((resolve, reject) => {
				if (self.transformers.length === 0)
					resolve(model);

				self.transformers.forEach((f) => {
					self.activeCount++
					setTimeout(() => {
						f(model, (transformerName) => { --self.activeCount; if (self.activeCount === 0) { resolve(model); }	});

					}, 275);
				})
			})

		}

		return self.transformPromise;
	}
}
