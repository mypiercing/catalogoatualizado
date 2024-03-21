function openPopup(e) {
    var t = e.target.closest(".product"),
        n = e.target.getAttribute("data-color"),
        r = e.target.getAttribute("data-price"),
        o = document.getElementById("popup");
  
    // Define o nome do produto e a cor/preço selecionados no popup
    o.getElementsByClassName("popup-product-name")[0].innerText = t.getElementsByClassName("product-name")[0].innerText;
    o.getElementsByClassName("popup-color")[0].innerText = n + ": € " + r;
  
    // Define a imagem do produto no popup
    var l = t.getElementsByTagName("img")[0];
    document.getElementById("popup-product-image").src = l.src;
  
    var d = o.getElementsByClassName("popup-sizes")[0];
    
    // Remove o título anterior, se houver
    var existingTitle = o.querySelector('.popup-title');
    if (existingTitle) {
        existingTitle.remove();
    }
  
    // Verifica se existe um título para os tamanhos e o adiciona ao popup
    var sizeTitle = t.querySelector('.product-details > .popup-title');
    if (sizeTitle) {
        var clonedTitle = sizeTitle.cloneNode(true);
        d.parentNode.insertBefore(clonedTitle, d);
    }
  
    // Limpa os filhos existentes na div 'popup-sizes'
    while (d.firstChild) {
        d.removeChild(d.firstChild);
    }
  
    // Clona e adiciona as opções de tamanho disponíveis para a cor selecionada
    var a = t.querySelectorAll('.sizes[data-color="' + n + '"] > .size');
    for (var s = 0; s < a.length; s++) {
        var p = a[s].cloneNode(true),
            c = p.querySelectorAll(".measure-container .measure");
        
        for (var m = 0; m < c.length; m++) {
            var measureContainer = c[m].parentNode,
                existingInput = measureContainer.querySelector(".measure-quantity");
            
            if (existingInput) {
                measureContainer.removeChild(existingInput);
            }
            
            var controlsContainer = document.createElement("div");
            controlsContainer.className = "controls";
            
            var decreaseButton = document.createElement("button");
            decreaseButton.innerText = "-";
            decreaseButton.className = "decrease-button";
            decreaseButton.addEventListener("click", function(event) {
                var inputElement = event.target.parentNode.querySelector(".measure-quantity"),
                    currentValue = parseInt(inputElement.value, 10) || 0;
                if (currentValue > 0) {
                    inputElement.value = currentValue - 1;
                }
            });
            
            var increaseButton = document.createElement("button");
            increaseButton.innerText = "+";
            increaseButton.className = "increase-button";
            increaseButton.addEventListener("click", function(event) {
                var inputElement = event.target.parentNode.querySelector(".measure-quantity"),
                    currentValue = parseInt(inputElement.value, 10) || 0;
                inputElement.value = currentValue + 1;
            });
            
            var quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.min = "0";
            quantityInput.className = "measure-quantity";
            
            controlsContainer.appendChild(decreaseButton);
            controlsContainer.appendChild(quantityInput);
            controlsContainer.appendChild(increaseButton);
            
            measureContainer.appendChild(controlsContainer);
        }
        
        d.appendChild(p);
    }
  
    // Exibe o popup
    o.style.display = "block";
}



  
  
    let freight = 21.0; // define o valor do frete
    let selectedSize = null,
      initialViewportHeight = window.innerHeight;
    let itemsInCart = 0;
  
    window.addEventListener("DOMContentLoaded", e => {
      let cartItems = JSON.parse(getItemWithExpiry("cart") || "[]");
      let total = freight; // Inicializa o total com o valor do frete
      let itemsInCart = cartItems.length;
  
      if (cartItems.length > 0) {
        var o;
        let l = document.getElementById("cart");
        for (let item of cartItems) {
          let d = document.createElement("div");
          d.innerHTML = item;
          let s = d.firstChild;
          s.querySelector("button").addEventListener("click", removeFromCart), l.appendChild(s);
          total += parseFloat(s.querySelector(".product-info > span").innerText.match(/€(\d+(\.\d{1,2})?) \* (\d+) unid = €(\d+(\.\d{1,2})?)/)[4]);
        }
        
        document.getElementById("total").innerText = total.toFixed(2);
      } else {
        // se o carrinho está vazio, o total deve ser o valor do frete
        document.getElementById("total").innerText = freight.toFixed(2);
    }
    });
    function addToCartFromPopup() {
      var totalValue = parseFloat(document.getElementById("total").innerText);
      var popup = document.getElementById("popup");
      var productName = popup.querySelector(".popup-product-name").innerText;
      var color = popup.querySelector(".popup-color").innerText.split(": ")[0].trim();
      var productImage = popup.querySelector(".popup-product-image").src;
      var measures = popup.querySelectorAll(".measure-container");
  
      // Inicialize cartItems como um array vazio
      let cartItems = JSON.parse(getItemWithExpiry("cart") || "[]");
  
      measures.forEach(function(measureContainer) {
          var measure = measureContainer.querySelector(".measure");
          var price = parseFloat(measure.getAttribute("data-price"));
          // Ajuste na maneira de obter a quantidade
          var quantityInput = measureContainer.querySelector(".measure-quantity");
          var quantity = parseInt(quantityInput.value, 10);
  
          if (quantity > 0) {
              var sizeText = measure.textContent;
              var sizeName = measure.closest(".size").querySelector("h4").textContent;
  
              // Constrói o texto de identificação do produto
              var productIdentifier = productName + " " + color + " | " + sizeName + " " + sizeText;
  
              // Encontra se o produto já existe no carrinho
              var existingProductIndex = cartItems.findIndex(item => item.productIdentifier === productIdentifier);
  
              if (existingProductIndex >= 0) {
                  // Se o produto já existe, atualiza a quantidade
                  cartItems[existingProductIndex].quantity += quantity;
              } else {
                  // Se o produto é novo, adiciona ao array
                  cartItems.push({
                      productIdentifier,
                      productName,
                      color,
                      sizeName,
                      sizeText,
                      price,
                      quantity,
                      productImage
                  });
              }
  
              // Atualização visual que indica adição ao carrinho
              var addedBanner = document.createElement("div");
              addedBanner.textContent = "Adicionado!";
              addedBanner.className = "added-banner"; // Certifique-se de que essa classe tem o estilo desejado
              measureContainer.appendChild(addedBanner);
              setTimeout(() => addedBanner.remove(), 2000); // Remove a indicação após 2 segundos
          }
      });
  
      // Atualiza o valor total no carrinho
      document.getElementById("total").innerText = totalValue.toFixed(2);
  
      // Salva os itens no localStorage
      setItemWithExpiry("cart", JSON.stringify(cartItems));
  
      // Atualiza o DOM do carrinho com os novos itens
      updateCartDOM(cartItems);
  
      // Fecha o popup
      closePopup();
  }
  
  function closePopup() {
      document.getElementById("popup").style.display = "none";
  }
  
  function updateCartDOM(cartItems) {
      var cart = document.getElementById("cart");
      cart.innerHTML = ""; // Limpa o carrinho para evitar duplicação de elementos
      cartItems.forEach(item => {
          var div = document.createElement('div');
          // Aqui você pode construir o elemento do carrinho com os dados do item
          // Por exemplo:
          div.textContent = `${item.productName} - ${item.color} - ${item.sizeText} - Quantidade: ${item.quantity}`;
          cart.appendChild(div);
      });
  }
  
  // Funções auxiliares setItemWithExpiry e getItemWithExpiry aqui
  
  function addCloseButtonToCart(clone) {
      console.log('Adicionando botão de fechar ao carrinho'); // Log para identificar se a função é chamada
      if (!clone.querySelector('.close-cart-button')) {
          console.log('Criando botão de fechar'); // Log para identificar se entrou na condição
          var closeButton = document.createElement('button');
          closeButton.innerHTML = 'X';
          closeButton.className = 'close-cart-button';
          closeButton.style.position = 'absolute';
          closeButton.style.top = '10px';
          closeButton.style.right = '10px';
          closeButton.style.zIndex = '1000';
          closeButton.addEventListener('click', function() {
              console.log('Botão de fechar clicado'); // Log para identificar se o evento de clique é acionado
              clone.style.display = 'none';
          });
  
          clone.appendChild(closeButton);
      } else {
          console.log('Botão de fechar já existe'); // Log para caso o botão já exista
      }
  }
  
  function updatePurchaseSummaries() {
      console.log('Atualizando resumo da compra'); // Log para identificar se a função é chamada
      var original = document.getElementById("purchaseSummary");
      var clone = document.getElementById("purchaseSummaryClone");
  
      if (clone) {
          console.log('Clonando o conteúdo do carrinho original'); // Log para identificar se entrou na condição
          clone.innerHTML = original.innerHTML;
          reassignEventListeners(clone);
  
          addCloseButtonToCart(clone);
      } else {
          console.log('Clone do carrinho não encontrado'); // Log para caso o clone não seja encontrado
      }
  }
  document.addEventListener('DOMContentLoaded', function() {
    addCloseButtonToPurchaseSummary();
  });
  
  function addCloseButtonToPurchaseSummary() {
    var purchaseSummary = document.getElementById('purchaseSummary');
    if (purchaseSummary && !purchaseSummary.querySelector('.close-purchase-summary')) {
        var closeButton = document.createElement('button');
        closeButton.innerHTML = 'X';
        closeButton.className = 'close-purchase-summary';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.zIndex = '1000';
        closeButton.style.display = 'none'; // Inicialmente escondido
        closeButton.addEventListener('click', function() {
            purchaseSummary.classList.remove("show-purchaseSummary");
            closeButton.style.display = 'none'; // Esconde o botão de fechar
        });
  
        purchaseSummary.appendChild(closeButton);
    }
  }
  
  
  
  // Outras funções como reassignEventListeners, removeFromCart, etc.
  
   
    function removeFromCart(e) {
      var t = e.target.parentNode,
        n = t.querySelector("span").innerText.match(/€(\d+(\.\d{1,2})?) \* (\d+) unid = €(\d+(\.\d{1,2})?)/),
        r = parseFloat(n[1]),
        o = parseInt(n[3]), // Declare 'o' before using it
        l = document.getElementById("total"),
        a = parseFloat(l.innerText),
        c = document.getElementById("cart");
      a -= r * o, l.innerText = a.toFixed(2), t.remove();
      itemsInCart -= o; // Now decrement 'itemsInCart' by 'o'
  
        // Aqui é a parte que remove o item do armazenamento local
    let E = JSON.parse(getItemWithExpiry("cart") || "[]");
    E.splice(E.indexOf(t.outerHTML), 1);
    setItemWithExpiry("cart", JSON.stringify(E));
        // Atualize ambos purchaseSummary e purchaseSummaryClone
        updatePurchaseSummaries();
    }
    
    window.addEventListener("resize", function () {
      let e;
      (initialViewportHeight - window.innerHeight) / initialViewportHeight * 100 > 20 ? document.body.classList.add("keyboard-open") : document.body.classList.remove("keyboard-open");
    }), document.addEventListener("click", e => {
      e.target.classList.contains("measure") && (selectedSize && selectedSize.classList.remove("selected"), e.target.classList.add("selected"), selectedSize = e.target);
    }), document.getElementById("popup-add").addEventListener("click", addToCartFromPopup);
    for (var colorButtons = document.getElementsByClassName("color"), i = 0; i < colorButtons.length; i++) colorButtons[i].addEventListener("click", openPopup);
    function closePopup() {
      document.getElementById("popup").style.display = "none";
    }
    var colorThreeButtons = document.getElementsByClassName("colorthree");
  for (var i = 0; i < colorThreeButtons.length; i++) {
      colorThreeButtons[i].addEventListener("click", openPopup);
  }
  var colorTwoButtons = document.getElementsByClassName("colortwo");
