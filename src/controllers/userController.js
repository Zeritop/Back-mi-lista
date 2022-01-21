import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const userCtrl = {};

userCtrl.login = async (req, res) => {
    const { email, password } = req.body;

    // confirmar el email ingresado
    const user = await User.findOne({email});
    // si no lo encuentra devolver mensaje de error
    if(!user) return res.status(400).json({message: 'Usuario o contraseña invalido'});

    // si encuentra el usuario se verifica la contraseña
    const pass = await bcrypt.compare(password, user.password);
    // si no coincide se devuelve mensaje de error
    if(!pass) return res.status(400).json({message: 'Usuario o contraseña invalido'});

    // si los datos ingresados conciden, se genera un token
    const token = jwt.sign({
        username: user.username,
        id: user._id
    }, process.env.TOKEN_SECRET);

    // se envian los datos atravez de un HEADER
    res.header('auth-token', token).json({
        message: `Welcome ${user.username}`,
        data: token
    })

}

userCtrl.register = async (req, res) => {
    const { email, password, username } = req.body

    // verificar si el email ingresado existe
    const emailVerify = await User.findOne({email});
    if(emailVerify) return res.status(400).json({message: 'Email ya registrado'});
    
    const usernameVerify = await User.findOne({username});
    if(usernameVerify) return res.status(400).json({message: 'Username ya registrado'})

    // Si los valores tienen menos valor del indicado se devulde un mesaje de error y no se ejecuta lo demas
    if(email.length < 6) return res.status(400).json({message: 'Email: Minimo de longitud 6'})

    if(username.length < 3) return res.status(400).json({message: 'Username: Minimo de longitud 3'})

    if(username.length > 20) return res.status(400).json({message: 'Username: Maximo de longitud 20'})

    if(password.length < 6) return res.status(400).json({message: 'Password: Minimo de longitud 6'})


    // si el email no existe, se genera un salt y se hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);

    // se hace una instancia del modelo usuario con los datos recibidos
    const user = new User({
        email,
        username,
        password: pass
    });

    try {
        // se guarda el usuario en la base de datos y se devuelven los datos
        const userRegister = await user.save();
        res.json({
            message: 'Usuario registrado con exito!',
            data: userRegister
        })
        
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

userCtrl.getUser = async (req, res) => {
    const { username } = req.body; // Obtener el nombre del usuario

    const userName = await User.findOne({username}); // Buscar en la BD el usuario por el username
    if(!userName) return res.status(400).json({message: 'El usuario no existe'}) // Si no encuantra retorna con error y mensaje

    // devuelve un json con la info en caso de encontrarlo
    res.json({
        data: userName
    })

}

userCtrl.profileImage = async (req, res) => {
    const { user } = req.headers // Se obtiene el user desde la cabecera

    if(req.file){ // Si hay un archivo entra al IF
        // se obtiene el nombre del archivo 
        const { filename } = req.file

        try{
            // Se busca y actualiza el usuario dependiendo del user de obtenido
            await User.findOneAndUpdate({_id: user}, {
                imgUrl: filename // Se actaliza la propiedad imgUrl con el nombre del archivo
            })
            // Se envia un mensaje de exito
            res.status(200).json({message: 'Imagen guardada con exito!'})

        }catch(error){
            // Se envia un mensaje de error
            res.status(400).json({message: 'Error al guardar la imagen'})
        }
    }
}

userCtrl.getImgProfile = async (req, res) => {
    const { username } = req.body // Se obtiene el username 

    const userImg = await User.findOne({username}) // Se busca el usuario en la BD
    if(!userImg) return res.status(400).json({message: 'El usuario no existe'}) // En caso de no encontrarlo se devuelve un mensaje de error

    // En caso de existir se devuelve un json con el nombre de la imagen
    res.json({
        img: userImg.imgUrl
    })
}

export default userCtrl;