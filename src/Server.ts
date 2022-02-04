import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import express from 'express';
import { Server } from "socket.io";

import routes from './Routes';
import { SocketHandler } from './SocketHandler';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/', express.static(`${__dirname}/public`));

const socketHandler = new SocketHandler(io);
socketHandler.handleConnections();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});