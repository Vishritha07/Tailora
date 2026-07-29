import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function loadUserProducts() {

  const productsContainer = document.getElementById("userProducts");

  productsContainer.innerHTML = "";


  // Get products from Firebase
  const querySnapshot = await getDocs(collection(db, "products"));


  querySnapshot.forEach((doc) => {

    const product = doc.data();


    productsContainer.innerHTML += `

      <div class="product-card">

        <img src="${product.image}"
             style="
               width: 100%;
               height: 250px;
               object-fit: cover;
             ">

        <div class="product-info">

          <h3 class="product-name">
            ${product.name}
          </h3>

          <p class="product-price">
            Price: ₹ ${product.price}
          </p>

          <div class="btn-group">

            <a href="product.html?id=${doc.id}"
               class="btn btn-primary btn-sm">
               Buy
            </a>

            <a href="customization.html"
               class="btn btn-secondary btn-sm">
               Customization
            </a>

          </div>

        </div>

      </div>

    `;

  });

}


// Load products
loadUserProducts();