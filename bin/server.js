import express from 'express';
import usersRoutes from '../src/users/routes.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from users books rest api');
});

app.use('/api/users', usersRoutes);

app.listen(port, () => console.log(`app is listening on port ${port}`));
