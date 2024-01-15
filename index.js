const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express(); 
app.set('view engine', 'ejs'); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Connect to MongoDB
mongoose.connect(process.env.DBURL,
    { useNewUrlParser: true, 
      useUnifiedTopology: true 
     
    })
    
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Error connecting to MongoDB:', err));
// Define a book listing schema
const bookSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  price: Number,

});

// Create a book listing model
const Book = mongoose.model('Book', bookSchema);

// Render the homepage with all book listings
app.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('index', { books });
  } catch (err) {
    console.error('Failed to fetch book listings:', err);
    res.status(500).send('Failed to fetch book listings');
  }
});

// Render the page to create a new book listing
app.get('/books/new', (req, res) => {
  res.render('newpost');
});

// Handle creation of a new book listing
app.post('/books', async (req, res) => {
  try {
    const { title, content, author, price  } = req.body;
    const book = new Book({ title, content, author, price });
    await book.save();
    res.redirect('/');
  } catch (err) {
    console.error('Failed to create book listing:', err);
    res.status(500).send('Failed to create book listing');
  }
});

// Render a single book listing
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('show', { book });
  } catch (err) {
    console.error('Failed to fetch book listing:', err);
    res.status(500).send('Failed to fetch book listing');
  }
});

// Render the page to edit a book listing
app.get('/books/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('edit', { book });
  } catch (err) {
    console.error('Failed to fetch book listing:', err);
    res.status(500).send('Failed to fetch book listing');
  }
});

// Handle updating a book listing
app.put('/books/:id', async (req, res) => {
  try {
    const { title,content , author, price } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { title, content, author, price });
    res.redirect(`/books/${req.params.id}`);
  } catch (err) {
    console.error('Failed to update book listing:', err);
    res.status(500).send('Failed to update book listing');
  }
});

// Handle deleting a book listing
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error('Failed to delete book listing:', err);
    res.status(500).send('Failed to delete book listing');
  }
});

// // Start the server
 app.listen(3000, () => {
     console.log('Server started on port 3000');
 });
;