const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const cors = require('cors');

const corsOptions ={
    origin:"http://localhost:5173"

};

app.use(cors(corsOptions));

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});

///////////////////////////////////////////
require("./db");
require("./Models/User")
require("./Models/Community")

////////////////////////////

const athRoutes = require('./Routes/AuthRoutes');
app.use(athRoutes);


/////////////////////////////////////

app.use(express.json());
app.use(cors());




app.use ((error,req,res,next)=>{
    res.status(error.status || 500).json({error:error.message});
});

