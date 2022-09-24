import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from users books rest api');
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
