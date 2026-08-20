let currentProduct = null;

import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Get product ID from URL
const params = new URLSearchParams(window.location.search);

const productId = params.get("id");


// =========================
// LOAD PRODUCT
// =========================

async function loadProduct() {

  // Get product from Firebase
  const productRef = doc(db, "products", productId);

  const productSnap = await getDoc(productRef);


  if (productSnap.exists()) {

    const product = productSnap.data();

    currentProduct = product;


    document.getElementById("productImage").src =
      product.image;

    document.getElementById("productName").innerText =
      product.name;

    document.getElementById("productPrice").innerText =
      "Price: ₹ " + product.price;

    document.getElementById("productDescription").innerText =
      product.description;

    document.getElementById("productCategory").innerText =
      product.category;

    document.getElementById("productSizes").innerText =
      product.sizes;

  }

}


// Load product
loadProduct();


// =========================
// PLACE READY-MADE ORDER
// =========================

const orderBtn =
  document.getElementById("placeOrderBtn");


orderBtn.addEventListener("click", async () => {

  if (!currentProduct) return;


  await addDoc(collection(db, "orders"), {

    name: currentProduct.name,

    image: currentProduct.image,

    price: currentProduct.price,

    status: "Pending"

  });


  alert("Order Placed Successfully");

});


// =========================
// LOAD REVIEWS
// =========================

async function loadReviews() {

  const reviewsContainer =
    document.getElementById("reviewsContainer");

  if (!reviewsContainer) return;


  reviewsContainer.innerHTML = "";


  const reviewsQuery = query(
    collection(db, "reviews"),
    where("productId", "==", productId)
  );


  const reviewsSnapshot =
    await getDocs(reviewsQuery);


  if (reviewsSnapshot.empty) {

    reviewsContainer.innerHTML = `
      <p style="color: var(--text-secondary);">
        No reviews yet. Be the first to review this product!
      </p>
    `;

    return;
  }


  reviewsSnapshot.forEach((docItem) => {

    const review = docItem.data();


    const reviewCard = document.createElement("div");

    reviewCard.className = "review-card";


    reviewCard.innerHTML = `

      <div class="review-header">

        <span class="reviewer-name">
          ${review.name}
        </span>

        <span class="review-date">
          ${review.createdAt
            ? new Date(
                review.createdAt.seconds * 1000
              ).toLocaleDateString()
            : ""}
        </span>

      </div>


      <div class="stars">
        ${"★".repeat(Number(review.rating))}
        ${"☆".repeat(5 - Number(review.rating))}
      </div>


      <p>
        ${review.text}
      </p>

    `;


    reviewsContainer.appendChild(reviewCard);

  });

}


// =========================
// SUBMIT REVIEW
// =========================

const submitReviewBtn =
  document.getElementById("submitReviewBtn");


if (submitReviewBtn) {

  submitReviewBtn.addEventListener("click", async () => {

    const name =
      document.getElementById("reviewName").value.trim();

    const rating =
      document.getElementById("reviewRating").value;

    const text =
      document.getElementById("reviewText").value.trim();


    if (!name || !text) {

      alert("Please enter your name and review.");

      return;

    }


    try {

      await addDoc(collection(db, "reviews"), {

        productId: productId,

        productName:
          currentProduct
            ? currentProduct.name
            : "",

        name: name,

        rating: Number(rating),

        text: text,

        createdAt: new Date()

      });


      alert("Review submitted successfully!");


      document.getElementById("reviewName").value = "";

      document.getElementById("reviewText").value = "";

      document.getElementById("reviewRating").value = "5";


      loadReviews();


    } catch (error) {

      console.error(error);

      alert("Error submitting review.");

    }

  });

}


// Load reviews
loadReviews();


// =========================
// DELETE PRODUCT
// =========================

window.deleteProduct = async function(id) {

  const confirmDelete =
    confirm("Delete this product?");


  if (!confirmDelete) return;


  try {

    await deleteDoc(doc(db, "products", id));


    alert("Product deleted");


    loadProducts();


  } catch (error) {

    console.error(error);

  }
};