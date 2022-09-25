import pool from '../../bin/db.js';
import queries from './queries.js';
import parseUsers from './parser.js';

const getUsers = (req, res) => {
  pool.query(queries.getUsers, (error, rersults) => {
    if (error) throw error;
    const users = parseUsers(rersults.rows);
    res.status(200).json(users);
  });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  pool.query(queries.getUserById, [id], (error, results) => {
    if (error) throw error;
    const user = parseUsers(results.rows)[0];
    res.status(200).json(user);
  });
};

const addUser = (req, res) => {
  const {
    id, firstname, lastname, age, isfree, books,
  } = req.body;

  // check user
  pool.query(queries.checkUserId, [id], (error, results) => {
    if (error) throw error;
    if (results.rows.length) res.send('User already exists');

    // add user
    pool.query(queries.addNewUser, [id, firstname, lastname, age, isfree], (addUserError) => {
      if (addUserError) throw addUserError;

      // check books
      pool.query(queries.checkBooksIds(books), (checkBooksError, checkBooksResults) => {
        if (checkBooksError) throw checkBooksError;
        const existingBooksIds = checkBooksResults
          .rows
          .map((existingBook) => existingBook.id);

        const newBooks = books.filter((book) => !existingBooksIds.includes(book.id));

        // add new books
        if (newBooks.length) {
          pool.query(queries.addNewBooks(newBooks), (addBookError) => {
            if (addBookError) throw addBookError;

            // add user to books relations
            pool.query(queries.addNewRelations(id, books), (addNewRelationsError) => {
              if (addNewRelationsError) throw addNewRelationsError;
              res.status(200).send('user was added');
            });
          });
        } else {
          // add user to books relations
          pool.query(queries.addNewRelations(id, books), (addNewRelationsError) => {
            if (addNewRelationsError) throw addNewRelationsError;
            res.status(200).send('user was added');
          });
        }
      });
    });
  });
};

export default {
  getUsers,
  getUserById,
  addUser,
};
