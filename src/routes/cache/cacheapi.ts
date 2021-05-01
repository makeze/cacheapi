import express from 'express';

const router = express.Router();

router.get('/cacheapi/health', (req, res) => {
    res.send('OK');
});

export {router as cacheRouter}