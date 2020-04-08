/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require("mongoose");

mongoose.connect( process.env.DATA_BASE, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : false } );
let Schema =  mongoose.Schema;
let librarySchema = new Schema({
  title: String,
  comments: Array,
})
let Library = mongoose.model('Library', librarySchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      let result;
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      result = await Library.find({}).select('-__v -commentcount')
      res.send(result);
    })
    
    .post(async function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(title){
        let book = new Library({
          title: title,
          comments:[]
        })
        await book.save();
        let result = await Library.findById({_id: book._id}).select('-__v')
        res.json({title: result.title, comments: result.comments, _id: result._id});
      } 
      else{
        res.send('Title required');
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      await Library.deleteMany({});
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      var bookid = req.params.id;
      let tes =/^[0-9a-fA-F]{24}$/
      if (tes.test(bookid)) {
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        let book = await Library.findById({_id: bookid}).select('-__v');
        if (book) { 
          res.json({title: book.title, comments: book.comments, _id: book._id}); 
        }
        else {
          res.send('could not find this bookid'+ bookid);
        }  
      }
      else{
        res.send('bad bookid =>'+bookid);
      }
    })
    
    .post(async function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      let tes =/^[0-9a-fA-F]{24}$/
      if (tes.test(bookid)) {
        //json res format same as .get
        let book = await Library.findById({_id: bookid}).select('-__v');
        if (book) {
          book.comments.push(comment);
          await book.save();
          res.json({title: book.title, comments: book.comments, _id: book._id}); 
        }
        else {
          res.send('could not find this bookid'+ bookid);
        }  
      }
      else{
        res.send('bad bookid =>'+ bookid);
      }
    })
    
    .delete( async function(req, res){
      var bookid = req.params.id;
      
      let tes =/^[0-9a-fA-F]{24}$/
      // verified bookid is a mongoose id 
      if (tes.test(bookid)) {
        let book = await Library.findByIdAndRemove({_id: bookid}).select('-__v');
        // verified if this bookid exist
        if (book) { 
          //if successful response will be 'delete successful'
          res.json("delete seccessful"); 
        }
        else {
          res.send('could not find this bookid'+ bookid);
        }  
      }
      else{
        res.send('bad bookid =>'+ bookid);
      }

    });
  
};
