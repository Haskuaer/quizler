const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send("views/index.ejs");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
