//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);


chai.use(chaiHttp);
//Our parent block
describe('Stops', () => {

/*
  * Test the /GET route
  */
  describe('/GET stop', () => {
    it('should list stops on /stop GET', function(done) {
      chai.request(server)
        .get('/v1/stop')
        .end(function(err, res){
          should.exist(res,"There is no response")
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].should.have.property('id')
          done();
        });
    });

    it('should get stop with id 1 /stop/1 GET', function(done) {
      chai.request(server)
        .get('/v1/stop/1')
        .end(function(err, res){
          should.exist(res,"There is no response")
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('id',1)
          done();
        });
    });

    it('should get exception with id A /stop/A GET', function(done) {
      chai.request(server)
        .get('/v1/stop/A')
        .end(function(err, res){
          should.exist(res,"There is no response")
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.have.property('code',404)
          res.body.should.have.property('description')
          done();
        });
    });

    it('should list of close stops on /stop POST', function(done) {
      chai.request(server)
        .post('/v1/stop')
        .send({
                nextTo:{
                  "type":"Point",
                  "coordinates":[34.917812,32.183939]},
                limit:10
              })
        .end(function(err, res){
          should.exist(res,"There is no response")
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.be.length(10)
          res.body[0].should.have.property('id')
          done();
        });
    });


  });

});