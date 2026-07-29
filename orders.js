import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function loadOrders() {

  const ordersContainer =
    document.getElementById("ordersContainer");


  ordersContainer.innerHTML = "";


  // Get orders from Firebase
  const querySnapshot =
    await getDocs(collection(db, "orders"));


  querySnapshot.forEach((doc) => {

    const order = doc.data();


    ordersContainer.innerHTML += `

      <div class="order-card">

        <img src="${order.image}"
             style="
               width: 100px;
               height: 100px;
               object-fit: cover;
               border-radius: 10px;
             ">

        <div class="order-info">

          <h3>${order.name}</h3>

          <p>Price: ₹ ${order.price}</p>

          <p>Order Status: ${order.status}</p>

        </div>

        <span class="order-status status-stitching">
          ${order.status}
        </span>

      </div>

    `;

  });

}


// Load orders
loadOrders();