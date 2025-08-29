// main.js
document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".product-grid");

  fetch("https://purewave.onrender.com/api/products") // your backend API
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        productsContainer.innerHTML = ""; // clear existing static products
        data.data.forEach(product => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.innerHTML = `
            <a href="productsTest.html?page=${product.id}" style="text-decoration: none; color: inherit;">
              <img src="${product.image}" alt="${product.name}" />
              <h3>${product.name}</h3>
              <span style="display:block; color:#888; font-size:1rem; margin-top:4px;">${product.category}</span>
            </a>
          `;
          productsContainer.appendChild(card);
        });
      } else {
        console.error("Backend error:", data.message);
      }
    })
    .catch(err => console.error("Fetch error:", err));
});
