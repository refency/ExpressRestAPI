import { Op } from 'sequelize';
import models from '../../db/models';
import bcrypt from 'bcrypt';
import tokenService  from './tokenService';
import userDTO from '../dtos/userDTO';
import apiError from '../exceptions/apiError';

const { User } = models;

class apiService {
    async login (login, password) {
        const user = await User.findOne({ where: { login } })
        
        if (!user) throw apiError.BadRequest('Incorrect login')
        
        const isPasswordsEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordsEqual) throw apiError.BadRequest(`Passwords don't match`)

        const userDto = new userDTO(user);
        const tokens = await tokenService.generate({...userDto});
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async registration (login, password) {
        let registeredUser = await User.findOne({ where: { login }})

        if (registeredUser) throw apiError.BadRequest(`User with login: ${registeredUser.login} is already registered!`)

        if (!login.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+|([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/)) {
            throw apiError.BadRequest('Login must be email or phone number!')
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            throw apiError.BadRequest('Password is too weak, it must have: 8 or more symbols and have at least one letter of upper and lower case')
        }

        const user = await User.create({
            login: login,
            password: await bcrypt.hash(password, 3)
        })

        const userDto = new userDTO(user)
        const tokens = await tokenService.generate({...userDto})
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async logout (refreshToken) {
        console.log(refreshToken)
        if (!refreshToken) throw apiError.BadRequest('User is already logout!')

        const token = await tokenService.delete(refreshToken);
        
        return token;
    }

    async refresh (refreshToken) {
        if (!refreshToken) throw apiError.UnauthorizedError();

        const userData = await tokenService.validateRefreshToken(refreshToken);
        const token = await tokenService.find(refreshToken);

        if (!userData || !token) throw apiError.UnauthorizedError();

        const user = await User.findOne({ where: { login: userData.login } })
        const userDto = new userDTO(user);
        const tokens = await tokenService.generate({...userDto});
        await tokenService.save(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async info (refreshToken) {
        const userData = await tokenService.validateRefreshToken(refreshToken);
        console.log(refreshToken, userData)
        const user = await User.findOne({ where: { login: userData.login } })

        return user
    }
}

export default new apiService();
