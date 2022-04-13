
export class User {
	id: number;
	name: string;
	password: string;
	phone: string;
	email: string;

	constructor(id: any, name: string, password: string, phone: string, email: string) {
		this.id = id;
		this.name = name;
		this.password = password;
		this.phone = phone;
		this.email = email;
	}

}

