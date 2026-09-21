import { Request, Response } from "express"



export class AuthContrloller {

    constructor() { }


    

    register = (req: Request, res: Response) => {

        res.json({ message: 'register' })

    }


    loginUser = (req: Request, res: Response) => {

        res.json({ message: 'login' })

    }

    validateEmail = (req: Request, res: Response) => {

        res.json({ message: 'validate email' })

    }

}