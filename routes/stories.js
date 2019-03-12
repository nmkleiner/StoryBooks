const express = require('express');
const mongoose = require('mongoose')
const Story = mongoose.model('stories')
const User = mongoose.model('users')
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth')

// Stories Index
router.get('/', async (req, res) => {
    const stories = await Story.find({status: 'public'})
        .populate('user')
    res.render('stories/index', {stories, user: null});
});

//Show Single Story
router.get('/show/:id', async (req, res) => {
    const story = await Story.findOne({_id: req.params.id})
        .sort({date: 'desc'})
        .populate('user')
        .populate('comments.commentUser')
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

//List stories from a user
router.get('/user/:userId', async (req, res) => {
    const user = await User.findOne({_id: req.params.userId})
    let stories = await Story
        .find({user: req.params.userId, status: 'public'})
        .populate('user')
    stories.forEach(story => story.isUserStory = true)
    res.render('stories/index', {stories, user})

})

//Logged in users stories
router.get('/my',ensureAuthenticated, async (req, res) => {
    const stories = await Story.find({user: req.user.id, status: 'public'})
        .populate('user')
    res.render('stories/index', {stories})
})

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const story = await Story.findOne({_id: req.params.id})
    story.user != req.user.id?
        res.redirect('/stories')
        :
        res.render('stories/edit', {story});
});

//process add story
router.post('/', async (req, res) => {
    let {allowComments} = req.body
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments,
        user: req.user.id,
    }

    const story = await new Story(newStory)
        .save()
    res.redirect(`/stories/show/${story.id}`)
})

//Edit Form Process
router.put('/:id', async (req, res) => {
    let story = await Story.findOne({
        _id: req.params.id
    })

    let {allowComments} = req.body
    story.title = req.body.title
    story.body = req.body.body
    story.status = req.body.status
    story.allowComments = allowComments
    await story.save()
    res.redirect('/dashboard')
})

//DELETE Story
router.delete('/:id', async (req, res) => {
    const story = await Story.remove({_id: req.params.id})
    res.redirect('/dashboard')
})

//Add Comment
router.post('/comment/:id', async (req, res) => {
    const story = await Story.findOne({_id: req.params.id})
    const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
    }
    story.comments.unshift(newComment)
    await story.save()
    res.redirect(`/stories/show/${story.id}`)
})

module.exports = router;