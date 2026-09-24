import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";




export class AuthService {
    constructor() {

    }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const exitsUser = await UserModel.findOne({ email: registerUserDto.email })

        if (exitsUser) throw CustomError.badRequest('Email already exist')

        try {
            const user = new UserModel(registerUserDto)


            //encriptar pass
            user.password =  bcryptAdapter.hash(registerUserDto.password)

            await user.save()


            //jwt 

            //email confirmacion

            const { password, ...rest } = UserEntity.fromObject(user)



            return { ...rest, token: 'ABC' }

        } catch (error) {
            throw CustomError.internalSever(`${error}`)
        }



    }


    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Email not exist');

        const isMatching =  bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isMatching) throw CustomError.badRequest('Password is not valid');


        const { password, ...userEntity } = UserEntity.fromObject(user);


        return {
            user: userEntity,
            token: 'ABC',
        }



    }
}

