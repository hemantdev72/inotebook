const mongoose=require('mongoose');

const connect=()=>{
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/notebook');
    
        console.log('Connected to MongoDB');
        return {
          success: true,
          message: 'Connected to MongoDB',
        };
      } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        return {
          success: false,
          message: 'Error connecting to MongoDB',
          error: error.message,
        };
}}

module.exports=connect;