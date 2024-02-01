import { config } from 'dotenv';
import { createServer } from 'http';
import app from './index.js'

// const app = require('./index.js');
const server = createServer(app);
server.listen(process.env.PORT);