for (var i = 0; i < colorTwoButtons.length; i++) {
    colorTwoButtons[i].addEventListener("click", openPopup);
}

var colorLargeButtons = document.getElementsByClassName("color-large");
for (var i = 0; i < colorLargeButtons.length; i++) {
    colorLargeButtons[i].addEventListener("click", openPopup);
}

    function getCartItemsText() {
      var cartElements = document.getElementById("cart").children;
      var cartText = "";
      for (var i = 0; i < cartElements.length; i++) {
          let productInfo = cartElements[i].querySelector(".product-info").innerText;
          // We find the last line which contains the price calculation.
          let lastLineStart = productInfo.lastIndexOf("\n") + 1;
          let productText = productInfo.substring(0, lastLineStart);
          let productPriceLine = productInfo.substring(lastLineStart);
          // Now we can separate the price part to apply the bold effect
          let productPriceParts = productPriceLine.split("=");
          let productPrice = productPriceParts[0] + "=*" + productPriceParts[1].trim() + "*";
          cartText += productText + productPrice + "\n\n";
      }
      return cartText;
  }
  
    document.getElementById("popup-close").addEventListener("click", closePopup);
    document.getElementById("whatsappButton").addEventListener("click", function () {
      var cartText = getCartItemsText();
      var totalText = "Total: €" + document.getElementById("total").innerText;
      var freightText = "Frete: €" + freight.toFixed(2); // Assuming "freight" is a global variable
      var message = encodeURIComponent("Resumo da Compra:\n" + cartText + freightText + "\n" + totalText);
      var totalText = "*Total: €" + document.getElementById("total").innerText + "*";
      var freightText = "Frete: *€" + freight.toFixed(2) + "*"; // Assuming "freight" is a global variable
      var message = encodeURIComponent("*Resumo da Compra:*\n\n" + cartText + freightText + "\n\n" + totalText);
      window.open(`https://wa.me/393898986018?text=${message}`);
    });
  document.getElementById("copyButton").addEventListener("click", function () {
      var cartText = getCartItemsText();
      var totalText = "*Total: €" + document.getElementById("total").innerText + "*";
      var freightText = "Frete: *€" + freight.toFixed(2) + "*"; // Assuming "freight" is a global variable
      var copiedText = "*Resumo da Compra:*\n\n" + cartText + freightText + "\n\n" + totalText;
      navigator.clipboard.writeText(copiedText).then(() => {
          var copyConfirmation = document.getElementById("copiedText");
          copyConfirmation.innerText = "Copiado!";
          copyConfirmation.style.visibility = "visible";
          setTimeout(function () {
              copyConfirmation.style.visibility = "hidden";
          }, 3e3);
      }).catch(err => {
          console.error('Erro ao copiar texto: ', err);
      });
  });
  
    document.getElementById("clearCartButton").addEventListener("click", function () {
      if (confirm("Você deseja remover todos os produtos do carrinho?")) {
        var cart = document.getElementById("cart");
        while (cart.firstChild) {
          cart.firstChild.remove();
        }
        document.getElementById("total").innerText = freight.toFixed(2); // Define o total como o valor do frete
        localStorage.removeItem("cart");
        itemsInCart = 0; // Reset itemsInCart to 0
      }
    });  
    
    function setItemWithExpiry(key, value, ttl = 4 * 60 * 60 * 1000) {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
    function getItemWithExpiry(key) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    }
  // Listener para o botão do carrinho
  document.getElementById("cartButton").addEventListener("click", function() {
    var purchaseSummary = document.getElementById("purchaseSummary");
    var closeButton = purchaseSummary.querySelector('.close-purchase-summary');
    purchaseSummary.classList.toggle("show-purchaseSummary");
  
    // Alterar a visibilidade do botão de fechar com base na classe 'show-purchaseSummary'
    if (purchaseSummary.classList.contains('show-purchaseSummary')) {
        closeButton.style.display = 'block';
    } else {
        closeButton.style.display = 'none';
    }
  });
