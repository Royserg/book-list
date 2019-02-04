const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// allow cross-origin requests
app.use(cors());

/* connect to database on mlab */
mongoose.connect('mongodb://primary:pass123@ds147052.mlab.com:47052/gql-first');
mongoose.connection.once('open', () => (
  console.log('Connected to db')
));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000 ;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})