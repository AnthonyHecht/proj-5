//je récup le contenu du localstorage
function getStorage () {
  let getCart = localStorage.getItem('myArray');
  getCart = JSON.parse(getCart);
  return getCart;
};


//fetch api
async function getProducts () {
  let array = [];  
  await fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            array = res.json();
        }
    })
    .catch(function(err) {
      //erreur
  });
  return array;
};
//corréspondance api/storage
async function correspondance () {
  let storage = await getStorage();
  let api = await getProducts();
  for (let product of storage ) {
    let found = api.find(apiProduct => product.id === apiProduct._id);
    return found;
  }
}
console.log(correspondance());

//fonction calcul
async function calculerTotal () {
  let totalQuantity = 0;
  let totalPrice = 0;
  let price = 0;
  let storage = getStorage();
  let api = await getProducts();
  for (let product of storage ) {
   let found = api.find(apiProduct => product.id === apiProduct._id && product.colorChoice === apiProduct.colors);
    price = found.price * product.number;
    totalQuantity += product.number;
    totalPrice += price;
  }
  document
  .getElementById("totalQuantity")
  .innerText = totalQuantity;
  document
  .getElementById("totalPrice")
  .innerText = totalPrice;
};

//je créer mes produits dans la page panier
for (let product of getStorage()) {
    document
      .getElementById("cart__items")
      .innerHTML += `<article class="cart__item" data-id=${product.id} data-color=${product.colorChoice}>
      <div class="cart__item__img">
        <img src=${product.imageUrl} alt=${product.altTxt}>
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${product.colorChoice}</p>
          <p>${product.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.number}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
};
calculerTotal ();

let itemQuantity = document.getElementsByClassName("itemQuantity");
let storageList = getStorage();

//modif quantité
for (let item of itemQuantity) {
  item.addEventListener("change", function() {
    let article = item.closest("article");
    for (let e of storageList) {
      if (e.id == article.dataset.id) {
        e.number = parseInt(item.value);
        localStorage.setItem('myArray', JSON.stringify(storageList));
        calculerTotal ();
      };
    };
  });
};