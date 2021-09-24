const express = require('express');

const app = express();
const port = 9000;

app.get('/',(req,res)=>{
    console.log('At get empty request');
    // business logic
    res.json({
        msg: 'hello empty get',
        status: 200
    })
})

app.listen(port,  (req, res)=> {
    console.log("hello world");
    console.log("press");
})
