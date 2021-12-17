import dotenv from 'dotenv';
import app from './app.js';
import './database.js';
dotenv.config();

const main = async () => {
    await app.listen(app.get('port'));
    console.log('Server on Port', app.get('port'));
}

main();