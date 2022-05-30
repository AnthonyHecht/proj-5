//j'initialise ma classe
class Product {
    constructor(altTxt, colors, description, imageUrl, name, price, id) {
    this.altTxt = altTxt;
    this.colors = colors;
    this.description = description;
    this.imageUrl = imageUrl;
    this.name = name;
    this.price = price;
    this.id = id;
    }
}

//j'appel mon API
fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    //je rempli mon tableau products
    .then(function(values) {
        let products = [];
        //je parcours le retour de l'api pour créer mon tableau de products
        for(value of values ) {
            const product = new Product(value.altTxt, value.colors, value.description, value.imageUrl, value.name, value.price, value._id);
            products.push(product);
        }
        //je parcours mon tableau de products pour créer l'html de chaque produit
        for (let product of products) {
            document
                .getElementById("items")
                .innerHTML += `<a href="./product.html?id=${product.id}">
                <article>
                    <img src=${product.imageUrl} alt=${product.altTxt}>
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
              </a>`;
        };
        
    })
    .catch(function(err) {
        //erreur
    });