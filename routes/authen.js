var express = require('express');
var router = express.Router();
const md5 = require("md5");
const { Op } = require('sequelize');
const Users = require('../models').Users;

function auth(req, res, next) {
    const nonSecurePaths = ['/signin', '/login'];
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.session.loggedin != true && (req.session.username == "" || req.session.username == undefined)) {
        res.redirect('/signin');
        return
    }
    next()
}

function admin_auth(req, res, next) {
    const nonSecurePaths = ['/signin', '/login'];
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.session.loggedin != true && (req.session.username == "" || req.session.username == undefined)) {
        return res.send({ "code": 403, "msg": "không thể xác thực" })
        return
    }
    next()
}


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


router.get('*', auth);
router.post('*', admin_auth);
// get / - Home route should redirect to the /books route
router.get('/signin', async(req, res) => {
    if (req.session.loggedin == true && (req.session.username != "" && req.session.username != undefined)) {
        res.redirect('/');
        return
    }
    res.render('login');
});
// get /books - Redirects to /books/pages/1
router.post('/signin', async(req, res) => {
    if (req.session.loggedin == true && (req.session.username != "" && req.session.username != undefined)) {
        res.redirect('/');
        return
    }
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {

    }
    let username = json.username;
    let password = json.password;
    // 
    if (username == "" || password == "" || username == undefined || password == undefined) {
        return res.send({ "code": 403, "msg": "missed username, password" })
    }
    // 
    let mdpass = md5(password);
    const user = await Users.findOne({ where: { username: username, "password": mdpass } });
    if (user === null) {
        return res.send({ "code": 403, "msg": "Không tồn tại tài khoản" })
    }
    req.session.loggedin = true;
    req.session.username = username;
    req.session.role = user.role;
    return res.send({ "code": 200, "msg": "Đăng nhập thành công" })

});
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