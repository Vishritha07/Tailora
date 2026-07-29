import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function loadAdminOrders() {

  const tableBody =
    document.getElementById("adminOrdersTable");


  if (!tableBody) {
    console.log("Table body not found");
    return;
  }


  tableBody.innerHTML = "";


  const querySnapshot =
    await getDocs(collection(db, "orders"));
  
  const customSnapshot =
  await getDocs(collection(db, "customOrders"));


  querySnapshot.forEach((orderDoc) => {

    const order = orderDoc.data();


    const row = document.createElement("tr");


    row.innerHTML = `

      <td>${orderDoc.id.slice(0,6)}</td>

      <td>Customer</td>

      <td>${order.name}</td>

      <td>${order.type || "Ready-Made"}</td>

      <td>

        <select class="statusDropdown">

          <option value="Pending"
            ${order.status === "Pending" ? "selected" : ""}>
            Pending
          </option>

          <option value="In Progress"
            ${order.status === "In Progress" ? "selected" : ""}>
            In Progress
          </option>

          <option value="Completed"
            ${order.status === "Completed" ? "selected" : ""}>
            Completed
          </option>

        </select>

      </td>

      <td>Today</td>

      <td>

        <button class="btn btn-sm btn-outline"
  onclick="viewOrder('${orderDoc.id}')">
          View
        </button>

      </td>

    `;


    const dropdown =
      row.querySelector(".statusDropdown");


    dropdown.addEventListener("change", async (e) => {

      const newStatus = e.target.value;


      await updateDoc(
        doc(db, "orders", orderDoc.id),
        {
          status: newStatus
        }
      );


      alert("Status Updated");

    });


    tableBody.appendChild(row);

  });

  customSnapshot.forEach((orderDoc) => {

  const order = orderDoc.data();

  const row = document.createElement("tr");

  row.innerHTML = `

    <td>${orderDoc.id.slice(0,6)}</td>

    <td>Customer</td>

    <td>Customized Dress</td>

    <td>Customized</td>

    <td>

      <select class="statusDropdown">

        <option value="Pending"
          ${order.status === "Pending" ? "selected" : ""}>
          Pending
        </option>

        <option value="In Progress"
          ${order.status === "In Progress" ? "selected" : ""}>
          In Progress
        </option>

        <option value="Completed"
          ${order.status === "Completed" ? "selected" : ""}>
          Completed
        </option>

      </select>

    </td>

    <td>Today</td>

    <td>

      <button class="btn btn-sm btn-outline">
        View
      </button>

    </td>

  `;

  const dropdown =
    row.querySelector(".statusDropdown");

  dropdown.addEventListener("change", async (e) => {

    const newStatus = e.target.value;

    await updateDoc(
      doc(db, "customOrders", orderDoc.id),
      {
        status: newStatus
      }
    );

    alert("Status Updated");

  });

  tableBody.appendChild(row);

});

}


loadAdminOrders();

window.viewOrder = async function(orderId) {

  const orderRef =
    doc(db, "orders", orderId);

  const orderSnap =
    await getDoc(orderRef);

  const order =
    orderSnap.data();


  document.getElementById("order-detail")
    .style.display = "block";


  document.getElementById("detailProduct")
    .textContent = order.name || "";

  document.getElementById("detailType")
    .textContent = order.type || "";

  document.getElementById("detailBust")
    .textContent = order.bust || "";

  document.getElementById("detailWaist")
    .textContent = order.waist || "";

  document.getElementById("detailHips")
    .textContent = order.hips || "";

  document.getElementById("detailShoulder")
    .textContent = order.shoulder || "";

  document.getElementById("detailFabric")
    .textContent = order.fabric || "";

  document.getElementById("detailStyle")
    .textContent = order.style || "";

  document.getElementById("detailColor")
    .textContent = order.color || "";


  if(order.referenceImage){

    document.getElementById("detailImage")
      .src = order.referenceImage;

  }

}