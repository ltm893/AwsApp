const express = require('express')
const app = express()
const port = 8080

var cors = require('cors')
var corsOptions = {
  origin: ['https://dliv.com','http://localhost:3000'],
  optionsSuccessStatus: 200,
  methods: ['GET','POST','OPTIONS'],
  maxAge: 300,
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'] 
}

app.use(cors(corsOptions))

app.get("/", (req, res) => {
  res.status(200).send({ title: 'this is how we move' });

});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})       
