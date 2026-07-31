import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadFabrics() {

  const fabricContainer =
    document.getElementById("fabric-types");

  if (!fabricContainer) return;

  try {

    const snapshot =
      await getDocs(collection(db, "fabrics"));

    fabricContainer.innerHTML = "";

    snapshot.forEach((doc) => {

      const fabric = doc.data();

      const fabricCard =
        document.createElement("div");

      fabricCard.className = "fabric-type-btn";

      fabricCard.style.cursor = "pointer";

      fabricCard.innerHTML = `
        <img
          src="${fabric.image || ""}"
          alt="${fabric.type || ""}"
          style="
            width:150px;
            height:150px;
            object-fit:cover;
            border-radius:10px;
          "
        >

        <h4>${fabric.type || ""}</h4>

        <p>Design: ${fabric.design || ""}</p>

        <p>Color: ${fabric.color || ""}</p>
      `;

      fabricCard.addEventListener("click", () => {

  if (typeof window.selectFabricType === "function") {

    window.selectFabricType(
      fabricCard,
      fabric.type || "",
      fabric.design || "",
      fabric.color || ""
    );

  }

});

      fabricContainer.appendChild(fabricCard);

    });

  } catch (error) {

    console.error("Error loading fabrics:", error);

  }

}

loadFabrics();