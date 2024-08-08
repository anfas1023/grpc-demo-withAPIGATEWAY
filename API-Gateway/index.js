const express=require('express')
const app=express();
const {requiresAuth}=require("./auth");
const userRoutes =require("./user")
const PORT=5001;
app.use(express.json())
// app.use(requiresAuth)
app.use("/user",userRoutes)
app.use("/post",postRoutes)

app.listen(PORT,()=>{
    console.log(`server listen ${PORT}`);
})