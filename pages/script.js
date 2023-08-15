
const checkSignUp = () =>{
    let username = document.forms["details"]["name"].value;
    let birthDate = document.forms["details"]["birthDate"].value;
    let email = document.forms["details"]["email"].value;
    let address = document.forms["details"]["address"].value;
    let password = document.forms["details"]["password"].value;
    let confirmPass = document.forms["details"]["confirmPass"].value;

    // Validate username
    if (username.length < 2) {
        alert("Name is too short");
        return false;
    }

    // Calculate age from birthdate
    let age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age < 12) {
        alert("Minimum age for sign up is 12");
        return false;
    }

    // Validate email
    if (!email.includes("@")) {
        alert("Email has to contain @");
        return false;
    }

    // Validate address
    if (address.length == 0) {
        alert("Please state your home address");
        return false;
    }

    // Validate password
    if (password.length < 4 || password.length > 12) {
        alert("Password length needs to be between 4 and 12 characters");
        return false;
    }

    // Validate confirm password
    if (confirmPass !== password) {
        alert("Passwords don't match");
        return false;
    }

    // All validations passed
    return true;
}


async function checkSignIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (data.success) {
        location.href = "/"; // לעמוד בית!!
        sessionStorage.setItem("userEmail" , email)
    } else {
        alert(data.message);
    }
}

function redirectToCategoriesPage()
{
    location.href = 'categories.html';
}

function redirectToWomenCategoryPage()
{
    location.href = 'womenCategory.html';
}

function redirectToMenCategoryPage()
{
    location.href = 'menCategory.html';
}

function redirectToKidsCategoryPage()
{
    location.href = 'kidsCategory.html';
}



function addToCart (productId){
    let selectedProduct = document.getElementById("productsContainer").querySelector(`#${productId}`).textContent;
    sessionStorage.setItem(productId,selectedProduct);
    
}

function displayInCart (){
    let totalPrice = 0;
    Object.keys(sessionStorage).forEach(productKey => {
        if (productKey !== 'userEmail'){
            let productInfo = sessionStorage.getItem(productKey);
            let newDiv = document.createElement("div");
            newDiv.innerHTML = productInfo;
            let productsDiv = document.getElementById("container1").querySelector("#productsDiv");
            productsDiv.append(newDiv);
            // console.log(productInfo);
            parsedPrice = parseInt(productInfo.split("price:")[1].split(" ")[1].slice(0,-1));
            totalPrice += parsedPrice;
        }})
    const totalPriceDiv = document.getElementById("container1").querySelector("#totalPriceHeadline");
    totalPriceDiv.innerHTML += totalPrice;
}

function clickToSignOut (){
    sessionStorage.clear()

}


async function addInfoToDB() {
    const email = sessionStorage.getItem("userEmail");

    const productInfo = [];

    // Iterate over sessionStorage keys
    Object.keys(sessionStorage).forEach((key) => {
        if (key !== "userEmail") {
        const product = sessionStorage.getItem(key);
        productInfo.push(product);
    }
    });

    const response = await fetch('/addOrder', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        email: email,
        productInfo: productInfo
        })
    });

    const data = await response.json();

    if (data.success) {
        alert("Your order has been placed, you will be directed to the home page")
        clearCart()
        setTimeout(location.href = "/",3000); // Redirect to the home page
    } else {
        alert(data.message);
    }
}


async function displayOrders() {
    try {
        const response = await fetch('/getOrders');

        if (!response.ok) {
        throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        const container = document.getElementById('container2');

        data.orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const email = document.createElement('p');
        email.textContent = 'Email: ' + order.email;

        const address = document.createElement('p');
        address.textContent = 'Address: ' + order.address;

        const products = document.createElement('ul');
        order.productsArr.forEach(product => {
            const productItem = document.createElement('li');
            productItem.textContent = product;
            products.appendChild(productItem);
        });

        orderDiv.appendChild(email);
        orderDiv.appendChild(address);
        orderDiv.appendChild(products);

        container.appendChild(orderDiv);
        });
    } catch (error) {
        console.error(error);
    }
}

function clearCart (){
    let productsDiv = document.getElementById("container1").querySelector("#productsDiv")
    Object.keys(sessionStorage).forEach((key)=>{
        if(key !== "userEmail"){
            sessionStorage.removeItem(key);
        }
    })
    productsDiv.innerHTML = "Cart is Empty";
}
