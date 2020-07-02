$(document).ready(() => {
  console.log('jQuery is go');

  const $main = $('.product-row');
  const $login = $('.login');
  const $search = $('.search-div')

  //This Ajax request returns object containing user status details

  const getLoginStatus = function() {
   $.ajax({
      url: '/api/users/userStatus',
      method: 'get',
      dataType: 'json',
      success: (data) => {
        console.log('login status checked');
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
    console.log(loginData);
    if (loginData.isLoggedIn === false) {
      $('.right-buttons').removeClass('visible');
      $('.right-buttons').addClass('invisible');
      $('.logout').removeClass('visible');
      $('.logout').addClass('invisible');
      $('.messages-button').removeClass('visible');
      $('.see-messages-button').addClass('invisible');
      $('.admins-only').addClass('invisible');
      $('.customers-only').addClass('invisible');
      const $loginForm = `<input type="text" name="email" placeholder="username@example.com">
      <input type="password" name="password" placeholder="password">
      <button type="submit" action="POST">Login</button>`
      $login.append($loginForm);
    } else {
      $('.right-buttons').removeClass('invisible');
      $('.right-buttons').addClass('visible');
      $('.logout').removeClass('invisible');
      $('.logout').addClass('visible');
      $('.messages-button').removeClass('invisible');
      $('.messages-button').addClass('visible');
      if (loginData.isAdmin === true) {
        $('.admins-only').removeClass('invisible');
        $('.admins-only').addClass('visible');
        $('.customers-only').removeClass('visible');
        $('.customers-only').addClass('invisible');
      }
      if (loginData.isAdmin === false) {
        $('.admins-only').removeClass('visible');
        $('.admins-only').addClass('invisible');
        $('.customers-only').removeClass('invisible');
        $('.customers-only').addClass('visible');
      }
    }
  }

  //This section renders featured products on pageload

  const renderFeaturedProducts = (e) => {
    for (let i = 0; i < e.products.length; i++) {
      const $featuredProducts = $(`
      <div class="col-6 col-sm-4 col-md-3">
        <a href><div class="product-display-${e.products[i].id} product-box">
        <img src="${e.products[i].photo_url}" style="width: 100%; height: 100px" alt="item">
        <p class="image">${e.products[i].photo_url}</p>
        <p class="name">Product Name: ${e.products[i].product}</p>
        <p class="price">Price: $${e.products[i].price}</p>
        <p class="description">${e.products[i].description}</p>
        <p class="date-added">${e.products[i].date_added}</p>
        <p class="admin">Made by: ${e.products[i].seller}</p>
        </div></a>
      </div>`);
      $main.append($featuredProducts);
      $('.image').hide();
      $('.description').hide();
      $('.date-added').hide();
    }
  }

  function loadFeaturedProducts() {
    $.ajax("/api/products/",
    { method: "GET",
    success: (data) => {
      console.log('get api/products success', data);
      $main.empty();
      renderFeaturedProducts(data);
      $main.prepend(`<div class="container" id="products">
      <h2 class="featured-title">Featured Creations</h2>
      <div class="row product-row justify-content-left">
      </div>
      </div>`);
      $search.empty();
      $search.append($searchButton);
      loadProducts();
    }
  })
}

  loadFeaturedProducts();

//This section brings up the "home interface" when the home logo is clicked

  $('.home-button').on('click', function(event) {
    event.preventDefault();
    $main.empty();
    $('.search-div').show();
    $('.search-popup').show();
    loadFeaturedProducts();
  });
//This section replaces whatever's in the .main-container with an individual product

  const renderProductPopup = function(product) {
    console.log('render-popup', product);
    const $productPopup = $(`<div class="container product-popup">
      <div class="product-buttons">
        <button data-product-id="${product.id}" class="delete btn btn-danger admins-only invisible">Delete</button>
        <button data-product-id="${product.id}" class="sold btn btn-success admins-only invisible">Mark as sold</button>
      </div>
      <h1 class='product-name'>${product.product}</h1>
      <img src="${product.photo_url}" alt="cute embroidered shirt">
      <a href="#"><p class="customers-only invisible add-to-favorites">⭐️Add To Favorites</p></a>
      <a href="#"><p class="customers-only invisible message-seller">✉️Message seller</p></a>
      <h2>SOLD</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <p class='seller-name'>Made By: ${product.seller}</p>
      </div>
    `)
    getLoginStatus();
    $main.append($productPopup);
    $('.product-popup h2').hide();
    if (product.sold === true) {
      $('.product-popup h2').show();
    }
  };

  const loadProducts = function() {
    $.ajax("/api/products/", { method: "GET"})
    .then((data) => {
      for (let i = 0; i < data.products.length; i++) {
        $('.main-container').on('click',`.product-display-${data.products[i].id}`, function(event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('loadProducts');
          let $id = data.products[i].id;
          console.log($id);
          $main.empty();
          renderProductPopup(data.products[i]);
        });
      }
    })
  }

  loadProducts();

   //this section handles the see favorites button

   $('nav').on('click','.see-favorites', function(event) {
    event.preventDefault();
    getFavorites()
  });

  //This section handles the "add to favorites" link

  const getFavorites = function() {
    return $.ajax({
      url: "/api/products/favorites",
      method:'GET',
      dataType: 'json',
      success: function(data) {
        console.log(data)
        $main.empty();
        renderFeaturedProducts(data);
        $main.prepend(`<div class="container" id="products">
        <h2 class="featured-title">Favorites</h2>
        <div class="row product-row justify-content-left">
        </div>
        </div>`);
      }
    })
  };

  const addToFavorites = function(data) {
    return $.ajax({
      method: "POST",
      url: "/api/products/favorites",
      data,
      success: console.log('favorite added')
    });
  }

  $(document).on('click', '.add-to-favorites', function(event) {
    event.preventDefault();
    let name = $(this).parent().parent().find('.product-name').html();
    console.log(name);
    addToFavorites({name})
    .then(getFavorites())
  })


  //This section takes care of login

  const $loginForm = $('.login');

  $loginForm.on('submit', function(event) {
    event.preventDefault();
    const $inputs = $('form :input')
    const data = $(this).serialize();
    logIn(data)
    .then(json => {
    if (!json.user) {
          $inputs.val('');
        }
        getLoginStatus();
      });
  });

 //This section takes care of logout
 $('nav').on('click', '.logout', function(event) {
  event.preventDefault();
  logOut()
  .then(() => getLoginStatus())
  .then(()=> loadFeaturedProducts());
});

  //This section takes care of search bar
  const $searchForm = $(`<form action="/api/products/search" method="get" class="search-popup"><div class='form-top-row'><h2>Search Creations</h2><a href="#"><p style="color:maroon" class='close-search'>(close)</p></a></div><div class="form-keyword">
    <label for="keywords">Search By Keyword</label>
    <input type="text" placeholder="birdhouse" name="keywords">
  </div>
  <div class="form-creator">
    <label for="seller">Search By Creator</label>
    <input list="sellers" id ="seller-choice" name="seller"/>
    <datalist id="sellers">
      <option value="Victor"></option>
      <option value="Eileen"></option>
    </datalist>
  </div>
  <div>
    <p>Creation type:</p>
    <label for="art">Art</label>
    <input type="checkbox" name="type" value="art">
    <label for="home">Home</label>
    <input type="checkbox" name="type" value="home">
    <label for="apparel">Apparel</label>
    <input type="checkbox" name="type" value="apparel">
  </div>
  <div class="form-min-max-price">
    <label for="minimum-cost">Minimum Cost</label>
    <input type="number" name="minimum_price" placeholder="Minimum Cost" id="search-minimum-price"><br>
    <label for="search-property-form__maximum-price-per-night">Maximum Cost</label>
    <input type="number" name="maximum_price" placeholder="Maximum Cost" id="search-maximum-price">
  </div>
  <div class="form-sold-radio invisible">
    <p>Only show available (unsold) creations?</p>
    <label for="yes">Yes</label>
    <input type="radio" name="sold" value="false" checked>
    <label for="no">No</label>
    <input type="radio" name="sold" value="true">
  </div>
  <div class='search-submit-button-container'><button type="submit" class='search-submit-button'>Search Creations</button></div></form>
  `)
  const $searchButton = `<div class="search">
  <form class="search-form">
    <button type="submit" class='search-button'>Search Creations</button>
  </form>
  </div>`

  $(document).on('click', $search, function(event) {
    const target = $(event.target);
    // console.log(target)
    if (target.is('.search-button')) {
      event.preventDefault();
      $search.empty();
      $search.append($searchForm);
    }
    if (target.is('.close-search')) {
      event.preventDefault();
      $search.empty();
      $search.append($searchButton);
    }

  })

  $(document).on('submit', '.search-div form', function(event) {

      event.preventDefault();
      const data = $(this).serialize();
      console.log(data);
      $.ajax("/api/products/search", { method: "POST", data: data })
      .then((data) => {
        $main.empty();
        renderFeaturedProducts(data);
        $main.prepend(`<div class="container" id="products">
        <h2 class="featured-title">Search Results</h2>
        <div class="row product-row justify-content-left">
        </div>
        </div>`);
        $search.empty();
        $search.append($searchButton);
      }).done(() => loadProducts());
    })

    //Changing whether an item is sold or not

    $(document).on('click', '.product-buttons .sold', function(event) {
      event.preventDefault();
      console.log('MARK SOLD');
      $.ajax({
        url: "/api/products/sold",
        method: "POST",
        data: {id: $(this).data("product-id")}
      }).done((products) => {
        console.log(products);
        $('.product-popup h2').show();
      })
    });

    //Deleting an item from the database
    $(`.main-container`).on('click', '.product-buttons .delete', function(event) {
      event.preventDefault();
      console.log($(this).data("product-id"));
      $.ajax({
        url: "/api/products/delete",
        method: "POST",
        data: {id:
          $(this).data("product-id")
        }
      }).then(() => {
        console.log('called delete')
        loadFeaturedProducts()
      })
      .catch(err=> console.log(err))

  })
});
