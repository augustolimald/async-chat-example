import { IUser } from './UserRepository';

interface IMessageCreation {
	text: string;
	user: IUser;
}

interface IMessage extends IMessageCreation {
	id: string;
	date: Date;
}

export class MessageRepository {
	private messagesStorage: IMessage[];
	
	private static instance: MessageRepository;
	static getInstance() {
		if (!MessageRepository.instance) {
			MessageRepository.instance = new MessageRepository();
		}

		return MessageRepository.instance;
	}

	private constructor() {
		this.messagesStorage = [];
	}

	createMessage(messageCreation: IMessageCreation) {
		const { user, text } = messageCreation;
		
		const id = `${new Date().getTime()}-${user.login}`;
		const date = new Date();

		const message = {
			id,
			text,
			user,
			date,
		};

		this.messagesStorage = [message].concat(this.messagesStorage);

		return message;
	}

	getMessages() {
		return [...this.messagesStorage];
	}
}