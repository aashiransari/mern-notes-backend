const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const Note = require('../models/noteModel');

//? NOTES ROUTES
//* FETCHING ALL NOTES OF A PARTICULAR USER
router.get('/', protect, async (req, res) => {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
})

//* CREATING A NOTE
router.post('/create', protect, async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
        res.status(400).json({
            message: "Please fill all the details"
        })
    } else {
        const note = new Note({ user: req.user._id, title, content, category });
        const createdNote = await note.save();

        res.status(201).json(createdNote);
    }
})

//* NOTE(FETCHING -- UPDATING -- DELETING -- BY ID)
router.get('/:id', protect, async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note) {
        res.json(note);
    } else {
        res.status(404).json({
            message: "Note not found"
        });
    }
}).put('/:id', protect, async (req, res) => {
    const { title, content, category } = req.body;

    const note = await Note.findById(req.params.id);

    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401).json({
            message: "You cannot perform this action"
        })
    }

    if (note) {
        note.title = title;
        note.content = content;
        note.category = category;

        const updatedNote = await note.save();
        res.json(updatedNote);
    } else {
        res.status(401).json({
            message: "Note not found"
        })
    }
}).delete('/:id', protect, async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401).json({
            message: "You cannot perform this action"
        })
    }

    if (note) {
        await note.remove();
        res.json({
            message: "Note deleted successfully"
        })
    } else {
        res.status(401).json({
            message: "Note not found"
        })
    }
})

module.exports = router;