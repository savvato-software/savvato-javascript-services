import { Injectable } from '@angular/core';
import { JWTApiService } from '../_services/api/api.service'

@Injectable({
	providedIn: 'root'
})
export class CareerGoalService {

	environment = undefined;

	constructor(private _apiService: JWTApiService) {

	}

	_init(env) {
		this.environment = env;
	}

	getCareerGoalById(id) {
		if (isNaN(id))
			console.trace("An invalid ID was passed to getCareerGoalById()")

		let url = this.environment.apiUrl + "/api/careergoal/" + id;

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => {
						console.log("Call to getCareerGoalById(" + id + ") returned")
						console.log(data)
						resolve(data);
					}, (err) => {
						reject(err);
					});
			}
			);

		return rtn;
	}

	getAllCareerGoals() {
		let url = this.environment.apiUrl + "/api/careergoal/all"

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => {
						console.log("Call to getAllCareerGoals() returned")
						console.log(data)
						resolve(data);
					}, (err) => {
						reject(err);
					});
			}
			);

		return rtn;
	}

	save(careerGoal, pathAssociations) {
		let url = this.environment.apiUrl + '/api/careergoal/save'

		return new Promise(
			(resolve, reject) => {
				this._apiService.postUnsecuredAPI(url, {careergoal: careerGoal, pathassociations: pathAssociations}).subscribe(
					(data) => {
						resolve(data)
					}, (err) => {
						reject(err)
					});
			});
	}


	getCareerGoalForUserId(userId) {
		let url = this.environment.apiUrl + "/api/user/" + userId + "/careergoal/";

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => { 
						console.log("Career Goal for user " + userId + " received!");
						console.log(data);

						resolve(data);
					}, (err) => {
						reject(err);
					});
			});

		return rtn;
	}

	getNextQuestionsForCareerGoal(userId, careerGoalId) {
		let url = this.environment.apiUrl + "/api/user/" + userId + "/careergoal/" + careerGoalId + "/questions";

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => { 
						console.log("Next Questions Toward Career Goal for user " + userId + " received!");
						console.log(data);

						resolve(data);
					}, (err) => {
						reject(err);
					});
			});	

		return rtn;
	}

	getQuestionsAlreadyAskedInThisSession(userId, sessionId) {
		let url = this.environment.apiUrl + "/api/user/" + userId + "/mockinterviewsession/" + sessionId + "/questions";

		let rtn = new Promise(
			(resolve, reject) => {
				this._apiService.getUnsecuredAPI(url).subscribe(
					(data) => { 
						console.log("Questions Already Asked In This session for user " + userId + " received!");
						console.log(data);

						resolve(data);
					}, (err) => {
						reject(err);
					});
			});

		return rtn;
	}
}
