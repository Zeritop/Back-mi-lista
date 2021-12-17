import router from 'express';
import userCtrl from '../controllers/userController.js';

const rutas = router.Router();
const { login, register, getUser } = userCtrl;

rutas.post('/login', login);

rutas.post('/register', register);

rutas.post('/get-user', getUser);


export default rutas;