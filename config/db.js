const mongoose = require ('mongoose')
require("dotenv").config();
 const connectDb = async (DB_URL) => {

    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    
    })
    console.log('Database Connected Successfully')
  
   
  
}

module.exports = connectDb
