import router from 'express';
import listCtrl from '../controllers/listController.js';

const rutas = router.Router();

const { getLists } = listCtrl;

rutas.post('/get-lists', getLists);

 export default rutas