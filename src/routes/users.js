import router from 'express';
import userCtrl from '../controllers/userController.js';

const rutas = router.Router();
const { login, register, getUser, getImgProfile } = userCtrl;

rutas.post('/login', login);

rutas.post('/register', register);

rutas.post('/get-user', getUser);

rutas.post('/get-img-profile', getImgProfile)


export default rutas;