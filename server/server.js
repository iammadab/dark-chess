import path from 'path';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./server/public/index.html'));
});

app.use('/zkapp', express.static(path.resolve('./zkapp/build/zkapp/src')));

app.listen(3000, () => {
  console.log('Application listening at port 3000');
});
