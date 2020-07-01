
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


