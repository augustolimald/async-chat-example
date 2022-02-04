import { NextFunction } from 'connect';
import { Request, Response} from 'express';
import { UserRepository } from '../repositories/UserRepository';

export class UserController {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = UserRepository.getInstance();
	}

	show = async (request: Request, response: Response) => {
		const { login } = request.params;

		const user = await this.userRepository.getUserByLogin(login);
		if (!user) {
			return response.status(404).json({ error: 'User not found' });
		}

		return response.status(200).json(user);
	}

	middleware = async (request: Request, response: Response, next: NextFunction) => {
		const { login } = request.query;
		
		if (!login) {
			return response.status(400).json({ error: 'User invalid' });
		}
		
		const user = await this.userRepository.getUserByLogin(login as string);
		if (!user) {
			return response.status(404).json({ error: 'User not found' });
		}

		return next();
	}
}