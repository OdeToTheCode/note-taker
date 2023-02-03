const router = require('express').Router();
const fs = require('fs')
const { v4 } = require('uuid')

// GET "/api/notes" responds with all notes from the database
router.get('/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    err && res.status(500)
    res.json(JSON.parse(data))
  })
});

// POST "/api/notes" adds a note to the database
router.post('/notes', (req, res) => {
  const notes = {...req.body, id: v4()}
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    err && res.status(500)
    const parsed = JSON.parse(data)
    parsed.push(notes)
    fs.writeFile('./db/db.json', JSON.stringify(parsed), err => {
      err && res.status(500)
      res.json(parsed)
    })
  })
});

// DELETE "/api/notes" deletes the note with an id equal to req.params.id
router.delete('/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    err && res.status(500)
    const parsed = JSON.parse(data)
    const notes = parsed.filter(dude => dude.id !== req.params.id)
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      err && res.status(500)
      res.json(notes)
    })
  })
})

// PUT "api/notes" updates a note with an id equal to req.params.id
router.put('/notes/:id', (req, res) => {
  const newNote = { ...req.body, id: v4() }
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    err && res.status(500)
    const parsed = data && JSON.parse(data)
    const newArray = parsed !== [] && parsed.map(note => note.id === req.params.id ? newNote : note)
    fs.writeFile('./db/db.json', JSON.stringify(newArray), err => {
      err && res.status(500)
      res.json(newArray)
    })
  })
});

module.exports = router;
