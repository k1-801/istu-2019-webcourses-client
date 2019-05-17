let app = {
  "prefix": ``,
  "country": `any`,
  "countries": [],
  "stock": [
    {
      "country": `Россия`,
      "city": `Сочи`,
      "price": `200000`,
      "image": `https://placeimg.com/255/255/nature?0`
    },
    {
      "country": `Франция`,
      "city": `Париж`,
      "price": `150000`,
      "image": `https://placeimg.com/255/255/nature?2`
    },
    {
      "country": `Тайланд`,
      "city": `Бангкок`,
      "price": `50000`,
      "image": `https://placeimg.com/255/255/nature?3`
    },
    {
      "country": `Тайланд`,
      "city": `Пхукет`,
      "price": `60000`,
      "image": `https://placeimg.com/255/255/nature?4`
    },
  ],
  "cart": []
};

function createProductCard(obj) {
  let ct = null;
  for (let card in app.cart) {
    if ({}.hasOwnProperty.call(app.cart, card) && app.cart[card].city === obj.city) {
      ct = card;
      break;
    }
  }
  return `<div class="card text-center card-product">
 <div class="card-product__img">
  <img class="card-img" src="${obj.image}" alt="">
 </div>
 <div class="card-body">
  <p>${obj.country}</p>
  <h4 class="card-product__title">${obj.city}</h4>
  <p class="card-product__price">${obj.price} руб</p>
  <p><button type="button" onclick="swapCart('${obj.city}')" class="btn btn-${ct ? `danger">Отмена` : `primary">Заказать`}</button></p>
 </div>
</div>`;
}

function restock() {
  document.getElementById(`stockList`).innerHTML = ``;
  for (let card in app.stock) {
    if ({}.hasOwnProperty.call(app.stock, card)) {
      if ((app.country === `any` || app.stock[card].country === app.country) && app.stock[card].city.toLowerCase().startsWith(app.prefix.toLowerCase())) {
        document.getElementById(`stockList`).insertAdjacentHTML(`beforeend`, createProductCard(app.stock[card]));
      }
    }
  }
  document.getElementById(`cartBadge`).innerHTML = app.cart.length;
}

app.cart = JSON.parse(localStorage.cart);
if (typeof app.cart !== `object`) {
  localStorage.cart = `[]`;
  app.cart = [];
}

if (document.getElementById(`stockList`)) {
  let cid = 0;
  // Count the city numbers for each country
  document.getElementById(`filter`).innerHTML = `<div class="form-check">
  <input class="form-check-input" type="radio" name="country" id="country-${cid}" value="any" checked>
  <label class="form-check-label" for="country-${cid}">
    Все (${app.stock.length})
  </label>
  </div>`;
  document.getElementById(`country-${cid}`).addEventListener(`change`, () => {
    app.country = `any`;
    restock();
  });

  for (let card in app.stock) {
    if ({}.hasOwnProperty.call(app.stock, card)) {
      if (!app.countries[app.stock[card].country]) {
        app.countries[app.stock[card].country] = 1;
      } else {
        ++app.countries[app.stock[card].country];
      }
    }
  }

  for (let country in app.countries) {
    if ({}.hasOwnProperty.call(app.countries, country)) {
      ++cid;
      document.getElementById(`filter`).insertAdjacentHTML(`beforeend`, `<div class="form-check">
  <input class="form-check-input" type="radio" name="country" id="country-${cid}" value="${country}">
  <label class="form-check-label" for="country-${cid}">
    ${country} (${app.countries[country]})
  </label>
  </div>`);
      document.getElementById(`country-${cid}`).addEventListener(`change`, () => {
        app.country = country;
        restock();
      });
    }
  }

  document.getElementById(`prefix`).addEventListener(`input`, () => {
    app.prefix = document.getElementById(`prefix`).value;
    restock();
  });

  restock();
}

function createCartRow(obj) {
  return `<tr>
     <th scope="row">${app.cart.indexOf(obj) + 1}</th>
     <td>${obj.city}</td>
     <td>${obj.price} руб</td>
     <td><input type="number" class="form-control cart-number" value="${obj.count}" min="1" onchange="cartedit('${obj.city}', this.value);"></td>
     <td>${obj.price * obj.count} руб</td>
     <td><button type="button" class="btn btn-danger" onclick="swapCart('${obj.city}')">Удалить</button></td>
    </tr>`;
}

function recart() {
  document.getElementById(`cartList`).innerHTML = ``;
  let sum = 0;
  for (let card in app.cart) {
    if ({}.hasOwnProperty.call(app.cart, card)) {
      document.getElementById(`cartList`).insertAdjacentHTML(`beforeend`, createCartRow(app.cart[card]));
      sum += app.cart[card].count * app.cart[card].price;
    }
  }

  document.getElementById(`cartList`).insertAdjacentHTML(`beforeend`, ` <tr>
     <th scope="row" colspan="3">&nbsp;</th>
     <td><b>Итого:</b></td>
     <td>${sum} руб</td>
     <td>&nbsp;</td>
    </tr>`);

  document.getElementById(`cartBadge`).innerHTML = app.cart.length;
}

function refresh() {
  if (document.getElementById(`stockList`)) {
    restock();
  }
  if (document.getElementById(`cartList`)) {
    recart();
  }
}

if (document.getElementById(`cartList`)) {
  recart();
}

window.swapCart = function (city) {
  let target = null;
  for (let card in app.stock) {
    if ({}.hasOwnProperty.call(app.stock, card) && app.stock[card].city === city) {
      target = app.stock[card];
      break;
    }
  }
  if (!target) {
    return;
  }

  let ct = null;
  for (let card in app.cart) {
    if ({}.hasOwnProperty.call(app.cart, card) && app.cart[card].city === city) {
      ct = card;
      break;
    }
  }
  if (ct) {
    app.cart.splice(ct, 1);
  } else {
    app.cart.push({"city": city, "price": target.price, "count": `1`});
  }
  localStorage.cart = JSON.stringify(app.cart);
  refresh();
};

window.cartedit = function (city, count) {
  for (let card in app.cart) {
    if ({}.hasOwnProperty.call(app.cart, card) && app.cart[card].city === city) {
      app.cart[card].count = count;
      break;
    }
  }
  localStorage.cart = JSON.stringify(app.cart);
  refresh();
};
