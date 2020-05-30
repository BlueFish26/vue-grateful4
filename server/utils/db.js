const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    let connectionString =
      'mongodb://vue_user01:mevn123@ds145659.mlab.com:45659/vue_express';
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB: ${connectionString}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
