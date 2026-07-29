let currentProduct = null;
import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Get product ID from URL
const params = new URLSearchParams(window.location.search);

const productId = params.get("id");



async function loadProduct() {

  // Get product from Firebase
  const productRef = doc(db, "products", productId);

  const productSnap = await getDoc(productRef);


  if (productSnap.exists()) {

    const product = productSnap.data();
    currentProduct = product;


    document.getElementById("productImage").src =
      product.image;

    document.getElementById("productName").innerText =
      product.name;

    document.getElementById("productPrice").innerText =
      "Price: ₹ " + product.price;

    document.getElementById("productDescription").innerText =
      product.description;

    document.getElementById("productCategory").innerText =
      product.category;

    document.getElementById("productSizes").innerText =
      product.sizes;

  }

}


// Load product
loadProduct();

// Place Order

const orderBtn = document.getElementById("placeOrderBtn");


orderBtn.addEventListener("click", async () => {

  if (!currentProduct) return;


  // Save order in Firebase
  await addDoc(collection(db, "orders"), {

    name: currentProduct.name,

    image: currentProduct.image,

    price: currentProduct.price,

    status: "Pending"

  });


  alert("Order Placed Successfully");

});

window.deleteProduct = async function(id) {

  const confirmDelete =
    confirm("Delete this product?");

  if (!confirmDelete) return;

  try {

    await deleteDoc(doc(db, "products", id));

    alert("Product deleted");

    loadProducts();

  } catch (error) {

    console.error(error);

  }

};