//je recupere l'url puis l'id de mon produit
let str = window.location.href;

let url = new URL(str);

let search_params = new URLSearchParams(url.search);

let id = search_params.get('id');

//j'initialise ma classe
class Product {
    constructor(altTxt, colors, description, imageUrl, name, price, id, number, colorChoice) {
    this.altTxt = altTxt;
    this.colors = colors;
    this.description = description;
    this.imageUrl = imageUrl;
    this.name = name;
    this.price = price;
    this.id = id;
    this.number = number;
    this.colorChoice = colorChoice;
    }
}

class StorageProduct {
    constructor(id, number, colorChoice) {
        this.id = id;
        this.number = number;
        this.colorChoice = colorChoice;
    }
}

fetch(`http://localhost:3000/api/products/${id}`)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        const product = new Product(value.altTxt, value.colors, value.description, value.imageUrl, value.name, value.price, value._id);
        let img = document.querySelector(".item__img img")
            img.src = product.imageUrl;
            img.alt = product.altTxt;
        document
            .getElementById("title")
            .innerText = product.name;
        document
            .getElementById("price")
            .innerText = product.price;
        document
            .getElementById("description")
            .innerText = product.description;
        for (let color of product.colors) {
                let option = document.createElement("option")
                option.setAttribute("value", color)
                option.innerText = color;
                let colors = document.getElementById("colors")
                colors.appendChild(option);
        };
    })
    .catch(function(err) {
        //erreur
    });

fetch(`http://localhost:3000/api/products/${id}`)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        document
            .getElementById("addToCart")
            .addEventListener('click', function() {
                //recup des valeurs saisies
                let number = parseInt(document.getElementById("quantity").value);
                let colorChoice = document.getElementById("colors").value;
                const newProduct = new StorageProduct(id, number, colorChoice);
                //on récup ce qui existe dans le localstorage
                let checkLocal = localStorage.getItem('myArray');
                //j'init productList en tableau vide pour pouvoir travailler dessus
                let productList = [];
                if (checkLocal != null) {
                    productList = JSON.parse(checkLocal);
                };
                //find pour faire correspondre le produit au localstorage
                if (number == 0 || colorChoice == 0) {
                    alert("erreur");
                } else { 
                let found = productList.find(product => (newProduct.id == product.id && newProduct.colorChoice == product.colorChoice));
                if (found) {
                    found.number += newProduct.number;
                } else {
                    productList.push(newProduct);
                }        
                localStorage.setItem('myArray', JSON.stringify(productList));
            }
            });
    })
    .catch(function(err) {
        //erreur
    });