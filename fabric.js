
import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let editingId = null;

async function loadFabrics() {

  const tableBody = document.getElementById("fabricsTableBody");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "fabrics")
  );

  snapshot.forEach((doc) => {

    const fabric = doc.data();

    tableBody.innerHTML += `
      <tr>
        <td>
          <img src="${fabric.image}"
               style="width:60px;height:60px;object-fit:cover;">
        </td>

        <td>${fabric.type || "-"}</td>
        <td>${fabric.design || "-"}</td>

        <td>
          

          <button
            class="btn btn-sm btn-danger"
            onclick="deleteFabric('${doc.id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}


// SAVE FABRIC
const saveButton = document.getElementById("saveFabricBtn");

if (saveButton) {

  saveButton.addEventListener("click", async () => {

    try {

      const fabric = {
        image: document.getElementById("fabric-image").value,
        type: document.getElementById("fabric-type").value,
        design: document.getElementById("fabric-design").value,
        color: document.getElementById("fabric-color").value
      };

      // Save to Firebase
     await addDoc(
       collection(db, "fabrics"),
       fabric
     );

      alert("Fabric added successfully!");

      closeModal("add-fabric-modal");

      // Refresh table
      loadFabrics();

    } catch (error) {

      console.error("Error saving fabric:", error);

      alert("Error saving fabric: " + error.message);

    }

  });

}


// Load existing fabrics when page opens
loadFabrics();
window.deleteFabric = async function(id) {

  if (!confirm("Delete this fabric?")) return;

  await deleteDoc(doc(db, "fabrics", id));

  loadFabrics();
};

