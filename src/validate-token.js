import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    if(req.header('auth-token')){
        const token = req.header('auth-token');
        const tokenV = token.substring(7, token.length);

        if(!token) return res.status(401).json({message: 'Acceso Denegado'});
    
        try{
            const verificar = jwt.verify(tokenV, process.env.TOKEN_SECRET)
            req.user = verificar;
            next();
        }catch(error){
            res.status(400).json({message: 'Usuario no valido'});
        }
    }else{
        return res.status(401).json({message: 'Acceso Denegado'});
    }

}

export default verifyToken;