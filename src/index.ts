import express from 'express';

const app = express();

const port = Number(process.env.PORT ?? 8000);
const host = process.env.HOST ?? '127.0.0.1';

app.get('/', (req, res) => {
  res.send('Hello from Babylone, Corentin and Aurora!');
});

app.listen(port, host, () => {
  console.log(`listening on http://${host}:${port}`);
});
