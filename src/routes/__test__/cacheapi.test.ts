import request from 'supertest';
import {app} from '../../app';

it('returns a 201 on a healthy server', async () => {
    return request(app)
        .post('/')
});