import { Request, Response , NextFunction} from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";




export class AuthMiddleware {


    static async validateJWT(req:Request,res:Response,next:NextFunction){

        const authorization =req.header('Authorization')

        if(!authorization) return res.status(401).json({message:'Unauthorized'})
        

        if(!authorization.startsWith('Bearer ')) return res.status(401).json({message:'Unauthorized invalid bearer token'})
        

        const token = authorization.split(' ').at(1) || '';

        try{

            const payload = await JwtAdapter.validateToken<{id:string}>(token);

            if(!payload) return res.status(401).json({message:'Unauthorized invalid token'})

            const user = await UserModel.findById(payload.id);
            
            if(!user) return res.status(401).json({message:'Unauthorized user not found'})

            req.body.user = UserEntity.fromObject(user);
            //process the request and pass control to the next middleware or route handler
            next();
            

        }catch(err){
            return res.status(500).json({message:'Internal server error'})
        }



    }

}