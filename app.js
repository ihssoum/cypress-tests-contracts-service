const express = require('express');
const contractController = require('./controllers/contractController');
const app = express();

app.get('/contract', contractController.getContract);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
