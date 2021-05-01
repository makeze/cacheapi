import mongoose from 'mongoose';

import {app} from './app';

const start = async () => {
    let MONGO_URI = 'mongodb://127.0.0.1:27017/cacheapi';
    let PORT = 3000;

    if (!process.env.MONGO_URI) {
        console.log(`Mongo connection uri is not provided using: ${MONGO_URI}`);
    } else {
        MONGO_URI = process.env.MONGO_URI;
    }

    if (!process.env.PORT) {
        console.log(`Application port is not provided using: ${PORT}`);
    } else {
        PORT = +process.env.PORT;
    }

    try {
        await mongoose.connect(MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (err) {
        console.error(err);
    }

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
}

start();