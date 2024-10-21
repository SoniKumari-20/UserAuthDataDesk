const express = require("express")
const app = express()
const cors = require("cors")
const jwtKey = "user-auth"
const jwt = require("jsonwebtoken")
const Product = require("./DB/Product.js")
require("./DB/config")
const User = require("./DB/users.js")
app.use(cors())
app.use(express.json())
app.post("/register", async(req, res)=>{
    let result = new User(req.body) 
    let user = await result.save()
    // res.send(user)
    if(user){
        jwt.sign({user}, jwtKey, (err, token)=>{
           if(err){
            res.send({user : "enter valid token"})
           }else{
            res.send({user, auth: token})
           }
        }) 
        // res.send(user)
    }else{
        res.send({user : "User not found" })
    }
})


app.post("/login", async  (req, res)=>{
    let result = await User.findOne(req.body)
    // res.send(result)
    // console.log("result", req.body)
    if(result){
        jwt.sign({result}, jwtKey, (err, token)=>{
           if(err){
            res.send({result : "enter valid token"})
           }else{
            res.send({result, auth: token})
           }
        }) 
        // res.send(result)
    }else{
        res.send({result : "User not found" })
    }
})

app.post("/products",verifyToken, async(req, res)=>{
   let product = new Product(req.body)
   let result = await product.save()
   res.send(result)
})

app.get("/productList", async(req, res)=>{
    let result = await Product.find()
    if(result.length > 0 ){
        res.send(result)
    }else{
        res.send({result: "Product not found"})
    }
    // console.log(result)
})
 
app.delete("/products/:id",verifyToken, async(req, res)=>{
    let result = await Product.deleteOne({_id:req.params.id})
    res.send(result)
})
 
app.get("/product/:id", verifyToken,async(req,res)=>{
    let result = await Product.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }else{
        res.send({result : "no data found"})
    }
}
)
app.put("/product/:id", verifyToken,async(req, res)=>{
    let result = await Product.updateOne(
        {_id : req.params.id},
        {$set : req.body}
    )
    res.send(result)
}) 

app.get("/search/:key", async(req, res)=>{
    let result = await Product.find({
        "$or" : [
            { productName : {$regex : req.params.key}},
            { price: {$regex  : req.params.key}},
            { company: {$regex  : req.params.key}},
            { color: {$regex  : req.params.key}},
            { size: {$regex  : req.params.key}}
        ]
    })
    res.send(result)
}
)

function verifyToken(req, res, next){
//    console.log("hello")
   let token = req.headers["authorization"]
   if(token){
    token = token.split(' ')[1]
    jwt.verify(token, jwtKey, (err, valid)=>{
        if(err){
            res.status(401).send("provide valid token")
        }else{
            next()
        }
    })
   }else{
    res.status(401).send("provide token to access all the links")
   }
}
// console.log(verifyToken)
app.listen(5000)