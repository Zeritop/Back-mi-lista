import List from '../models/Lists.js';
import User from '../models/User.js';

const listCtrl = {};

listCtrl.addList = async (req, res) => {
    const { 
        idList,
        description,
        title,
        urlImg,
        typeList,
        userId,
        favourite,
        seen
     } = req.body

    const verifyList = await List.findOne({idList});
    

    const saveList = new List({
        idList,
        description, 
        title, 
        urlImg, 
        typeList
    })

    try{
        if(!verifyList) {
            try{
                const salvar = await saveList.save()
                
                const user = await User.findOne({_id: userId})   
                
                user.lists.push({lista: salvar._id, favourite, seen});  
    
                await user.save();

                return res.status(200).json({message: 'Lista guardada con exito!'})
    
            }catch(error){
                console.log(error)
            }
        }else{
            const user = await User.findOne({_id: userId})
    
            if(user.lists !== undefined){
                if(user.lists.includes(verifyList._id)) return res.status(400).json({message: 'Ya está almacenado en la lista'});
        
                user.lists.push({lista: verifyList._id, favourite, seen});
        
                await user.save();
        
                return res.status(200).json({message: 'Lista guardada con exito!'})
    
            }
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

listCtrl.getLists =  async (req, res) => {
    const { username  } = req.body
    
    const user = await User.findOne({username}).populate('lists.lista')
    
    if(!user) return res.status(400)

    console.log(user.lists)

    res.status(200).json({
        data: user.lists
    })
}

listCtrl.updateList = async (req, res) => {
    const { nameLogin, id, favourite, seen, userTk } = req.body

    if(nameLogin !== userTk) return res.status(403).json({message: 'Usuario no autorizado para esta acción'})

    const verifyList = await User.findOne({username: userTk});

    const verify = verifyList.lists.filter(v => v._id.toString() === id)

    if(verify.length === 0) return res.status(400).json({message: 'No se encontró en la lista'})

    const listaE = verifyList.lists.map(v => v._id.toString()).indexOf(id)
    verifyList.lists[listaE].favourite = favourite;
    verifyList.lists[listaE].seen = seen;

    try{
        await verifyList.save();
    
        res.status(200).json({message: 'Actualizado correctamente'})

    }catch(error){
        res.status(400).json({message: 'Error al Actualizar'})
    }
}

listCtrl.deleteList = async (req, res) => {
    const { nameLogin, id, userTk } = req.body

    if(nameLogin !== userTk) return res.status(403).json({message: 'Usuario no autorizado para esta acción'})

    try{
        const listDelete = await User.findOne({username: userTk});
        
        listDelete.lists = listDelete.lists.filter(ld => ld._id?.toString() !== id) 

        await listDelete.save();

        res.status(200).json({message: 'Eliminado de la lista'})

    }catch(error){
        res.status(400).json({message: 'Error al eliminar'})
    }
}

export default listCtrl;