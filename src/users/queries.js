const getUsers = `
  SELECT
    u.id,
    u.firstname,
    u.lastname,
    u.age,
    u.isfree,
    u.createdat,
    u.updatedat,
    b.id as book_id,
    b.title as book_title,
    b.author as book_author,
    b.createdat as book_createdat
  FROM users u
  LEFT JOIN users_books ub
    ON u.id = ub.user_id
  LEFT JOIN books b
    ON ub.book_id = b.id;
`;

const semicolonIndex = -2;
const getUserById = `${getUsers.slice(0, semicolonIndex)} WHERE u.id = $1;`;

const checkUserId = 'SELECT * FROM users WHERE id = $1;';

const checkBooksIds = (books) => {
  const bookIds = books
    .map((book) => `id = ${book.id}`)
    .join(' or ');

  return `SELECT * FROM books WHERE ${bookIds}`;
};

const addNewUser = 'INSERT INTO users (id, firstname, lastname, age, isfree) VALUES ($1, $2, $3, $4, $5)';

const addNewBooks = (newBooks) => {
  const values = newBooks
    .map((newBook) => `(${newBook.id}, '${newBook.title}', '${newBook.author}')`)
    .join(', ');

  console.log(values);

  return `INSERT INTO books (id, title, author) VALUES ${values};`;
};

const addNewRelations = (userId, books) => {
  const values = books
    .map((book) => `(${userId}, ${book.id})`)
    .join(', ');

  return `INSERT INTO users_books (user_id, book_id) VALUES ${values};`;
};

export default {
  getUsers,
  getUserById,
  checkUserId,
  checkBooksIds,
  addNewUser,
  addNewBooks,
  addNewRelations,
};
