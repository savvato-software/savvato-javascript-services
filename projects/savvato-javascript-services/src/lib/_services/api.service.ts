import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
// import { Platform } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	
	currentUser = {name: 'admin', password: 'admin'};

	constructor(private _http: HttpClient, 
		/*private _platform: Platform*/) {

	}

	getHeaders(username, password) {
		let httpHeaders = new HttpHeaders()
		.set("Authorization", "Basic " + btoa(username + ":" + password))
		.set("Content-Type", "application/x-www-form-urlencoded");

		return { headers: httpHeaders };
	}

	getAuthHeadersForCurrentUser() {
		let httpHeaders = new HttpHeaders()
		.set("Authorization", "Basic " + btoa(this.currentUser["name"] + ":" + this.currentUser["password"]));

		return httpHeaders;
	}

	get(url: string) {
		let user = this.currentUser;

		let username: string = user["name"];
		let password: string = user["password"];

		return this.getWithUsernameAndPassword(url, username, password);
	}

	getWithUsernameAndPassword(url: string, uName: string, uPW: string) {
		let httpHeaders = this.getHeaders(uName, uPW);
		
		// commented out because I'm trying to put this service here without needing to import Ionic
		// and only Easyah needs iOS support at this time, the rest are using android.. so since Easyah
		//  does not yet use this version of api service, we should be okay. But it should be refactored
		// probably. -- jej

		// if (this._platform.is('ios'))
		// 	return this._http.get(url, httpHeaders) // TODO.. figure out how to do this on ios.. was '.timeout(5000);'
		// else
			return this._http.get(url, httpHeaders);
	}

	getUnsecuredAPI(url: string) {
		//let httpHeaders: HttpHeaders = new HttpHeaders();
		return this._http.get(url);
	}

	post(url: string, data: string) {
		let user = this.currentUser;

		let username: string = user["name"];
		let password: string = user["password"];

		let httpHeaders = this.getHeaders(username, password);
		return this._http.post(url, data, httpHeaders);
	}

	postUnsecuredAPI(url: string, data: any) {
		let httpHeaders: HttpHeaders = new HttpHeaders({}); 
		httpHeaders.set("Content-Type", "application/x-www-form-urlencoded");

		return this._http.post(url, data, { headers: httpHeaders});
	}
	
	delete(url: string) {
		let user = this.currentUser;

		let username: string = user["name"];
		let password: string = user["password"];

		let httpHeaders = this.getHeaders(username, password);

		return this._http.delete(url, httpHeaders);
	}
}