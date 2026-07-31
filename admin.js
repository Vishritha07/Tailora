import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const saveBtn = document.getElementById("saveProductBtn");


saveBtn.addEventListener("click", async () => {

  // Get form values
  const name = document.getElementById("product-name").value;

  const category = document.getElementById("category").value;

  const price = document.getElementById("price").value;

  const description = document.getElementById("description").value;

  const sizes = document.getElementById("sizes").value;

  const imageFile = document.getElementById("product-image").files[0];


  // Validation
  if (!name || !price || !imageFile) {

    alert("Please fill all required fields");

    return;
  }


  // Convert image to Base64
  const reader = new FileReader();

  reader.readAsDataURL(imageFile);


  reader.onload = async () => {

    const imageBase64 = reader.result;


    // Save to Firebase
    await addDoc(collection(db, "products"), {

      name: name,

      category: category,

      price: price,

      description: description,

      sizes: sizes,

      image: imageBase64

    });


    alert("Product Added Successfully");


    // Reload page
    location.reload();

  };

});

// Fetch and display products

async function loadProducts() {

  const tableBody = document.getElementById("productsTableBody");

  tableBody.innerHTML = "";


  // Get products from Firebase
  const querySnapshot = await getDocs(collection(db, "products"));


  querySnapshot.forEach((doc) => {

    const product = doc.data();


    tableBody.innerHTML += `

      <tr>

        <td>
          <img src="${product.image}"
               width="60"
               height="60"
               style="object-fit: cover; border-radius: 8px;">
        </td>

        <td>${product.name}</td>

        <td>${product.category}</td>

        <td>₹ ${product.price}</td>

        <td>
          <span class="badge badge-completed">
            Active
          </span>
        </td>

        <td>

          

          <button class="btn btn-sm btn-danger" onclick="deleteProduct('${doc.id}')">
            Delete
          </button>

        </td>

      </tr>

    `;

  });

}

window.deleteProduct = async function(id) {

  const confirmDelete =
    confirm("Delete this product?");

  if (!confirmDelete) return;

  try {

    await deleteDoc(doc(db, "products", id));

    alert("Product deleted");

    location.reload();

  } catch (error) {

    console.error(error);

    alert("Error deleting product");
  }

};
// Load products automatically
loadProducts();