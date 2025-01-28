const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to database");
},)

.catch((error) =>{
 console.log("could not connected to database" + error);
})