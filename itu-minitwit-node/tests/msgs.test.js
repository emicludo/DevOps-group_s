const request = require('supertest');
const app = require('../app');
const database = require('../src/db/dbService');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

describe('GET /msgs', () => {

    afterEach(() => {
        sinon.restore();
    });

    it('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
            .get('/msgs')
            .set('Authorization', 'incorrect_token');

        expect(response.status).to.equal(403);
    });

    it('returns 500 if the database does not work properly', async () => {
        const allStub = sinon.stub(database, 'all').callsArgWith(2, 'Error', null);

        const response = await request(app)
            .get('/msgs')
            .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')

        expect(response.status).to.equal(500);
        sinon.assert.calledOnce(allStub);
    });

    it('returns messages if everything is fine', async () => {
        const allStub = sinon.stub(database, 'all').callsArgWith(2, null, [{text: 'hello world', pubDate: '20-4-2020', username: 'testuser'}]);

        const response = await request(app)
            .get('/msgs')
            .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')

        expect(response.body).to.eql([{content: 'hello world', pubDate: '20-4-2020', user: 'testuser'}]);
        sinon.assert.calledOnce(allStub);
    });

});