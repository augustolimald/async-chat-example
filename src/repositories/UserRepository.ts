import { GitHubRepository } from './GitHubRepository';

export interface IUser {
	id: number;
	login: string;
	avatar_url: string;
	name: string;
	bio: string;
	url: string;
};

export const UserFields = ['id', 'login', 'avatar_url', 'name', 'bio', 'url'];

interface IUserStorage {
	[key: string]: IUser;
}

export class UserRepository {
	private usersStorage: IUserStorage;
	private gitHubRepository: GitHubRepository;
	
	private static instance: UserRepository;
	static getInstance() {
		if (!UserRepository.instance) {
			UserRepository.instance = new UserRepository();
		}

		return UserRepository.instance;
	}

	private constructor() {
		this.gitHubRepository = new GitHubRepository();
		this.usersStorage = {};
	}

	async getUserByLogin(login: string) {
		const existingUser = this.usersStorage[login];
		if (existingUser) {
			return existingUser;
		}

		try {
			const user = await this.gitHubRepository.getUserByLogin(login);
			this.usersStorage[login] = user;

			return user;
		} catch (error) {
			return null;
		}
	}
}