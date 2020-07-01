const { json } = require("body-parser");

function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/api/users/login",
    data
  });
}

const submitProducts = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/products",
    data
  });
}

const addToFavorites = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/products/favorites",
    data
  });
}

const getFavorites = function() {
  return $.ajax({
    method:'GET',
    dataType: 'json',
    url: "/api/products/favorites"
  });
}


