/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

let parameter = '5e8e30a797f7ee3af933b7be';
chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        assert.isArray(res.body[0].comments, 'comment should be an array');
       
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: "Test Project",
          })
          .end(function(err, res){
            assert.equal(res.body.title, "Test Project");
            assert.property(res.body,'comments');
          
            done();
          })
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.text, "Title required")
          
            done();
          })
        
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.isArray(res.body);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            assert.isArray(res.body[0].comments);
       
            done();
          });

      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/azerty1234')
          .end(function(err, res){
            assert.equal(res.text, 'bad bookid =>azerty1234');
       
            done();
          });
      
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/'+parameter)
          .end(function(err, res){
            assert.equal(res.type, 'application/json');
            assert.equal(res.body._id, parameter);
            assert.isArray(res.body.comments);
       
            done();
          });

      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .get('/api/books/5e8e30a797f7ee3af933b7be')
          .send({
            id:'5e8e30a797f7ee3af933b7be',
            comment:'test comment'
          })
          .end(function(err, res){
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'title');
            assert.equal(res.body._id, "5e8e30a797f7ee3af933b7be");
            assert.isAtLeast(res.body.comments.indexOf('test comment'), 0);
       
            done();
          });

      });

      test('Test POST /api/books/[id] with invalid id', function(done){
        chai.request(server)
          .post('/api/books/id')
          .send({
            id:'id',
            comment:'test comment'
          })
          .end(function(err, res){
            assert.equal(res.text, 'bad bookid =>id');

            done();
          });

      });

    });

  });

});
