import Router from 'express';
import api from '../controllers/api.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router()

router.post('/signin', api.login, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/signin/new_token', api.refreshToken, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/signup', api.registration, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})
router.post('/entry/upload', authMiddleware, api.entryUpload, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.get('/logout', authMiddleware, api.logout, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.put('/entry/update/:id', authMiddleware, api.EntryUpdate, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

router.delete('/entry/delete/:id', authMiddleware, api.entryDelete, function(req, res, next) {
    res.json({ msg: 'CORS is enabled' })
})

export default router;