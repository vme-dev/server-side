var express = require('express');
var Post = require('../models/Post.js')
var router = express.Router();


router.get('/', (req,res) => {
	Post.find({}).then((posts) => {
		res.status(200).json(posts);
	})	
});

router.post('/', (req,res) => {

	const postData = {
		"title":req.body.title,
		"text":req.body.text,
	};

	var post = new Post(postData);

	post.save().then( (post) => {
		res.status(201).json(post);
	})
});

router.post('/edit', (req,res) => {

	Post.findById(req.body._id, function(err, post) {


	    if (err) {throw err;}
	     
	    post.title = req.body.title;
	    post.text = req.body.text;
	    
	    post.save(function(err) {
	        if (err) { throw err; }

	        console.log('Author updated successfully');
	        res.status(201).json(post);
	    });
	});	
});

router.delete('/:id', (req,res) => {
	Post.remove({_id:req.params.id}).then( () => {
		res.status(200).json({
			message: 'WELL!'
		})
	})
});

module.exports = router;