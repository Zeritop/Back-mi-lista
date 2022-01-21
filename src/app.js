import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Import rutas
import usersRoutes from './routes/users.js';
import listsRoutes from './routes/lists.js';
import listsNoTk from './routes/listsnotk.js';
import usersTk from './routes/userstk.js';
import verifyToken from './validate-token.js';

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Settings
app.set('port', process.env.PORT || 4000);


// Middlewares
app.use(cors());
app.use(express.json());
 
const storage = multer.diskStorage({
        destination: join(__dirname, './storage/img'),
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })

app.use(multer({
    storage,
    dest: join(__dirname, 'storage/img')
}).single('image'))


// Static Files
app.use('/public', express.static(`${__dirname}/storage/img`))


//Routes
app.use('/api/users', usersRoutes);
app.use('/api/lists', verifyToken, listsRoutes);
app.use('/api/lists-no-tk', listsNoTk);
app.use('/api/usersTk', verifyToken, usersTk); 

export default app;