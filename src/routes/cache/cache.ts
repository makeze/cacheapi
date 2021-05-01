import express, {Request, Response} from 'express';
import {randomBytes} from 'crypto';

import {CacheEntry} from '../../models/cacheEntry';

const router = express.Router();

router.get('/api/health', (req: Request, res: Response) => {
    res.send('OK');
});

router.get('/api/cache/',   async (req: Request, res: Response) => {
    let cacheEntries = await CacheEntry.find();
    res.status(200).send(cacheEntries);
});

router.delete('/api/cache/',async (req: Request, res: Response) => {
    await CacheEntry.deleteMany({});
    res.status(204).send({});
});

router.get('/api/cache/:cacheKey',   async (req: Request, res: Response) => {
    const cacheKey = req.params.cacheKey;
    let cacheEntry = await CacheEntry.findOne({cacheKey: cacheKey});

    if (!cacheEntry) {
        CacheEntry.cacheMiss();
        cacheEntry = CacheEntry.build({
            cacheKey: cacheKey,
            cacheData: randomBytes(4).toString('hex')
        });
        await cacheEntry.save();
    } else {
        CacheEntry.cacheHit();
    }
    res.status(200).send(cacheEntry);
});

router.delete('/api/cache/:cacheKey',   async (req: Request, res: Response) => {
    const cacheKey = req.params.cacheKey;
    let cacheEntry = await CacheEntry.deleteOne({cacheKey: cacheKey});
    res.status(204).send(cacheEntry);
});

router.post('/api/cache',   async (req: Request, res: Response) => {
    const { cacheKey, cacheData } = req.body;
    let cacheEntry = await CacheEntry.findOne({cacheKey: cacheKey});

    if (!cacheEntry) {
        CacheEntry.cacheMiss();
        cacheEntry = CacheEntry.build({
            cacheKey: cacheKey,
            cacheData: cacheData
        });
    } else {
        CacheEntry.cacheHit();
        cacheEntry.set({
            cacheKey: cacheKey,
            cacheData: cacheData
        });
    }

    await cacheEntry.save();
    res.status(200).send(cacheEntry);
});

export {router as cacheRouter}