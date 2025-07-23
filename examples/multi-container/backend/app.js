const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req, res) => {
  res.json({ message: "Hola desde el backend" });
});

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
