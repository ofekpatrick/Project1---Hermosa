const express = require("express");
const app = express();
const bp = require("body-parser");
const db = require("mongoose");

const url =
    "mongodb+srv://ofekpatrick:Ofek1603@cluster0.0xgd5ga.mongodb.net/Project1";

db.connect(url)
    .then(() => {
    console.log("DB IS ON");
})
    .catch((err) => {
    if (err) throw err;
});

app.use(bp.urlencoded({extended:false}));
app.use(bp.json())
app.use(express.static("pages"))



app.get("/signin",(req,res)=>{
    res.sendFile(__dirname + "/pages/signin.html")
})

app.get("/signup",(req,res)=>{
    res.sendFile(__dirname + "/pages/signup.html")
})

app.get("/buy",(req,res)=>{
    res.sendFile(__dirname + "/pages/buy.html")
})

app.get("/all",(req,res)=>{
    if(req.query.admin == 'true'){
        res.sendFile(__dirname + "/pages/all.html")
    }else{
        res.status(400).send('Only Admin can access this page')
    }
})

app.get("/",(req,res)=>
{
    res.sendFile(__dirname + "/pages/index.html");
})

app.get("/categories",(req,res)=>
{
    res.sendFile(__dirname + "/pages/categories.html");
})

app.get("/womenCategory",(req,res)=>
{
    res.sendFile(__dirname + "/pages/womenCategory.html");
})

app.get("/menCategory",(req,res)=>
{
    res.sendFile(__dirname + "/pages/menCategory.html");
})

app.get("/kidsCategory",(req,res)=>
{
    res.sendFile(__dirname + "/pages/kidsCategory.html");
})

app.get("/product",(req,res)=>
{
    res.sendFile(__dirname + "/pages/productPage.html");
})

const accountSchema = db.Schema({
    name: String,
    birthDate: Date,
    email: String,
    address: String,
    password: String

})

const accountsList = db.model("accounts" , accountSchema);

const productSchema = db.Schema(
    {
        name: String,
        price: String,
        gender: String,
        description: String
    });
    
    const products = db.model("products", productSchema);



const productsArr = [

    {
        name: "3 in 60 kids pants package" ,
        price:"60₪",
        category: "kids",
        description: "3 cool pairs of pants in a discount"
    },

    {
        name: "4 in 400 kids shirt packge" ,
        price:"100₪",
        category: "kids",
        description: "4 cool shirts in a discount"
    },

    {
        name: "black pants" ,
        price:"50₪",
        category: "women",
        description: "Last winter's collection"
    },

    {
        name: "black top" ,
        price:"30₪",
        category: "women",
        description: "A hot strapless top"
    },

    {
        name: "green pants" ,
        price:"100₪",
        category: "women",
        description: "Green pants that will make you feel in the army again"
    },

    {
        name: "green shirt" ,
        price:"70₪",
        category: "men",
        description: "A solid original shirt with company logo"
    },

    {
        name: "short pants" ,
        price:"30₪",
        category: "kids",
        description: "one pair of short pants, not in a package"
    },

    {
        name: "hawaii shirt" ,
        price:"₪100",
        category: "men",
        description: "A shirt that will make the girls say aloha"
    },

    {
        name: "nude colored heels" ,
        price:"230₪",
        category: "women",
        description: "In case your men is tall"
    },

    {
        name: "classic jeans" ,
        price:"60₪",
        category: "kids",
        description: "The good old jeans"
    },

    {
        name: "grafity shirt" ,
        price:"90₪",
        category: "kids",
        description: "Dress your kid like a wall in Harlem"
    },

    {
        name: "Los Angeles shirt" ,
        price:"60₪",
        category: "men",
        description: "USA vibes shirt"
    },

    {
        name: "Green shirt women" ,
        price:"70₪",
        category: "women",
        description: "A classic green colored shirt for women"
    },

    {
        name: "Sport shoes" ,
        price:"300₪",
        category: "women",
        description: "Stay fashionable and sporty"
    },

    {
        name: "Tank top" ,
        price:"40₪",
        category: "women",
        description: "For the hot summer days of israel"
    },

    {
        name: "Summer shirt" ,
        price:"50₪",
        category: "kids",
        description: "For your next vacation"
    },

    {
        name: "Teva naot shoes" ,
        price:"400₪",
        category: "women",
        description: "The popular shoes in a comfortable price"
    },

    {
        name: "Soccer shoes" ,
        price:"500₪",
        category: "men",
        description: "Signed by Eitan Leiberman himself"
    },

    {
        name: "Elegant shoes" ,
        price:"600₪",
        category: "men",
        description: "For business men only, we will check your background"
    },

    {
        name: "White sneakers" ,
        price:"999.90₪",
        category: "men",
        description: "Orthopedic, comfortable, expensive"
    },

    {
        name: "White pants" ,
        price:"120₪",
        category: "men",
        description: "Watch where you sit"
    },

    {
        name: "Classic Jeans men" ,
        price:"180₪",
        category: "men",
        description: "Skinny jeans model"
    },

    {
        name: "Bermuda pants" ,
        price:"220₪",
        category: "men",
        description: "For the everyday worker"
    },

    {
        name: "White pants women" ,
        price:"140₪",
        category: "women",
        description: "Watch where you sit"
    },

    {
        name: "Allstar Shoes" ,
        price:"110₪",
        category: "kids",
        description: "The well known Converse fashion shoes"
    },

    {
        name: "White sandals" ,
        price:"130₪",
        category: "kids",
        description: "Elegant sandals for your next family event"
    },

    {
        name: "White Sport shoes" ,
        price:"100₪",
        category: "kids",
        description: "We can't promise it will stay white"
    },


]


const addProductToDB = async(temp) =>{
    await products.insertMany(temp);
}
addProductToDB(productsArr)

const orderSchema = db.Schema({
    email: String,
    address: String,
    productsArr: Array
})

const ordersList = db.model("Orders" , orderSchema);

// 

app.post('/signup', async (req, res) => {
    const { name, birthDate, email, address, password } = req.body;

    try {
    const existingAccount = await accountsList.findOne({ email });

    if (existingAccount) {
        return res.status(400).send('Email already exists');
    }

    const newAccount = {
        name,
        birthDate,
        email,
        address,
        password
    };

    await accountsList.insertMany([newAccount]);

    res.status(201).send('Account created successfully');
    } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const account = await accountsList.findOne({ email });
    if (!account) {
        res.send({ success: false, message: 'Email not found' });
        return;
    }
    const isMatch = account.password === password;
    if (!isMatch) {
        res.send({ success: false, message: 'Incorrect password' });
        return;
    }
    res.send({ success: true, message: 'Logged in successfully' });
    

});



app.post('/addOrder', async (req, res) => {
    const { email, productInfo } = req.body;

    try {
        const user = await accountsList.findOne({ email });
        const address = user ? user.address : "";


        await ordersList.insertMany({
        email: email,
        address: address,
        productsArr: productInfo
        });

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: "Failed to add the order to the database." });
    }
});

app.get("/getOrders", async (req, res) => {
        try {
            const orders = await ordersList.find();
            console.log(orders);
            res.json({ orders });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    });











app.listen(4000,()=>{console.log("Server is running on port 4000")});

