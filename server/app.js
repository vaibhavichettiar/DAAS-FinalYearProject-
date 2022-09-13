const express = require('express');
const app = express()
app.use('/auth', require('./Auth/AuthRouter.js'));
app.get('/',(req,res)=>res.send('hello world!!!!!!!'));
app.listen(5001,()=>{
    console.log('my server is running on port 5001');
})