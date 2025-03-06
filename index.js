const express = require("express")
const mongoose = require("mongoose")
const app = express()
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'randomraushansecret@123'
const {UserModel, TodoModel} = require('./db')

mongoose.connect('mongodb+srv://kumarraushan2615:Raushan8100.@cluster0.zuwxq.mongodb.net/my-todos')

app.use(express.json())

app.post("/signup", async function(req,res){
    const email= req.body.email
    const password = req.body.password
    const name = req.body.name

  await UserModel.create({
        email: email,
        password: password,
        name: name
    })

    res.json({
        message: "you are logged in"
    })

})

app.post("/signin", async function(req, res){
    const email =  req.body.email
    const password = req.body.password

    const user = await UserModel.findOne( {
        email: email,
        password: password
    })

    if(user){
        const token = jwt.sign({
            id: user._id.toString()
        },JWT_SECRET)

        res.json({
            token: token
        })
    }
    else {
        res.json({
            message: "invalid crendentials"
        })
    }
})

app.get("/todos",auth , function(req,res){
    const userId = req.userId
    res.json({
        userId: userId
    })
    
})

app.post("/todos", auth ,function(req,res){
    const userId = req.userId
    res.json({
        userId: userId
})
})
 

function auth(req,res,next){
    const token = req.headers.token
    const decodedtoken = token.verify(token, JWT_SECRET)

    if(decodedtoken) {
        req.userId = decodedtoken.id
        next();
    }
    
    else 
    {
        res.json({
            message: "invalid crendentials"
        })
    }

}

app.listen(3000);