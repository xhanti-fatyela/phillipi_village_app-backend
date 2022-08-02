require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')


// let corsOptions = {
//     origin: "http://localhost:4200"
// }

app.use(cors())


app.set('port', process.env.PORT || 3200)  

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const db = require("./app/models")
const dbConfig = require("./app/config/db.config");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
      console.log("Connected To Database 'MongoDB'")
      initial()
  })
  .catch(err => {
      console.log("Cannot connect to the database", err);
      process.exit()
  })

  function initial(){
    Role.estimatedDocumentCount((err, count) => {
      if(!err && count === 0){
  
        new Role({
          name: "user"
        })
        .save(err => {
  
            if(err) {
  
              console.log("error", err);
            }
  
            console.log("added 'user' to roles collection");
  
  
        });
  
        new Role({
  
          name: "moderator"
        })
        .save(err => {
          if(err){
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role ({
          name: "admin"
        })
        .save(err => {
  
          if(err){
            console.log("error", err)
  
          }
  
          console.log("added 'admin' to roles collection");
        })
  
  
        
      }
    })
   }

  app.get('/', (req, res) => {
    res.send("<h2>Welcome to my backend app</h2>");
})

  require("./app/routes/programs.routes")(app)
  require('./app/routes/auth.routes')(app);
  require('./app/routes/user.routes')(app);




app.listen(app.get('port'), () => {
    console.info(`Server listen on port ${app.get('port')}`);
})