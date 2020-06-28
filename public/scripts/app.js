$(() => {
  $.ajax({
    method: "GET",
    url: "/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user).appendTo($("body"));
    }
  });;
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/products"
  }).done((products) => {
    for(product of products) {
      $("<div>").text(product).appendTo($("body"));
    }
  });;
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/admins"
  }).done((admins) => {
    for(admin of admins) {
      $("<div>").text(admin).appendTo($("body"));
    }
  });;
});
