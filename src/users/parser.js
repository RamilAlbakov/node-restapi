import _ from 'lodash';

const parseUserAndBook = (selectedUser) => {
  const user = {};
  const book = {};

  _.toPairs(selectedUser).forEach(([key, value]) => {
    if (key.includes('book_')) {
      const bookKey = key.slice('book_'.length);
      if (value !== null) {
        book[bookKey] = value;
      }
    } else {
      user[key] = value;
    }
  });

  return [user, book];
};

const addBook = (user, book) => {
  if (_.keys(book).length !== 0) {
    user.books.push(book);
  }
};

const parseUsers = (selectedUsers) => {
  const users = {};

  selectedUsers.forEach((selectedUser) => {
    const [user, book] = parseUserAndBook(selectedUser);
    const userId = user.id;

    if (_.has(users, userId)) {
      addBook(users[userId], book);
    } else {
      users[userId] = { ...user, books: [] };
      addBook(users[userId], book);
    }
  });

  return _.values(users);
};

export default parseUsers;
