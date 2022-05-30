//je récup le localstorage
function getStorage () {
    let getCart = localStorage.getItem('myArray');
    getCart = JSON.parse(getCart);
    return getCart;
  };
let storageList = getStorage();
//je récup la liste de produit de l'api
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

//je fais corrépondre les produits du localstorage avec ceux de l'api

async function correspondance () {
    let productList = [];
    let storage = await getStorage();
    let api = await getProducts();
    for (let product of storage ) {
      let found = api.find(apiProduct => product.id === apiProduct._id);
      let merged = {...product, ...found};
      productList.push(merged);
    }
    return productList;
};

//fonction de calcul des prix+quantité
async function calculTotal() {
  let productList = await correspondance();
  let totalQuantity = 0;
  let price = 0;
  let totalPrice = 0;
  
  for (let product of productList) {
    totalQuantity += product.number;
    price = product.price * product.number;
    totalPrice += price;
  }
  document.getElementById("totalQuantity").innerText = totalQuantity;
  document.getElementById("totalPrice").innerText = totalPrice;
};
calculTotal();

//fonctions modif delete
function modifQtt() {
  let qtt = document.querySelectorAll(".itemQuantity");
  for (let i=0; i < qtt.length; i++){
    qtt[i].addEventListener("change", (event) => {
      event.preventDefault();

      storageList[i].number = qtt[i].valueAsNumber;

      localStorage.setItem("myArray", JSON.stringify(storageList));
      calculTotal();
    });
  };
  
};

/* function supprimer() {
  let supr = document.querySelectorAll(".deleteItem");
  for(let i=0; i < supr.length; i++) {
    supr[i].addEventListener("click", (event) => {
      event.preventDefault();

      let deleteId = storageList[i].id;
      let deleteColor = storageList[i].colorChoice;
    
      storageList = storageList.filter( elt => elt.id !== deleteId || elt.colorChoice !== deleteColor);
      localStorage.setItem('myArray', JSON.stringify(storageList));
    
      alert('Votre article a bien été supprimé.');
    
      if (storageList.length === 0) {
        localStorage.clear();
      };
      location.reload();      
    });
  };
};
 */

function suppr(id, color, target) {
  storageList = storageList.filter( elt => !(elt.id == id && elt.colorChoice == color))
  localStorage.setItem('myArray', JSON.stringify(storageList));
  target.closest('section').innerHTML = '';
  alert('Votre article a bien été supprimé.');  
  if (storageList.length === 0) {
    localStorage.clear();
  };
  calculTotal();
};

//je créer mes produits dans la page panier
async function createHtml() {
  /* let productList = await correspondance();
  for (let product of productList) {
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
            <p class="ici">${product.price}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.number}" onchange="modifQuantity('${product.id}','${product.colorChoice}','${this.value}')">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem" onclick="suppr('${product.id}','${product.colorChoice}')">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
  };
  modifQtt(); */
  storageList = await correspondance();
  console.log(storageList);

  for (let i=0; i < storageList.length; i++) {

    let productArticle = document.createElement("article");
    document.querySelector("#cart__items").appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute("data-id", storageList[i].id);

    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";

    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = storageList[i].imageUrl;
    productImg.alt = storageList[i].altTxt;
    
    let productItemContent = document.createElement("div");
    productArticle.appendChild(productItemContent);
    productItemContent.className = "cart__item__content";

    let productItemContentDescription = document.createElement("div");
    productItemContent.appendChild(productItemContentDescription);
    productItemContentDescription.className = "cart__item__content__description";
    
    let productTitle = document.createElement("h2");
    productItemContentDescription.appendChild(productTitle);
    productTitle.innerHTML = storageList[i].name;

    let productColor = document.createElement("p");
    productTitle.appendChild(productColor);
    productColor.innerHTML = storageList[i].colorChoice;
    productColor.style.fontSize = "20px";

    let productPrice = document.createElement("p");
    productItemContentDescription.appendChild(productPrice);
    productPrice.innerHTML = storageList[i].price + " €";

    let productItemContentSettings = document.createElement("div");
    productItemContent.appendChild(productItemContentSettings);
    productItemContentSettings.className = "cart__item__content__settings";

    let productItemContentSettingsQuantity = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsQuantity);
    productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
    
    let productQty = document.createElement("p");
    productItemContentSettingsQuantity.appendChild(productQty);
    productQty.innerHTML = "Qté : ";

    let productQuantity = document.createElement("input");
    productItemContentSettingsQuantity.appendChild(productQuantity);
    productQuantity.value = storageList[i].number;
    productQuantity.className = "itemQuantity";
    productQuantity.setAttribute("type", "number");
    productQuantity.setAttribute("min", "1");
    productQuantity.setAttribute("max", "100");
    productQuantity.setAttribute("name", "itemQuantity");

    let productItemContentSettingsDelete = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsDelete);
    productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

    let productSupprimer = document.createElement("p");
    productItemContentSettingsDelete.appendChild(productSupprimer);
    productSupprimer.className = "deleteItem";
    productSupprimer.innerHTML = "Supprimer";
    productSupprimer.addEventListener("click", (e) => {
      e.preventDefault;

      let id = storageList[i].id;
      let color = storageList[i].colorChoice;
      let target = productSupprimer;
      suppr(id, color, target);   
      location.reload();   
    });
    
  }
  modifQtt();
};
createHtml();

//fonction formulaire
function form() {
  
  const order = document.getElementById("order");

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const email = document.getElementById("email");

  //liste messages d'erreur
  const validError = {
    firstNameErrorMsg: "erreur 1",
    lastNameErrorMsg: "erreur 2",
    addressErrorMsg: "erreur 3",
    cityErrorMsg: "erreur 4",
    emailErrorMsg: "erreur 5",
  }

  //regex
  let nameRegex = new RegExp("^[a-zA-Z ,.'-]+$");
  let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
  let addressRegex = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

  
  order.addEventListener("click", (e) => {
    e.preventDefault();

    const form = document.querySelectorAll(".cart__order__form_question");

    for (i = 0; i < form.length; i++) {
      const formInput = form[i].getElementsByTagName("input").item(0);
      const textInput = formInput.value;

      let formErrorMsgP = form[i].getElementsByTagName("p").item(0);
      const cle = formErrorMsgP.attributes["id"].value;
      const inputType = formInput.attributes['type'].value;
      if (inputType == 'text') {
        if (!nameRegex.test(textInput)) {
          const message = validError[cle];
          formErrorMsgP.textContent = message;
          return;
        } else {
          formErrorMsgP.textContent = "";
        }
      } else if (inputType == "email" ) {
        if (!emailRegex.test(textInput)) {
          const message = validError[cle];
          formErrorMsgP.textContent = message;
          return;
        } else {
          formErrorMsgP.textContent = "";
        }
      }
    }
    //création de l'object à envoyer dans l'API
    
    if(storageList) {
      const order = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: storageList.map(ele => ele.id),
      };
      postForm(order);
    } else {
      alert("panier vide");
    };
    
  })
};
form();

//envoie du formulaire
function postForm(order) {

    const sendForm = {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'content-type': 'application/json',
      }
    };

    fetch("http://localhost:3000/api/products/order", sendForm)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('orderId', data.orderId);
        document.location.href = 'confirmation.html?id='+ data.orderId;
      });
};


