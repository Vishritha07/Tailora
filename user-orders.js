import { db } from "./firebase.js";

import {
  collection,
  getDocs
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const ordersList =
  document.getElementById("ordersList");


async function loadOrders() {

  ordersList.innerHTML = "";


  // =========================
  // READYMADE + TAILORING
  // =========================

  const ordersSnapshot =
    await getDocs(collection(db, "orders"));


  ordersSnapshot.forEach((docItem) => {

    const order = docItem.data();

    let imageSection = "";


    // TAILORING REFERENCE IMAGE

    if (
      order.referenceImage &&
      order.referenceImage !== ""
    ) {

      imageSection = `
        <img
          src="${order.referenceImage}"
          style="
            width:120px;
            height:120px;
            object-fit:cover;
            border-radius:12px;
          "
        >
      `;

    }


    // READYMADE PRODUCT IMAGE

    else if (
      order.image &&
      order.image !== ""
    ) {

      imageSection = `
        <img
          src="${order.image}"
          style="
            width:120px;
            height:120px;
            object-fit:cover;
            border-radius:12px;
          "
        >
      `;

    }


    // NO IMAGE

    else {

      imageSection = `
        <div class="image-placeholder">
          No Image
        </div>
      `;

    }



    let customImage = "";

if (order.image && order.image !== "") {

  customImage = `
    <img
      src="${order.image}"
      style="
        width:120px;
        height:120px;
        object-fit:cover;
        border-radius:12px;
      "
    >
  `;

} else {

  customImage = `
    <div class="image-placeholder">
      Custom
    </div>
  `;

}


ordersList.innerHTML += `

  <div class="order-card">

    ${imageSection}

    <div class="order-info">

      <h3>
        ${order.name || "Customized Dress"}
      </h3>

      <p>
        ${order.type || "Customized"}
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




  // =========================
  // CUSTOMIZATION ORDERS
  // =========================

  const customSnapshot =
    await getDocs(collection(db, "customOrders"));


  customSnapshot.forEach((docItem) => {

  const order = docItem.data();

  let customImage = "";


  if (order.image && order.image !== "") {

    customImage = `
      <img
        src="${order.image}"
        style="
          width:120px;
          height:120px;
          object-fit:cover;
          border-radius:12px;
        "
      >
    `;

  } else {

    customImage = `
      <div class="image-placeholder">
        Custom
      </div>
    `;

  }


  ordersList.innerHTML += `

    <div class="order-card">

      ${customImage}

      <div class="order-info">

        <h3>
          ${order.name || "Customized Dress"}
        </h3>

        <p>
          ${order.type || "Customized"}
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


loadOrders();

window.showOrdersList = function () {

  document.getElementById("orders-list-view").style.display = "block";

  document.getElementById("order-detail-view").style.display = "none";

};

window.cancelOrder = async function (collectionName, id) {

  if (!confirm("Cancel this order?")) return;

  await deleteDoc(doc(db, collectionName, id));

  alert("Order cancelled.");

  showOrdersList();

  loadOrders();

};