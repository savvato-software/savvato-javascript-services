
export class User {
	id: number;
	name: string;
	password: string;
	phone: string;
	email: string;
  roles: string[];

	constructor(id: any, name: string, password: string, phone: string, email: string, roles: string[]) {
		this.id = id;
		this.name = name;
		this.password = password;
		this.phone = phone;
		this.email = email;
    this.roles = roles;
	}

}

