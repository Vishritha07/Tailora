import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const customOrderBtn =
  document.getElementById("customOrderBtn");


if (customOrderBtn) {

  customOrderBtn.addEventListener("click", async () => {

    try {

      const bust =
        document.getElementById("bust").value;

      const waist =
        document.getElementById("waist").value;

      const hips =
        document.getElementById("hips").value;

      const shoulder =
        document.getElementById("shoulder").value;


      const fabric =
        window.selectedFabric || "Not selected";

      const style =
        window.selectedStyle || "Not selected";

      const color =
        window.selectedColor || "Not selected";



      await addDoc(collection(db, "customOrders"), {

        bust,
        waist,
        hips,
        shoulder,

        fabric,
        style,
        color,

        type: "Customized",

        image:
    localStorage.getItem("selectedProductImage") || "",

  name:
    localStorage.getItem("selectedProductName") || "Customized Dress",


        status: "Pending",

        createdAt: new Date()

      });


      alert("Customization Order Placed");


      window.location.href =
        "orders(2).html";


    } catch (error) {

      console.log(error);

      alert("Error saving customization order");

    }

  });

}