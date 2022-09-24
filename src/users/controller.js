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

export default {
  getUsers,
  getUserById,
};
