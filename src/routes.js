const {
    addBook,
    getAllBook,
    getDetailBook,
    editBook,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBook,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetailBook,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBook,
    },
];

module.exports = routes;
