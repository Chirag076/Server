import express from 'express';
const app= express();
app.get('/add',(req,res)=>{
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);
    const sum = a+b;
    res.send(sum.toString());
})
app.listen(8080,()=>{
    console.log("Server is running");
})