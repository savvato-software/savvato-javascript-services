
export class User {
	id: number;
	name: string;
	password: string;
	phone: string;
	email: string;
  roles: string[];
  lastLoginTimeInMillis: number;

	constructor(id: any, name: string, password: string, phone: string, email: string, roles: string[], lastLoginTimeInMillis: number) {
		this.id = id;
		this.name = name;
		this.password = password;
		this.phone = phone;
		this.email = email;
    this.roles = roles;
    this.lastLoginTimeInMillis = lastLoginTimeInMillis;
	}

}

