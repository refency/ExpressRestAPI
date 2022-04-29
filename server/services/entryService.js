import * as uuid from 'uuid';
import * as path from 'path';
import fs from 'fs';
import models from '../../db/models';
import apiError from '../exceptions/apiError';
import ApiService from './apiService.js'

const { Entry } = models;


class EntryService {
    async save (token, text, file) {
        if (file) file = file.message_media

        const user = await ApiService.info(token)

        const entry = await Entry.create({
            messageText: text,
            messageMedia: file,
            userId: user.id
        })

        return entry
    }

    async update (req) {
        const { id } = req.params
        if (!id) throw apiError.BadRequest('Id does not specified')

        const { refreshToken } = req.cookies
        const user = await ApiService.info(refreshToken)
        const entry = await Entry.findOne({ where: { id } })
        if (user.id != entry.userId) throw apiError.BadRequest('You do not have access to this entry')

        if (req.files.message_media) req.files = req.files.message_media

        await entry.create({
            messageText: req.body.message_text,
            messageMedia: req.files,
            userId: user.id
        })

        return entry
    }

    async delete (req) {
        const { id } = req.params
        if (!id) throw apiError.BadRequest('Id does not specified')

        const entry = await Entry.findOne({ where: { id } })
        if (!entry) throw apiError.BadRequest(`File by id: ${id} does not exist`)

        const { refreshToken } = req.cookies
        const user = await ApiService.info(refreshToken)
        if (user.id != entry.userId) throw apiError.BadRequest('You do not have access to this entry')

        await entry.destroy();

        return `Entry by id: ${id} was been deleted`
    }
}

export default new EntryService();
