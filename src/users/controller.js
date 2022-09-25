import _ from 'lodash';
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
    if (results.rows.length === 0) res.send(`There no user with id ${id}`);
    const user = parseUsers(results.rows)[0];
    console.log(user);
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

const removeUser = (req, res) => {
  pool.query(queries.removeUser, [req.body.id], (error) => {
    if (error) throw error;
    res.status(200).send(`User ${req.body.firstname} ${req.body.lastname} was removed.`);
  });
};

const compareObjects = (obj1, obj2) => {
  const result = {};
  _.keys(obj2).forEach((key) => {
    if (obj1[key] !== obj2[key]) result[key] = obj2[key];
  });
  return result;
};

const updateUser = (req, res) => {
  pool.query(queries.getUserById, [req.body.id], (error, results) => {
    if (error) throw error;
    if (results.rows.length === 0) res.send('User does not exist in db.');

    const selectedUser = results.rows[0];

    const oldUser = {
      id: selectedUser.id,
      firstname: selectedUser.firstname,
      lastname: selectedUser.lastname,
      age: selectedUser.age,
      isfree: selectedUser.isfree,
    };

    const newUser = {
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age,
      isfree: req.body.isfree,
    };
    const fieldsToUpdate = compareObjects(oldUser, newUser);
    console.log(fieldsToUpdate);

    if (_.keys(fieldsToUpdate).length !== 0) {
      // update user
      pool.query(queries.updateUser(fieldsToUpdate, req.body.id), (updateUserError) => {
        if (updateUserError) throw updateUserError;

        // check books
        pool.query(queries.checkBooksIds(req.body.books), (checkBooksError, checkBooksResults) => {
          if (checkBooksError) throw checkBooksError;
          const existingBooksIds = checkBooksResults
            .rows
            .map((existingBook) => existingBook.id);

          const newBooks = req.body.books.filter((book) => !existingBooksIds.includes(book.id));

          // add new books
          if (newBooks.length) {
            pool.query(queries.addNewBooks(newBooks), (addBookError) => {
              if (addBookError) throw addBookError;

              // delete old relations
              pool.query(queries.removeRelations, [req.body.id], (deleteRelationsError) => {
                if (deleteRelationsError) throw deleteRelationsError;

                // add new relations
                pool.query(queries.addNewRelations(req.body.id, req.body.books), (addRelError) => {
                  if (addRelError) throw addRelError;
                  res.send('user was updated. New books were added.');
                });
              });
            });
          } else {
            // delete old relations
            pool.query(queries.removeRelations, [req.body.id], (delRelError) => {
              if (delRelError) throw delRelError;

              // add new relations
              pool.query(queries.addNewRelations(req.body.id, req.body.books), (addRelError) => {
                if (addRelError) throw addRelError;
                res.send('user was updated. There no new books in db.');
              });
            });
          }
        });
      });
    } else {
      console.log('changing only books');
      // check books
      pool.query(queries.checkBooksIds(req.body.books), (checkBooksError, checkBooksResults) => {
        if (checkBooksError) throw checkBooksError;
        const existingBooksIds = checkBooksResults
          .rows
          .map((existingBook) => existingBook.id);

        const newBooks = req.body.books.filter((book) => !existingBooksIds.includes(book.id));

        // add new books
        if (newBooks.length) {
          pool.query(queries.addNewBooks(newBooks), (addBookError) => {
            if (addBookError) throw addBookError;

            // delete old relations
            pool.query(queries.removeRelations, [req.body.id], (delRelError) => {
              if (delRelError) throw delRelError;

              // add new relations
              pool.query(queries.addNewRelations(req.body.id, req.body.books), (addRelError) => {
                if (addRelError) throw addRelError;
                res.send('user was updated. New books were added.');
              });
            });
          });
        } else {
          // delete old relations
          pool.query(queries.removeRelations, [req.body.id], (delRelError) => {
            if (delRelError) throw delRelError;

            // add new relations
            pool.query(queries.addNewRelations(req.body.id, req.body.books), (addRelError) => {
              if (addRelError) throw addRelError;
              res.send('user was updated. There no new books in db.');
            });
          });
        }
      });
    }
  });
};

export default {
  getUsers,
  getUserById,
  addUser,
  removeUser,
  updateUser,
};
