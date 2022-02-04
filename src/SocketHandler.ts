import { Server, Socket } from "socket.io";

import { UserRepository } from './repositories/UserRepository';
import { MessageRepository } from './repositories/MessageRepository';
import { ConnectionRepository } from './repositories/ConnectionRepository';

export class SocketHandler {
	private server: Server;
	private userRepository: UserRepository;
	private messageRepository: MessageRepository;
	private connectionRepository: ConnectionRepository;

	constructor(server: Server) {
		this.server = server;
		this.userRepository = UserRepository.getInstance();
		this.messageRepository = MessageRepository.getInstance();
		this.connectionRepository = ConnectionRepository.getInstance();

		this.setMiddlewares();
	}

	private setMiddlewares() {
		this.server.use(async (socket, next) => {
			const { login } = socket.handshake.auth;
		
			if (!login) {
				next(new Error('not authorized'));
			}
		
			socket.data = {
				user: await this.userRepository.getUserByLogin(login),
			};
		
			return next();
		});
	}

	private sendStatus(userName: String, status: string) {
		const totalOfConnections = this.connectionRepository.getTotalOfConnections();

		this.server.emit('totalConnections', totalOfConnections);
		this.server.emit('status', `${userName} ${status}`);

		console.log(`${userName} ${status}. Total connections: ${totalOfConnections}`);
	}

	public handleConnections() {
		this.server.on('connection', (socket) => {
			const { user } = socket.data;
			
			this.connectionRepository.addConnection({
				user,
				socket,
			});

			this.sendStatus(user.name, 'joined');
			this.server.emit('newConnection', user);
		
			socket.on('disconnect', () => {
				this.connectionRepository.removeConnection(socket);
				
				this.sendStatus(user.name, 'left');
				this.server.emit('lostConnection', user);
			});
		
			socket.on('message', (text) => {
				const message = this.messageRepository.createMessage({
					text,
					user,
				});

				this.server.emit('message', message);
				console.log(`${user.name} says: ${text}`);
			});
		});
	}

	public disconnect() {
		this.server.disconnectSockets();
	}
}