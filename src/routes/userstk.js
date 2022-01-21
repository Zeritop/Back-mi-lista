import router from 'express';
import userCtrl from '../controllers/userController.js';

const rutas = router.Router();

const { profileImage } = userCtrl;

rutas.post('/upload-profileImage', profileImage)

export default rutas