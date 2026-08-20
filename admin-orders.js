import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tableBody = document.getElementById("adminOrdersTable");
const statusFilter = document.getElementById("statusFilter");

let allOrders = [];


/* =========================
   LOAD ALL ORDERS
========================= */

async function loadAdminOrders() {

  if (!tableBody) {
    console.log("Table body not found");
    return;
  }

  tableBody.innerHTML = "";
  allOrders = [];

  try {

    // READY-MADE ORDERS
    const ordersSnapshot =
      await getDocs(collection(db, "orders"));

    ordersSnapshot.forEach((orderDoc) => {

      allOrders.push({
        id: orderDoc.id,
        collection: "orders",
        data: orderDoc.data()
      });

    });


    // CUSTOMIZATION ORDERS
    const customSnapshot =
      await getDocs(collection(db, "customOrders"));

    customSnapshot.forEach((orderDoc) => {

      allOrders.push({
        id: orderDoc.id,
        collection: "customOrders",
        data: orderDoc.data()
      });

    });


    displayOrders(allOrders);

  } catch (error) {

    console.error("Error loading orders:", error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="7">
          Unable to load orders.
        </td>
      </tr>
    `;

  }
}


/* =========================
   DISPLAY ORDERS
========================= */

function displayOrders(orders) {

  tableBody.innerHTML = "";

  if (orders.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;">
          No orders found.
        </td>
      </tr>
    `;

    return;
  }


  orders.forEach((item) => {

    const order = item.data;

    const row = document.createElement("tr");


    /* NAME */

    const orderName =
      order.name ||
      (item.collection === "customOrders"
        ? "Custom Tailoring"
        : "Unnamed Product");


    /* TYPE */

    const orderType =
      order.type ||
      (item.collection === "customOrders"
        ? "Customization"
        : "Ready-Made");


    /* IMAGE */

    const image =
      order.referenceImage ||
      order.image ||
      "";


    const imageHTML = image

      ? `
        <img
          src="${image}"
          alt="Order"
          style="
            width:60px;
            height:60px;
            object-fit:cover;
            border-radius:8px;
          "
        >
      `

      : `
        <div
          style="
            width:60px;
            height:60px;
            border-radius:8px;
            background:#f1f1f1;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:12px;
          "
        >
          No Image
        </div>
      `;


    /* DATE */

    let orderDate = "N/A";

    if (order.createdAt) {

      try {

        if (order.createdAt.toDate) {
          orderDate =
            order.createdAt.toDate().toLocaleDateString();
        } else {
          orderDate =
            new Date(order.createdAt).toLocaleDateString();
        }

      } catch {
        orderDate = "N/A";
      }

    }


    /* STATUS */

    const currentStatus =
      order.status || "Pending";


    row.innerHTML = `

      <!-- ORDER IMAGE -->

      <td>
        ${imageHTML}
      </td>


      <!-- NAME -->

      <td>
        ${orderName}
      </td>


      <!-- TYPE -->

      <td>
        ${orderType}
      </td>


      <!-- STATUS -->

      <td>

        <select
          class="statusDropdown"
          data-id="${item.id}"
          data-collection="${item.collection}"
        >

          <option value="Pending"
            ${currentStatus === "Pending" ? "selected" : ""}>
            Pending
          </option>

          <option value="Accepted"
            ${currentStatus === "Accepted" ? "selected" : ""}>
            Accepted
          </option>

          <option value="Stitching"
            ${currentStatus === "Stitching" ? "selected" : ""}>
            Stitching
          </option>

          <option value="Completed"
            ${currentStatus === "Completed" ? "selected" : ""}>
            Completed
          </option>

          <option value="Shipped"
            ${currentStatus === "Shipped" ? "selected" : ""}>
            Shipped
          </option>

          <option value="Delivered"
            ${currentStatus === "Delivered" ? "selected" : ""}>
            Delivered
          </option>

        </select>

      </td>


      <!-- ORDER ID -->

      <td>
        ${item.id.slice(0, 8)}
      </td>


      <!-- DATE -->

      <td>
        ${orderDate}
      </td>


      <!-- DELETE -->

      <td>

        <button
          class="btn btn-sm btn-outline delete-order-btn"
          data-id="${item.id}"
          data-collection="${item.collection}"
        >
          Delete
        </button>

      </td>

    `;


    /* STATUS CHANGE */

    const dropdown =
      row.querySelector(".statusDropdown");


    dropdown.addEventListener("change", async (event) => {

      const newStatus =
        event.target.value;

      try {

        await updateDoc(
          doc(
            db,
            item.collection,
            item.id
          ),
          {
            status: newStatus
          }
        );

        // Update local data too
        item.data.status = newStatus;

        alert("Order status updated successfully.");

      } catch (error) {

        console.error(
          "Status update error:",
          error
        );

        alert("Failed to update order status.");

      }

    });


    /* DELETE */

    const deleteButton =
      row.querySelector(".delete-order-btn");


    deleteButton.addEventListener("click", async () => {

      const confirmDelete =
        confirm(
          "Are you sure you want to delete this order?"
        );


      if (!confirmDelete) return;


      try {

        await deleteDoc(
          doc(
            db,
            item.collection,
            item.id
          )
        );


        // Remove from local array
        allOrders =
          allOrders.filter(
            order =>
              !(
                order.id === item.id &&
                order.collection === item.collection
              )
          );


        displayOrders(allOrders);


        alert("Order deleted successfully.");

      } catch (error) {

        console.error(
          "Delete error:",
          error
        );

        alert("Failed to delete order.");

      }

    });


    tableBody.appendChild(row);

  });

}


/* =========================
   STATUS FILTER
========================= */

if (statusFilter) {

  statusFilter.addEventListener(
    "change",
    () => {

      const selectedStatus =
        statusFilter.value;


      if (!selectedStatus) {

        displayOrders(allOrders);

        return;

      }


      const filteredOrders =
        allOrders.filter(
          item =>
            (item.data.status || "Pending") ===
            selectedStatus
        );


      displayOrders(filteredOrders);

    }
  );

}


/* =========================
   VIEW ORDER
========================= */

window.viewOrder = async function (
  orderId,
  collectionName = "orders"
) {

  try {

    const orderRef =
      doc(
        db,
        collectionName,
        orderId
      );


    const orderSnap =
      await getDoc(orderRef);


    if (!orderSnap.exists()) {

      alert("Order not found.");

      return;

    }


    const order =
      orderSnap.data();


    const detailPanel =
      document.getElementById("order-detail");


    if (detailPanel) {

      detailPanel.style.display =
        "block";

      detailPanel.scrollIntoView({
        behavior: "smooth"
      });

    }


    const detailProduct =
      document.getElementById("detailProduct");


    if (detailProduct) {

      detailProduct.textContent =
        order.name ||
        (collectionName === "customOrders"
          ? "Custom Tailoring"
          : "");

    }


    const detailType =
      document.getElementById("detailType");


    if (detailType) {

      detailType.textContent =
        order.type ||
        (collectionName === "customOrders"
          ? "Customization"
          : "Ready-Made");

    }


    const detailBust =
      document.getElementById("detailBust");


    if (detailBust)
      detailBust.textContent =
        order.bust || "";


    const detailWaist =
      document.getElementById("detailWaist");


    if (detailWaist)
      detailWaist.textContent =
        order.waist || "";


    const detailHips =
      document.getElementById("detailHips");


    if (detailHips)
      detailHips.textContent =
        order.hips || "";


    const detailShoulder =
      document.getElementById("detailShoulder");


    if (detailShoulder)
      detailShoulder.textContent =
        order.shoulder || "";


  } catch (error) {

    console.error(
      "Error loading order:",
      error
    );

  }

};


/* =========================
   START
========================= */

loadAdminOrders();