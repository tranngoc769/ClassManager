var express = require('express');
var router = express.Router();

function asyncHandler(callbackFn) {
    return async(req, res, next) => {
        try {
            await callbackFn(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// get / - Home route should redirect to the /books route
router.get('/', asyncHandler(async(req, res) => {
    return res.redirect('/groups');
}));

// get /books - Redirects to /books/pages/1
router.get('/books', asyncHandler(async(req, res) => {
    res.redirect('/books/pages/1');
}));

// get /books/pages/pageNr - Show the requested pageNr from the full list
// of books and initialize pagination
router.get('/books/pages/:pageNr', asyncHandler(async(req, res) => {
    const books = await Book.findAll({
        order: [
            ["author", "ASC"]
        ]
    });
    // get page nr from url and check if it is within bounds
    const requestedPage = +req.params.pageNr;
    const nrOfPages = Math.max(1, getNrOfPages(books));
    if (isNaN(requestedPage) || requestedPage < 1 || requestedPage > nrOfPages) {
        res.redirect('/books/pages/1');
    } else {
        // render the page
        render_data.session = req.session;
        res.render('index.pug', {
            title: 'Books',
            books: getBooksForPage(books, requestedPage),
            nrOfPages,
            requestedPage
        });
    }
}));

// get /books/search/pageNr - show search results
router.get('/books/search/:pageNr', asyncHandler(async(req, res) => {
    const searchTag = req.query.searchValue;

    // Go to the default page if the search tag is empty
    if (searchTag === '') {
        res.redirect('/books');
    }
    // Perform the search on the database:
    const books = await Book.findAll({
        order: [
            ["author", "ASC"]
        ],
        where: {
            [Op.or]: [{
                    title: {
                        [Op.substring]: `${searchTag}`
                    }
                },
                {
                    author: {
                        [Op.substring]: `${searchTag}`
                    }
                },
                {
                    genre: {
                        [Op.substring]: `${searchTag}`
                    }
                },
                {
                    year: {
                        [Op.eq]: searchTag
                    }
                }
            ]
        }
    });
    // get page nr from url and check if it is within bounds
    const requestedPage = +req.params.pageNr;
    const nrOfPages = Math.max(1, getNrOfPages(books));
    if (isNaN(requestedPage) || requestedPage < 1 || requestedPage > nrOfPages) {
        // It isn't, redirect to the first page
        res.redirect(`/books/search/1?searchValue=${req.query.searchValue}`);
    } else {
        // It is, render the page
        render_data.session = req.session;
        res.render('index.pug', {
            title: 'Search Results',
            books: getBooksForPage(books, requestedPage),
            nrOfPages,
            requestedPage
        });
    }
}));

// get /books/new - Shows the create new book form
router.get('/books/new', asyncHandler(async(req, res) => {
    render_data.session = req.session;
    res.render('new-book.pug', { title: 'New Book' });
}));

// post /books/new - Posts a new book to the database
router.post('/books/new', asyncHandler(async(req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        if (error.name === "SequelizeValidationError") { // checking the error
            book = await Book.build(req.body);
            render_data.session = req.session;
            res.render('new-book.pug', { title: "New Book", errors: error.errors });
        } else {
            throw error; // error caught in the asyncHandler's catch block
        }
    }
}));

// get /books/:id - Shows book detail form
router.get('/books/:id', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        render_data.session = req.session;
        res.render('update-book.pug', { title: book.title, book });
    } else {
        const error = new Error('The book you are looking for does not exist.🤷‍♂️');
        error.status = 404; // http 404 == not found
        throw error; // let the error handler below handle it further    
    }
}));

// post /books/:id - Updates book info in the database
router.post('/books/:id', asyncHandler(async(req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books');
        } else {
            const error = new Error('The book you are trying to update does not exist anymore.🤷‍♂️');
            error.status = 404; // http 404 == not found
            throw error; // let the error handler below handle it further    
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") { // checking the error
            book = await Book.build(req.body);
            book.id = req.params.id; // make sure correct book gets updated
            render_data.session = req.session;
            res.render('update-book.pug', {
                title: book.title,
                book,
                errors: error.errors
            })
        } else {
            throw error; // error caught in the asyncHandler's catch block
        }
    }
}));

// post /books/:id/delete - Deletes a book
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        const error = new Error('The book you are trying to delete was already deleted.🤷‍♂️');
        error.status = 404; // http 404 == not found
        throw error; // let the error handler below handle it further    
    }
}));

module.exports = router;