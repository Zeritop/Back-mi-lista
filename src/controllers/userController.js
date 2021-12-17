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
    const { username } = req.body;

    const userName = await User.findOne({username});
    if(!userName) return res.status(400).json({message: 'El usuario no existe'})

    res.json({
        data: userName
    })

}

export default userCtrl;