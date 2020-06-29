$(document).ready(() => {
  console.log('jQuery is go');

  const $main = $('.product-row');
  const $login = $('.login');

  //This Ajax request returns object containing user status details

  const getLoginStatus = function() {
   $.ajax({
      url: '/api/users/userStatus',
      method: 'get',
      dataType: 'json',
      success: (data) => {
        console.log('data', data);
        renderLogin(data);
      },
      error: (jqxr, textStatus, error) => {
        console.log(error);
      }
    })
  }

  getLoginStatus();

  //This section populates header with login form or logout button

  const renderLogin = function(loginData) {
    $login.empty();
    if (loginData.isLoggedIn === false) {
      const $loginForm = `<input type="text" name="email" placeholder="username@example.com">
      <input type="text" name="password" placeholder="password">
      <button type="submit" action="POST">Login</button>`
      $login.append($loginForm);

    } else {
      //logout form later
    }

  }

  //This section renders featured products on pageload

  const renderFeaturedProducts = (e) => {
    for (let i = 0; i < e.products.length; i++) {
      const $featuredProducts = $(`
      <div class="col-6 col-sm-4 col-md-3">
        <a href><div class="product-display-${i} product-box">
        <img src="${e.products[i].photo_url}" style="width: 100%; height: 100px" alt="item">
        <p class="name">${e.products[i].name}</p>
        <p class="price">${e.products[i].price}</p>
        <p class="description">${e.products[i].description}</p>
        <p class="date-added">${e.products[i].date_added}</p>
        <p class="admin-id">${e.products[i].admin_id}</p>
        </div></a>
      </div>`);
      $main.append($featuredProducts);
      $('.description').hide();
      $('.date-added').hide();
    }
  }

  function loadFeaturedProducts() {
    $.ajax("/api/products/", { method: "GET" })
    .then((data) => {
      renderFeaturedProducts(data);
    })
  }

  loadFeaturedProducts();

//This section brings up the "home interface" when the home logo is clicked

  $('.home-button').on('click', function(event) {
    event.preventDefault();
    $main.empty();
    loadFeaturedProducts();
  });

//This section replaces whatever's in the .main-container with an individual product

  const renderProductPopup = function(name, description, seller, time) {
    const $productPopup = $(`<div class="container product-popup">
      <h1>${name}</h1>
      <img src="https://i.etsystatic.com/20553919/r/il/729255/2292852133/il_1588xN.2292852133_2xr2.jpg" alt="cute embroidered shirt">
      <h2>SOLD</h2>
      <a href="#"><p>Message seller</p></a>
      <p>${description}</p>
      <p>Listed by: Eileen</p>
      <p>Listed on: ${time}</p>
      </div>
    `);
    $main.append($productPopup);
  };

  for (let i = 0; i < 12; i++) {
    $(document).on('click',`.product-display-${i}`, function(event) {
      event.preventDefault();
      let $name = $(`.product-display-${i} .name`).text();
      let $description = $(`.product-display-${i} .description`).text();
      let $time = $(`.product-display-${i} .date-added`).text();
      $main.empty();
      renderProductPopup($name, $description, null, $time);
    });
  }

  //This section takes care of login

  const $loginForm = $('.login');

  $loginForm.on('submit', function(event) {
    const $inputs = $('form :input')
    event.preventDefault();
    const data = $(this).serialize();
    logIn(data)
      .then(json => {
        if (!json.user) {
          $inputs.val('');
        }
        getLoginStatus();
      });
  });
});
