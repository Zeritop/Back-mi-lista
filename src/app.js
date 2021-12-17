import express from 'express';
import cors from 'cors';

// Import rutas
import usersRoutes from './routes/users.js';
import listsRoutes from './routes/lists.js';
import listsNoTk from './routes/listsnotk.js';
import verifyToken from './validate-token.js';

const app = express();

// Settings
app.set('port', process.env.PORT || 4000);


// Middlewares
app.use(cors());
app.use(express.json());


//Routes
app.use('/api/users', usersRoutes);
app.use('/api/lists', verifyToken, listsRoutes);
app.use('/api/lists-no-tk', listsNoTk); 

export default app;