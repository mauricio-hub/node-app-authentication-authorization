import { Router } from 'express';
import { AuthContrloller } from './controller';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    
    const controller = new AuthContrloller();

    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );

    router.post('/login', controller.loginUser)
    router.post('/register', controller.register)

    router.get('/validate-email/:token', controller.validateEmail)



    return router;
  }


}

