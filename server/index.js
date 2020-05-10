const express = require('express');
const cors = require('cors');
const SentimentPredictor = require('./utils/tensorflow/SentimentPredictor');
const { HOSTED_URLS } = require('./utils/tensorflow');

const connectDatabase = require('./utils/db');

const app = express();

connectDatabase();

app.use(express.json({ extended: false }));
app.use(cors());

const commentRoutes = require('./routes/api/posts');
app.use('/api/posts', commentRoutes);

//handle production settings
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public'));
  //SPA page (any route)
  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname, '/public/index.html');
  });
}

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  let predictor = new SentimentPredictor();
  await predictor.init(HOSTED_URLS);
  global.predictor = predictor;
  console.log(`Server listening on port ${port}`);
});
