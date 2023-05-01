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

  get(url: string) {
    let httpHeaders = new HttpHeaders()
      .set("Authorization", "Bearer " + this._authService.getToken());

    return this._http.get(url, { headers: httpHeaders });
  }

  getUnsecuredAPI(url: string) {
    return this._http.get(url);
  }

  post(url: string, data: object) {

    let httpHeaders = new HttpHeaders()
      .set("Authorization", "Bearer " + this._authService.getToken());

    if (!data['userId'])
      data['userId'] = this._authService.getUser()['id'];

    return this._http.post(url, data, { headers: httpHeaders });
  }

  postUnsecuredAPI_w_body(url: string, data: object) {
    let httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    console.log("URL " + url);
    return this._http.post(url, data, { headers: httpHeaders, observe: "response"});
  }

  putUnsecuredAPI_w_body(url: string, data: object) {
    let httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    console.log("URL " + url);
    return this._http.put(url, data, { headers: httpHeaders, observe: "response"});
  }

  put(url: string, data: object) {

    let httpHeaders = new HttpHeaders()
      .set("Authorization", "Bearer " + this._authService.getToken());

    if (!data['userId'])
      data['userId'] = this._authService.getUser()['id'];

    return this._http.put(url, data, { headers: httpHeaders });
  }

  delete(url: string, data: object) {
    let httpHeaders = new HttpHeaders()
      .set("Authorization", "Bearer " + this._authService.getToken());

    if (!data['userId'])
      data['userId'] = this._authService.getUser()['id'];

    return this._http.delete(url, { headers: httpHeaders, body: data });
  }
}
