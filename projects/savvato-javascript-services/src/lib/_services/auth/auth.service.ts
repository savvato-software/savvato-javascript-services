import { Injectable } from '@angular/core';

import { StorageService } from '../storage/storage.service';
import { StorageKey } from '../storage/storage.model';

import { User } from '../../_models/user'

const { AUTH_TOKEN, AUTH_USER } = StorageKey;

@Injectable({
    providedIn: 'root',
})
export class AuthService  {
    redirectUrl = '';

    model = {user: new User(-1, '', '', '', '', []), jwt: ''};

    constructor(private storage: StorageService) {
        this.model['jwt'] = this.storage.read(AUTH_TOKEN) || '';
        this.model['user'] = this.storage.read(AUTH_USER) || '';
    }

    public setRedirectUrl(v: any) {
        this.redirectUrl = v;
    }

    public hasRole(role: string): boolean {
      return (this.model['user']['roles'].map(r => r['name']).includes(role));
    }

    public setUser(user: User) {
        this.model['user'] = user;
        this.storage.save(AUTH_USER, user);
    }

    public getUser() : User {
        return this.model['user'];
    }

    public setToken(token: string) {
        this.model['jwt'] = token;
        this.storage.save(AUTH_TOKEN, token);
    }

    public getToken(): string {
        return this.model['jwt'];
    }

    public logout() {
        this.model['jwt'] = '';
        this.storage.remove(AUTH_TOKEN);
        this.storage.remove(AUTH_USER);
    }

    public isLoggedIn(): boolean {
        return this.model['jwt'].length > 0;
    }
}
