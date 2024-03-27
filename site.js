function openPopup(e) {
  var t = e.target.closest(".product"),
      n = e.target.getAttribute("data-color"),
      r = e.target.getAttribute("data-price"),
      o = document.getElementById("popup");

  o.getElementsByClassName("popup-product-name")[0].innerText = t.getElementsByClassName("product-name")[0].innerText;
  o.getElementsByClassName("popup-color")[0].innerText = n + ": € " + r;

  var l = t.getElementsByTagName("img")[0];
  document.getElementById("popup-product-image").src = l.src;

  var d = o.getElementsByClassName("popup-sizes")[0];

  while (d.firstChild) {
    d.removeChild(d.firstChild);
  }

  var productPopupTitleElement = t.querySelector(".popup-title");
  var existingPopupTitle = o.querySelector(".popup-title");
  if (productPopupTitleElement) {
    if (!existingPopupTitle) {
      existingPopupTitle = document.createElement("h4");
      existingPopupTitle.className = "popup-title";
    }
    existingPopupTitle.innerText = productPopupTitleElement.innerText;

    var popupHeader = o.querySelector('.popup-header');
    if (popupHeader) {
      popupHeader.parentNode.insertBefore(existingPopupTitle, popupHeader.nextSibling);
    } else {
      o.insertBefore(existingPopupTitle, o.firstChild);
    }
  }

  var a = t.querySelectorAll('.sizes[data-color="' + n + '"] > .size');
  for (var s = 0; s < a.length; s++) {
    var p = a[s].cloneNode(true);

    // Remove duplicated <h4 class="detail"> if exists
    var detailElements = p.getElementsByClassName("detail");
    while(detailElements.length > 1) {
      detailElements[1].parentNode.removeChild(detailElements[1]);
    }

    var c = p.querySelectorAll(".measure-container .measure");
    for (var m = 0; m < c.length; m++) {
      var measureContainer = c[m].parentNode;
      var existingInput = measureContainer.querySelector(".measure-quantity");
      if (existingInput) {
        measureContainer.removeChild(existingInput);
      }

      var controlsContainer = document.createElement("div");
      controlsContainer.className = "controls";

      var decreaseButton = document.createElement("button");
      decreaseButton.innerText = "-";
      decreaseButton.className = "decrease-button";
      decreaseButton.addEventListener("click", function(event) {
        let inputElement = event.target.parentNode.querySelector(".measure-quantity");
        let currentValue = parseInt(inputElement.value, 10);
        if (isNaN(currentValue)) {
          currentValue = 0;
        }
        if (currentValue > 0) {
          inputElement.value = currentValue - 1;
        }
      });

      var increaseButton = document.createElement("button");
      increaseButton.innerText = "+";
      increaseButton.className = "increase-button";
      increaseButton.addEventListener("click", function(event) {
        let inputElement = event.target.parentNode.querySelector(".measure-quantity");
        let currentValue = parseInt(inputElement.value, 10);
        if (isNaN(currentValue)) {
          currentValue = 0;
        }
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

  var sizeCount = d.getElementsByClassName("size").length;
  if (sizeCount > 3) {
    d.style.justifyContent = 'flex-start';
  } else {
    d.style.justifyContent = 'center';
  }

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
      var color = popup.querySelector(".popup-color").innerText.split(":")[0].trim();
      var productImage = popup.querySelector(".popup-product-image").src;
      var measures = popup.querySelectorAll(".measure");
    
      // Inicialize cartItems como um array vazio
      let cartItems = JSON.parse(getItemWithExpiry("cart") || "[]");
    
      for (var i = 0; i < measures.length; i++) {
        var price = parseFloat(measures[i].getAttribute("data-price"));
        // Ajustar a maneira de obter a quantidade
        var quantityInput = measures[i].parentNode.querySelector(".measure-quantity");
        var quantity = parseInt(quantityInput.value, 10);
    
        if (quantity > 0) {
            var sizeText = measures[i].innerText;
            // Ajuste para garantir que o nome do tamanho venha do <h4> correto (sem a classe "detail")
            var sizeContainers = measures[i].closest(".size").querySelectorAll("h4");
            var sizeName = sizeContainers.length > 1 ? sizeContainers[1].innerText : sizeContainers[0].innerText;
    
            // Encontrar o índice do produto existente, se houver
            var existingIndex = cartItems.findIndex(p => {
                var div = document.createElement('div');
                div.innerHTML = p;
                return div.firstChild.querySelector(".product-info").innerText.includes(productName + " " + color + " | " + sizeName + " " + sizeText);
            });
    
            if (existingIndex >= 0) {
                // Atualizar a quantidade e remover o item existente do array cartItems
                var div = document.createElement('div');
                div.innerHTML = cartItems[existingIndex];
                var existingQty = parseInt(div.firstChild.querySelector(".product-info > span").innerText.split("*")[1].split("unid")[0].trim());
                
                // Atualizar o totalValue de acordo com a quantidade anterior
                totalValue -= price * existingQty;
    
                quantity += existingQty;
                cartItems.splice(existingIndex, 1);
            }
    
            // Atualizar o totalValue de acordo com a nova quantidade
            totalValue += price * quantity;
    
            var productElement = document.createElement("p");
            var imgElement = document.createElement("img");
            imgElement.src = productImage;
            productElement.appendChild(imgElement);
    
            var productInfo = document.createElement("span");
            productInfo.className = "product-info";
            productInfo.innerText = productName + " " + color + " | " + sizeName + " " + sizeText;
            var productPrice = document.createElement("span");
            productPrice.innerText = "€" + price.toFixed(2) + " * " + quantity + " unid = €" + (price * quantity).toFixed(2);
            productInfo.appendChild(document.createElement("br"));
            productInfo.appendChild(productPrice);
            productElement.appendChild(productInfo);
    
            var removeButton = document.createElement("button");
            removeButton.innerText = "X";
            removeButton.addEventListener("click", removeFromCart);
            productElement.appendChild(removeButton);
    
            // Adicionar o novo elemento ao array cartItems
            cartItems.push(productElement.outerHTML);
            
            var cartButton = document.getElementById("cartButton");
            cartButton.classList.add("yellow");
        
            // Remover a classe amarela após 2 segundos
            setTimeout(() => {
                cartButton.classList.remove("yellow");
            }, 1200); // 2 segundos
        }
      }
    
      // Atualize o localStorage e o carrinho no DOM
      document.getElementById("total").innerText = totalValue.toFixed(2);
      setItemWithExpiry("cart", JSON.stringify(cartItems));
      
      var cart = document.getElementById("cart");
      cart.innerHTML = "";  // Limpa o carrinho para evitar duplicação de elementos
      for (var i = 0; i < cartItems.length; i++) {
          var div = document.createElement('div');
          div.innerHTML = cartItems[i];
          div.firstChild.querySelector("button").addEventListener("click", removeFromCart);
          cart.appendChild(div.firstChild);
      }
      // Adicionando a mensagem "Adicionado"
      var B = document.createElement("div");
      B.style.position = "absolute";
      B.style.top = "0";
      B.style.left = "10px";
      B.style.color = "white";
      B.style.padding = "5px";
      B.style.zIndex = "100";
      B.className = "added-banner";
      B.innerText = "Adicionado";
    
      var h = document.querySelector(`img[src="${productImage}"]`).closest(".product");
      h.style.position = "relative";
      h.appendChild(B);
      closePopup();
    }
    
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
      // Encontramos a última linha que contém o cálculo do preço.
      let lastLineStart = productInfo.lastIndexOf("\n") + 1;
      let productText = productInfo.substring(0, lastLineStart);
      let productPriceLine = productInfo.substring(lastLineStart);
      // Agora podemos separar a parte do preço para aplicar o efeito de negrito
      let productPriceParts = productPriceLine.split("=");
      // Adiciona um espaço entre o "=" e o "*" para a formatação do WhatsApp
      let productPrice = productPriceParts[0] + "= *" + productPriceParts[1].trim() + "*";

      // Adiciona emoticons específicos após as palavras-chave
      productText = productText.replace("Natural", "\nNatural ⬜");
      productText = productText.replace("Gold", "\nGold 🟨");
      productText = productText.replace("Black", "\nBlack ⬛");

      cartText += productText + productPrice + "\n~--------------------------------------~\n"; // Adiciona a linha divisória após cada produto
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
      window.open(`https://wa.me/5511989174080?text=${message}`);
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
