const id = new URL(window.location.href).searchParams.get("id");

document
    .getElementById("orderId")
    .innerHTML = id;

localStorage.clear();