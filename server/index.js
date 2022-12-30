import express from "express";
import fetch from 'node-fetch';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { keepAlive } from "./keepAlive.js";
import User from "./models/User.js"
import Post from "./models/Post.js"
import { users, posts } from "./data/index.js";


/* Configurations */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")))
/* Get rid of "cannot get /" error */
// app.get('/', (req, res) => {
//     res.send('This Magic Thing is working!!!');
// })
app.use("/", express.static(path.join(__dirname, "public")))

// keep app alive
app.get("/keep-alive", keepAlive)


/* File Storage */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })


/* Routes with files  */
app.post("/auth/register", upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)


/* Routes */
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)


/* Mongoose setup  */
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server runs on Port: ${PORT}`))

    /* Control point fully working backend */
    /* add data one time */
    // User.insertMany(users)
    // Post.insertMany(posts)
}).catch((error) => console.log(`${error} did not connect`))


// it works
// do not forget install import fetch from 'node-fetch';
// npm i node-fetch to package.json
// const response = await fetch('https://render-back-end-nikky-pedia.onrender.com/')
// const body = await response.text()
// console.log(body)

// const interval = setInterval(async () => {
//     try {
//         const response = await fetch('https://render-back-end-nikky-pedia.onrender.com/')
//         // const body = await response.text();
//         console.log(response.ok)
//         console.log(response.status)
//         // console.log(body)
//     } catch (error) {
//         console.log(error)
//     }
// }, 3000);