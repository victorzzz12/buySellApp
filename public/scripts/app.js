$(() => {
  $.ajax({
    method: "GET",
    url: "/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/products"
  }).done((products) => {
    for(product of products) {
      $("<div>").text(product.name).appendTo($("body"));
    }
  });;
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/admins"
  }).done((admins) => {
    for(admin of admins) {
      $("<div>").text(admin.name).appendTo($("body"));
    }
  });;
});
