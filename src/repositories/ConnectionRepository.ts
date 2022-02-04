import { Socket } from 'socket.io';

import { IUser } from './UserRepository';

interface IConnection {
	user: IUser;
	socket: Socket;
}

export class ConnectionRepository {
	private connectionsStorage: IConnection[];
	
	private static instance: ConnectionRepository;
	static getInstance() {
		if (!ConnectionRepository.instance) {
			ConnectionRepository.instance = new ConnectionRepository();
		}

		return ConnectionRepository.instance;
	}

	private constructor() {
		this.connectionsStorage = [];
	}

	addConnection(connection: IConnection) {
		this.connectionsStorage.push(connection);	
	}

	getConnections() {
		return [...this.connectionsStorage];
	}

	removeConnection(socket: Socket) {
		const index = this.connectionsStorage.findIndex(connection => connection.socket === socket);
		this.connectionsStorage.splice(index, 1);
	}

	getTotalOfConnections() {
		return this.connectionsStorage.length;
	}
}