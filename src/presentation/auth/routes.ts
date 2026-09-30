import { Router } from 'express';
import { AuthContrloller } from './controller';
import { AuthService,EmailService } from '../services';
import { envs } from '../../config';



export class AuthRoutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    )

    const authService = new AuthService(emailService)
    const controller = new AuthContrloller(authService);

    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );

    router.post('/login', controller.loginUser)
    router.post('/register', controller.register)

    router.get('/validate-email/:token', controller.validateEmail)



    return router;
  }


}

