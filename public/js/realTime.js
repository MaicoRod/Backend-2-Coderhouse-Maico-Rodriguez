const socket = io();
const productList = document.getElementById('product-list');
const form = document.getElementById('product-form');

socket.on('updateProducts', (products) => {
  productList.replaceChildren();
  products.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `${product.title} - $${product.price}
      <button onclick="deleteProduct('${product._id}')">Eliminar</button>`;
    productList.appendChild(li);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    category: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    thumbnails: [],
    status: true
  };
  socket.emit('newProduct', product);
  form.reset();
});

function deleteProduct(productId) {
  socket.emit('deleteProduct', productId);
}
