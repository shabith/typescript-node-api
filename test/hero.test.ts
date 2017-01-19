import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/heroes', () => {
    it('responds with JSON array', () => {
        return chai.request(app).get('/api/v1/heroes')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length.above(0);
            });
    });

    it('should include Wolverine', () => {
        return chai.request(app).get('/api/v1/heroes')
            .then(res => {
                let Wolverine = res.body.find(hero => hero.name === 'Wolverine');
                expect(Wolverine).to.exist;
                expect(Wolverine).to.have.all.keys([
                    'id',
                    'name',
                    'aliases',
                    'occupation',
                    'gender',
                    'height',
                    'hair',
                    'eyes',
                    'powers'
                ]);
            });
    });
});

describe('GET api/v1/heroes/:id', () => {
    it('responds with single JSON object', () => {
        return chai.request(app).get('/api/v1/heroes/1')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
            });
    });

    it('should return Luke Cage', () => {
        return chai.request(app).get('/api/v1/heroes/1')
            .then(res => {
                expect(res.body.hero.name).to.equal('Luke Cage');
            });
    });
});

describe('PUT api/v1/heroes/', () => {
    it('add a new hero', () => {
        return chai.request(app).put('/api/v1/heroes')
            .send({
                "data": {
                    "name": "Iron Man",
                    "aliases": [
                    "Tony Stark",
                    "Golden Gladiator",
                    "Spare Parts Man",
                    "Space-Knight"
                    ],
                    "occupation": "inventor",
                    "gender": "male",
                    "height": {
                    "ft": 6,
                    "in": 1
                    },
                    "hair": "black",
                    "eyes": "blue",
                    "powers": []
                }
            })
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
            });
    });
});

describe('DELETE api/v1/heroes/:id', () => {
    it('remove hero', () => {
        return chai.request(app).del('/api/v1/heroes/4cdee660-de5d-11e6-8529-f1da2aa3e5cb')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
            })
    });
});

describe('PUT api/v1/heroes/:id', () => {
    it('update hero', () => {
        return chai.request(app).put('/api/v1/heroes/865a19d0-de5f-11e6-8485-17ce2701f314')
            .send({
                "data": {
                    "name": "Iron Man updated"
                }
            })
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
            })
    });
});
