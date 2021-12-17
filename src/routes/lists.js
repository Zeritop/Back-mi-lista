import router from 'express';
import listCtrl from '../controllers/listController.js';

 const rutas = router.Router();
 const { addList, updateList, deleteList } = listCtrl;

rutas.post('/add-list', addList);

rutas.put('/update-list', updateList);

rutas.delete('/delete-list', deleteList);

 export default rutas