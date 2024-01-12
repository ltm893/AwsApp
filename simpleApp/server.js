 const express = require('express')
const app = express()
const port = 8080
//


app.get("/", (req, res) => {
  res.status(200).json({ title: "this is how we move" });

});
  
app.options('*', (req,res) => {
    res.send(200);
})

app.get("*", (req, res) => {
  console.log("Get Default")
  res.send("Default PAGE NOT FOUND");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})       
