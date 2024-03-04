import jwt from 'jsonwebtoken'


export const verifyJWT = async (req,res,next) => {
    let token = req.cookies?.accessToken || req.headers['authorization'];
    if(!token){
        return res.status(400).json({msg:"unauthorized request"})
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: "Invalid token" });
        }

        req.user = user;
        next();
    });
}