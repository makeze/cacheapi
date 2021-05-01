import request from 'supertest';
import {randomBytes} from 'crypto';

import {app} from '../../app';
import { CacheEntry } from '../../models/cacheEntry';

it('returns a 201 on a healthy server', async () => {
    return request(app)
        .get('/api/health')
        .send()
        .expect(200);
});

it('returns a 404 on a non existing route', async () => {
    return request(app)
        .get('/')
        .send()
        .expect(404);
});

it('returns the cache data and prints cache miss if the cache key is not found', async () => {
    return request(app)
        .get(`/api/cache/${randomBytes(4).toString('hex')}`)
        .send()
        .expect(200);
});

it('returns the cache data and prints cache hit if the cache key is found', async () => {
    const cacheKey = '123';
    const firstResponse = await request(app)
        .get(`/api/cache/${cacheKey}`)
        .send()
        .expect(200);

    const secondResponse = await request(app)
        .get(`/api/cache/${cacheKey}`)
        .send()
        .expect(200);

    expect(firstResponse.body.cacheData).toEqual(secondResponse.body.cacheData);
});

it('returns all keys stored in the cache', async () => {
    let allCacheEntries = await request(app)
        .get(`/api/cache/`)
        .send()
        .expect(200);

    expect(allCacheEntries.body.length).toEqual(0);

    let cacheKey = '123';
    let cacheData = 'qwe';
    await request(app)
        .post('/api/cache/')
        .send({
            cacheKey,
            cacheData
        })
        .expect(200);

    cacheKey = '456';
    await request(app)
        .post('/api/cache/')
        .send({
            cacheKey,
            cacheData
        })
        .expect(200);

    allCacheEntries = await request(app)
        .get(`/api/cache/`)
        .send()
        .expect(200);

    expect(allCacheEntries.body.length).toEqual(2);
});

it('updates a cache entry for provided cache key', async () => {
    const cacheKey = '123';
    let cacheData = 'qwe';

    const firstResponse = await request(app)
        .post('/api/cache/')
        .send({
            cacheKey,
            cacheData
        })
        .expect(200);

    cacheData = 'asd';

    const secondResponse = await request(app)
        .post('/api/cache/')
        .send({
            cacheKey,
            cacheData
        })
        .expect(200);

    expect(firstResponse.body.cacheData).toEqual('qwe');
    expect(secondResponse.body.cacheData).toEqual('asd');
});

it('deletes the entry for provided cache key', async () => {
    const cacheKey = '123';
    let cacheData = 'qwe';

    // creating an entry by sending a post request
    const firstResponse = await request(app)
        .post('/api/cache/')
        .send({
            cacheKey,
            cacheData
        })
        .expect(200);

    expect(firstResponse.body.cacheData).toEqual(cacheData);

    // deleting an entry by sending a delete request

    await request(app)
        .delete(`/api/cache/${cacheKey}`)
        .send()
        .expect(204);

    // generating a new entry with a random string
    const secondResponse = await request(app)
        .get(`/api/cache/${cacheKey}`)
        .send()
        .expect(200);
    expect(firstResponse.body.cacheData).not.toEqual(secondResponse.body.cacheData);
});

it('deletes all entries from the cache', async () => {
    let cacheKey = '123';
    let cacheData = 'qwe';

    //creating entries
    await request(app)
        .post('/api/cache/')
        .send({
            cacheKey,
            cacheData
        })
        .expect(200);

    cacheKey = '456';
    await request(app)
        .post('/api/cache/')
        .send({
            cacheKey,
            cacheData
        })
        .expect(200);

    // checking if the number of created entries matches
    let allCacheEntries = await request(app)
        .get(`/api/cache/`)
        .send()
        .expect(200);

    expect(allCacheEntries.body.length).toEqual(2);

    // deleting all entries
    await request(app)
        .delete(`/api/cache/`)
        .send()
        .expect(204);

    allCacheEntries = await request(app)
        .get(`/api/cache/`)
        .send()
        .expect(200);

    expect(allCacheEntries.body.length).toEqual(0);
});