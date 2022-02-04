import { Request, Response} from 'express';

import { ConnectionRepository } from '../repositories/ConnectionRepository';

export class ConnectionController {
	private connectionRepository: ConnectionRepository;

	constructor() {
		this.connectionRepository = ConnectionRepository.getInstance();
	}

	index = async (request: Request, response: Response) => {
		const { login } = request.query;

		const connections = this.connectionRepository.getConnections();

		return response.status(200).json(connections.map(conn => conn.user).filter(user => user.login !== login));
	}
}