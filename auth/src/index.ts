import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('Hi, there!');
});

app.post('/api/users/signup', (req, res) => {
  const { email, password } = req.body;
});

app.post('/api/users/signin', (req, res) => {
  const { email, password } = req.body;
});

app.post('/api/users/signout', (req, res) => {});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
