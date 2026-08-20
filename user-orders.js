import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const ordersList =
  document.getElementById("ordersList");


async function loadOrders() {

  if (!ordersList) return;

  ordersList.innerHTML = "";


  /* =========================
     READY-MADE ORDERS
  ========================= */

  const ordersSnapshot =
    await getDocs(
      collection(db, "orders")
    );


  ordersSnapshot.forEach((docItem) => {

    const order =
      docItem.data();


    const image =
      order.referenceImage ||
      order.image ||
      "";


    const imageSection = image

      ? `
        <img
          src="${image}"
          style="
            width:120px;
            height:120px;
            object-fit:cover;
            border-radius:12px;
          "
        >
      `

      : `
        <div class="image-placeholder">
          No Image
        </div>
      `;


    ordersList.innerHTML += `

      <div class="order-card">

        ${imageSection}

        <div class="order-info">

          <h3>
            ${order.name || "Product"}
          </h3>

          <p>
            ${order.type || "Ready-Made"}
          </p>

          <p>
            Status:
            <strong>
              ${order.status || "Pending"}
            </strong>
          </p>

          <p>
            Fabric:
            ${order.fabric || "Not Selected"}
          </p>

        </div>

      </div>

    `;

  });


  /* =========================
     CUSTOMIZATION ORDERS
  ========================= */

  const customSnapshot =
    await getDocs(
      collection(db, "customOrders")
    );


  customSnapshot.forEach((docItem) => {

    const order =
      docItem.data();


    const image =
      order.referenceImage ||
      order.image ||
      "";


    const customImage = image

      ? `
        <img
          src="${image}"
          style="
            width:120px;
            height:120px;
            object-fit:cover;
            border-radius:12px;
          "
        >
      `

      : `
        <div class="image-placeholder">
          Custom
        </div>
      `;


    ordersList.innerHTML += `

      <div class="order-card">

        ${customImage}

        <div class="order-info">

          <h3>
            ${order.name || "Custom Tailoring"}
          </h3>

          <p>
            ${order.type || "Customization"}
          </p>

          <p>
            Status:
            <strong>
              ${order.status || "Pending"}
            </strong>
          </p>

          <p>
            Fabric:
            ${order.fabric || "Not Selected"}
          </p>

        </div>

      </div>

    `;

  });

}


/* =========================
   CANCEL ORDER
========================= */

window.cancelOrder =
  async function (
    collectionName,
    id
  ) {

    if (
      !confirm(
        "Cancel this order?"
      )
    ) return;


    try {

      await deleteDoc(
        doc(
          db,
          collectionName,
          id
        )
      );


      alert(
        "Order cancelled."
      );


      loadOrders();


    } catch (error) {

      console.error(
        "Cancel order error:",
        error
      );


      alert(
        "Failed to cancel order."
      );

    }

  };


loadOrders();