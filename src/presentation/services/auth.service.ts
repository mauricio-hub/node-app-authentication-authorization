import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";




export class AuthService {
    constructor(
        private readonly emailService: EmailService,
    ) {

    }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const exitsUser = await UserModel.findOne({ email: registerUserDto.email })

        if (exitsUser) throw CustomError.badRequest('Email already exist')

        try {
            const user = new UserModel(registerUserDto)


            //encriptar pass
            user.password = bcryptAdapter.hash(registerUserDto.password)

            await user.save()

            //jwt 

            const token = await JwtAdapter.generateToken({ id: user.id })
            if (!token) throw CustomError.internalSever("Error while creating JWT")

            //email confirmacion

            await this.sendEmailValidationLink(user.email)

            const { password, ...rest } = UserEntity.fromObject(user)

            return { ...rest, token }

        } catch (error) {
            throw CustomError.internalSever(`${error}`)
        }



    }


    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Email not exist');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isMatching) throw CustomError.badRequest('Password is not valid');


        const { password, ...userEntity } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({ id: user.id })
        if (!token) throw CustomError.internalSever("Error while creating JWT")

        return {
            user: userEntity,
            token: token,
        }



    }

    private sendEmailValidationLink = async (email: string) => {

        const token = await JwtAdapter.generateToken({ email });

        if (!token) throw CustomError.internalSever('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
        <h1>Validate your email <h1>
        <p>Click on the follow link to validate your email</p>
        <a href="${link}">Validate your email: ${email}</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSet = await this.emailService.sendEmail(options);

        if (!isSet) throw CustomError.internalSever('Error sending email')

        return true

    }

    public validateEmail = async (token:string) =>{
        
        const payload = await JwtAdapter.validateToken(token)
        if(!payload) throw CustomError.unathorized('Invalid Token')

        const {email} = payload as {email :string}
        if(!email) throw CustomError.internalSever('Email not in token')

        const user = await UserModel.findOne({email})
        if(!user)  throw CustomError.internalSever('Email not exist')
        
        user.emailValidated = true
        
        await user.save()

        return true

    }
}

