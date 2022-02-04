import axios, { Axios } from 'axios';

import { IUser, UserFields } from './UserRepository';

export class GitHubRepository {
	private axios: Axios;
	
	constructor() {
		this.axios = axios.create({
			baseURL: 'https://api.github.com',
		});
	}

	async getUserByLogin(login: string): Promise<IUser> {
		const { data } = await this.axios.get(`/users/${login}`);

		const responseData = {};
		for (const field of UserFields) {
			responseData[field] = data[field];
		}

		return responseData as IUser;
	}
}