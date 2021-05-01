import express from 'express';
import {json} from 'body-parser';

import {cacheRouter} from './routes/cache/cache';

const app = express();
app.use(json());

app.use(cacheRouter);

app.all('*', async (req, res) => {
    console.log(`Route ${req.originalUrl} does not exist`);
    res.status(404).send('Resource could not be found');
});

export {app};