import { Injectable } from '@angular/core';

import { User } from '../../_models/user'

import { JWTApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _apiService: JWTApiService, private _authService: AuthService) {

  }

  login(environment: any, email: string, password: string) {
    let self = this;
    let data = {email: email, password: password}

    return new Promise((resolve, reject) => {
      this._apiService.postUnsecuredAPI_w_body(environment['apiUrl'] + "/api/public/login", data)
          .subscribe({next: (response) => {
            let o : any = response.body;

            self._authService.setUser(new User(o['id'], o['name'], o['password'], o['phone'], o['email'], o['roles'], o['lastLoginTimeInMillis']))
            self._authService.setToken(response.headers.get('Authorization') || '')

            resolve(response);
          }, error: (error) => {
            console.log("login service error")
            console.log(error)
            reject(error);
          }})
    });
  }

}
