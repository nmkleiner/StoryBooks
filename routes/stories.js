const express = require('express');
const mongoose = require('mongoose')
const Story = mongoose.model('stories')
const User = mongoose.model('users')
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth')

// Stories Index
router.get('/', (req, res) => {
    Story.find({
        status: 'public'
    })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories
            });
        })
});

//Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({_id: req.params.id})
        .sort({date: 'desc'})
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if (story.status === 'public') {
                res.render('stories/show', {story})
            } else {
                if (req.user && req.user.id == story.user._id) {
                    res.render('stories/show', {story})
                } else {
                    res.redirect('/stories')
                }
            }
        })
})

//List stories from a user
router.get('/user/:userId', (req, res) => {
    Story.find({user: req.params.userId, status: 'public'})
        .populate('user')
        .then(stories => {
            res.render('stories/index', {stories})
        })
})

//Logged in users stories
router.get('/my',ensureAuthenticated, (req, res) => {
    Story.find({user: req.user.id, status: 'public'})
        .populate('user')
        .then(stories => {
            res.render('stories/index', {stories})
        })
})

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then(story => {
            if (story.user != req.user.id) {
             res.redirect('/stories')
            } else {
                res.render('stories/edit', {story});
            }
        })
});

//process add story
router.post('/', (req, res) => {
    let {allowComments} = req.body
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments,
        user: req.user.id,
    }

    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`)
        })
})
//Edit Form Process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then(story => {
            let {allowComments} = req.body
            story.title = req.body.title
            story.body = req.body.body
            story.status = req.body.status
            story.allowComments = allowComments
            story.save()
                .then(story => {
                    res.redirect('/dashboard')
                })
        })
})

//DELETE Story
router.delete('/:id', (req, res) => {
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard')
        })
})

//Add Comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }

            story.comments.unshift(newComment)
            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`)
                })
        })
})

module.exports = router;