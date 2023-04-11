const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser")
const session = require("express-session")
const mongoose  = require("mongoose")
const authRoute = require("./routes/auth")
const receptiRoute = require("./routes/recepti");
const imgRoute = require("./routes/imgUpload");
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const userRoute = require("./routes/user");




const app = express()
const port = 3000


app.use(cookieParser());



app.use(cors({
  credentials: true,
  origin: 'https://web-app-frontend.onrender.com'
}));


app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }));


const dbUri = 'mongodb+srv://Loris:L123456789@webapps-test.aascveo.mongodb.net/?retryWrites=true&w=majority'

mongoose
.connect(dbUri,{ useNewUrlParser: true, useUnifiedTopology: true, dbName: 'Foodie'})
.then(() => console.log("Connected"))
.catch((err) => console.log(err))






app.use("/api/auth",authRoute)
app.use("/api/recipes", receptiRoute)
app.use("/api/users", userRoute)
app.use("/api/recipes", imgRoute)



app.listen(port, () => console.log(`Working on port ${port}`))