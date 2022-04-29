import ApiService from '../services/apiService.js'
import entryService from '../services/entryService.js';

class apiController {
    async login(req, res, next) {
        try {
            const { login, password } = req.body;
            const userData = await ApiService.login(login, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async registration(req, res, next) {
        try {
            const { login, password } = req.body;
            const userData = await ApiService.registration(login, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            const token = await ApiService.logout(refreshToken);

            res.clearCookie('refreshToken');

            return res.json(token)
        } catch (err) {
            next(err)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            const userData = await ApiService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async entryUpload(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            const file = await entryService.save(refreshToken, req.body.message_text, req.files)

            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async entryDelete (req, res, next) {
        try {
            const file = await entryService.delete(req)
            
            res.json(file)
        } catch (err) {
            next(err)
        }
    }

    async EntryUpdate (req, res, next) {
        try {
            const file = await entryService.update(req);
            
            res.json(file)
        } catch (err) {
            next(err)
        }
    }
}

export default new apiController();
