const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model');
const Posts = require('../posts/posts-model');

// The middleware functions also need to be required
const {
  logger,
  validateUserId,
  validateUser,
  validatePost,
  handleError } = require('../middleware/middleware');

const router = express.Router();

router.get('/',logger, (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then( users => {
      res.status(200).json(users);
    })
    .catch(next);
});


router.get('/:id', logger, validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post('/',logger, validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

router.put('/:id',logger, validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(next);
});

router.delete('/:id',logger, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.getById(req.params.id)
    .then(userToDelete => {
      Users.remove(req.params.id)
        .then(res.status(200).json(userToDelete));
    })
    .catch(next);
});

router.get('/:id/posts',logger, validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then( userPosts => {
      res.status(200).json(userPosts)
    })
    .catch(next);
});

router.post('/:id/posts',logger, validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert({...req.body, user_id: req.params.id})
    .then( newPost => {
      Posts.getById(newPost.id)
        .then(createdPost => {
          res.status(201).json(createdPost);
        })
        .catch(next);
      // console.log(newPost)
    })
    .catch(next);
});

router.use(handleError);

// do not forget to export the router
module.exports = router;