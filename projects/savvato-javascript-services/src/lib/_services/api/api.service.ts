import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { AuthService } from '../auth/auth.service'

@Injectable({
  providedIn: 'root'
})
export class JWTApiService {

  constructor(private _http: HttpClient, private _authService: AuthService) {

  }

  getHeaders(auth: boolean = true) {
    let rtn = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

    if (auth)
      rtn = rtn.set("Authorization", "Bearer " + this._authService.getToken());

    return rtn;
  }

  get(url: string) {
    return this._http.get(url, { headers: this.getHeaders()});
  }

  getUnsecuredAPI(url: string) {
    return this.get(url)
  }

  post(url: string, data: object) {
    if (!data['userId'])
      data['userId'] = this._authService.getUser()['id'];

    return this._http.post(url, data, { headers: this.getHeaders() });
  }

  postUnsecuredAPI_w_body(url: string, data: object) {
    console.log("URL " + url);
    return this._http.post(url, data, { headers: this.getHeaders(false), observe: "response"});
  }

  putUnsecuredAPI_w_body(url: string, data: object) {
    console.log("URL " + url);
    return this._http.put(url, data, { headers: this.getHeaders(false), observe: "response"});
  }

  put(url: string, data: object) {
    if (!data['userId'])
      data['userId'] = this._authService.getUser()['id'];

    return this._http.put(url, data, { headers: this.getHeaders()});
  }

  delete(url: string, data: object) {
    if (!data['userId'])
      data['userId'] = this._authService.getUser()['id'];

    return this._http.delete(url, { headers: this.getHeaders(), body: data });
  }
}
