import { Request, Response } from 'express';

import { MessageRepository } from '../repositories/MessageRepository';

export class MessageController {
	private messageRepository: MessageRepository;
	
	constructor() {
		this.messageRepository = MessageRepository.getInstance();
	}

	index = async (request: Request, response: Response) => {
		const messages = this.messageRepository.getMessages();

		return response.status(200).json(messages.sort((a, b) => a.date.getTime() - b.date.getTime()));
	}
}