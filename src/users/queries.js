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

export default {
  getUsers,
  getUserById,
};
