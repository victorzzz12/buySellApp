const escape =  function(str) { //Security purposes so that all text will return a string
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const createProduct = (i) => {
  const product =
  `<article>
  <div class="product-header">
    <span>
      <img src="${i.product.photo_url}" alt="This is a product image">
    </span>
    <h4 class="tag">${i.product.price}</h4>
  </div>
  <div><p>${i.product.name}</p></div>
</article>`

  return product;
}

const renderProducts = products => {
  for (let i of products) {
    $("#products").prepend(createProduct(i));
  }
}

function loadProducts() {
  $.ajax("/products", { method: "GET" })
  .then((data) => {
    renderProducts(data);
  })
}
