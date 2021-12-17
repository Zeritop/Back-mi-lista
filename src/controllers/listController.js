import List from '../models/Lists.js';

const listCtrl = {};

listCtrl.addList = async (req, res) => {
    const { idList, author, title, urlImg, typeList, favourite, seen } = req.body

    const verifyList = await List.findOne({idList});
    if(verifyList) return res.status(400).json({message: 'Ya está almacenado en la lista'});

    const saveList = new List({
        idList,
        author, 
        title, 
        urlImg, 
        typeList,
        favourite,
        seen
    })

    try{
        await saveList.save();
        res.status(200).json({message: 'Agregado correctamente'});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

listCtrl.getLists =  async (req, res) => {
    const { author } = req.body
    
    const lists = await List.find({author});
    
    if(!lists) return res.status(400)

    res.status(200).json({
        data: lists
    })
}

listCtrl.updateList = async (req, res) => {
    const { _id, author, title, urlImg, favourite, seen, idList, typeList, userTk } = req.body

    if(author !== userTk) return res.status(403).json({message: 'Usuario no autorizado para esta acción'})

    const verifyList = await List.findOne({_id});
    if(!verifyList) return res.status(400).json({message: 'No se encontró en la lista'})


    try{
        await List.findOneAndUpdate({_id}, {
            idList,
            author,
            title,
            urlImg,
            typeList,
            favourite,
            seen
        })
    
        res.status(200).json({message: 'Actualizado correctamente'})

    }catch(error){
        res.status(400).json({message: 'Error al Actualizar'})
    }
}

listCtrl.deleteList = async (req, res) => {
    const { _id, author, userTk } = req.body

    if(author !== userTk) return res.status(403).json({message: 'Usuario no autorizado para esta acción'})

    try{
        await List.findOneAndDelete({_id});
        res.status(200).json({message: 'Eliminado de la lista'})

    }catch(error){
        res.status(400).json({message: 'Error al eliminar'})
    }
}

export default listCtrl;