const express = require('express');

const server = express();

server.use(express.json());

const projeto = ['projeto top', 'top projects','nothing'];

server.get('/projeto/:index'), (req, res) => {
const { index } = req.params;

return res.json(projeto[index]);
}

server.listen(3333);
