const connect=require('./connection/db');
const auth=require('./routes/auth');
const notes=require('./routes/notes')

const express=require('express');
const app=express();
app.use(express.json());

app.use('/api/auth',auth);
app.use('/api',notes);

app.get('/',(req,res)=>{
    res.send('Hello');
});

connect();

app.listen(3000,()=>{
    console.log('server is runnig');
})