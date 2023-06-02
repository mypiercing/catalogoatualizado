function openPopup(e) {
    var t = e.target.closest(".product"),
        n = e.target.getAttribute("data-color"),
        r = e.target.getAttribute("data-price"),
        o = document.getElementById("popup");
    o.getElementsByClassName("popup-product-name")[0].innerText = t.getElementsByClassName("product-name")[0].innerText, o.getElementsByClassName("popup-color")[0].innerText = n + ": €" + r;
    var l = t.getElementsByTagName("img")[0];
    document.getElementById("popup-product-image").src = l.src;
    for (var a = t.querySelectorAll('.sizes[data-color="' + n + '"] > .size'), d = o.getElementsByClassName("popup-sizes")[0]; d.firstChild;) d.removeChild(d.firstChild);
    for (var s = 0; s < a.length; s++) {
        for (var p = a[s].cloneNode(!0), c = p.querySelectorAll(".measure-container .measure"), m = 0; m < c.length; m++) {
            var u = c[m].nextSibling;
            if (!u || "input" !== u.nodeName.toLowerCase()) {
                var y = document.createElement("input");
                y.type = "number", y.min = "0", y.className = "measure-quantity", c[m].parentNode.insertBefore(y, c[m].nextSibling)
            }
        }
        d.appendChild(p)
    }
    o.style.display = "block"
}
let freight = 21.0;  // define o valor do frete

let selectedSize = null,
    initialViewportHeight = window.innerHeight;
let itemsInCart = 0;



window.addEventListener("DOMContentLoaded", e => {
    let cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    let total = 0;
    let expirationTime = 4 * 60 * 60 * 1000;  // 4 horas

    cartItems = cartItems.filter(item => {
        // Remove itens do carrinho que foram adicionados há mais de uma semana
        if (new Date().getTime() - item.date > expirationTime) {
            return false;
        }
        return true;
    });

    itemsInCart = cartItems.length;  // Modificado aqui

    function t() {
        // Restante do seu código...
    }

    document.getElementById("welcomePopup").style.display = "flex", document.body.style.overflow = "hidden", document.getElementById("individualButton").addEventListener("click", function() {
        t(), document.getElementById("welcomePopup").style.display = "none", document.body.style.overflow = ""
    }), document.getElementById("businessButton").addEventListener("click", function() {
        document.getElementById("welcomePopup").style.display = "none", document.body.style.overflow = ""
    });

    if (itemsInCart > 0) {
        let l = document.getElementById("cart");
        for (let item of cartItems) {
            let d = document.createElement("div");
            d.innerHTML = item.item;
            let s = d.firstChild;
            s.querySelector("button").addEventListener("click", removeFromCart), l.appendChild(s);
            total += parseFloat(s.querySelector(".product-info > span").innerText.match(/€(\d+(\.\d{1,2})?) \* (\d+) unid = €(\d+(\.\d{1,2})?)/)[4]);
        }

        total += freight;  // adiciona o valor do frete ao total a cada vez que a página é carregada
        document.getElementById("total").innerText = total.toFixed(2);
    } else {
        // se o carrinho está vazio, o total deve ser o valor do frete
        document.getElementById("total").innerText = freight.toFixed(2);
    }

    // Atualize o localStorage após a limpeza
    localStorage.setItem("cart", JSON.stringify(cartItems));
});





    
function addToCartFromPopup() {
    var f = parseFloat(document.getElementById("total").innerText);

    for (var e = document.getElementById("popup"), t = e.querySelector(".popup-product-name").innerText, n = e.querySelector(".popup-color").innerText.split(":")[0].trim(), r = e.querySelector(".popup-product-image").src, o = e.querySelectorAll(".measure"), l = 0; l < o.length; l++) {
        var a = parseFloat(o[l].getAttribute("data-price")),
            d = parseInt(o[l].nextElementSibling.value, 10);
        if (d > 0) {
            var s = o[l].innerText,
                p = o[l].closest(".size").querySelector("h4").innerText,
                c = document.getElementById("cart"),
                m = document.createElement("p"),
                u = document.createElement("img");
            u.src = r, m.appendChild(u);
            var y = document.createElement("span");
            y.className = "product-info", y.innerText = t + " " + n + " | " + p + " " + s;
            var g = document.createElement("span");
            g.innerText = "€" + a.toFixed(2) + " * " + d + " unid = €" + (a * d).toFixed(2), y.appendChild(document.createElement("br")), y.appendChild(g), m.appendChild(y);
            var v = document.createElement("button");
            v.innerText = "X", v.addEventListener("click", removeFromCart), m.appendChild(v), c.appendChild(m);

            let E = JSON.parse(localStorage.getItem("cart") || "[]");
            E.push({ item: m.outerHTML, date: new Date().getTime() });  // Adiciona a data e a hora em que o item foi adicionado
            localStorage.setItem("cart", JSON.stringify(E));

            var x = document.getElementById("total");

            f += a * d;

            // se o carrinho estava vazio antes de adicionar o item, adicione o valor do frete ao total
            if (itemsInCart === 0) {
                f += 0;
            }
            itemsInCart++;  // incrementa o contador de itens
            x.innerText = f.toFixed(2);
            var B = document.createElement("div");
            B.style.position = "absolute", B.style.top = "0", B.style.left = "10px", B.style.color = "white", B.style.padding = "5px", B.style.zIndex = "100", B.className = "added-banner", B.innerText = "Adicionado";
            var h = document.querySelector(`img[src="${r}"]`).closest(".product");
            h.style.position = "relative", h.appendChild(B);
        }
    }
    closePopup()
}


function removeFromCart(e) {
    itemsInCart--;  // decrementa o contador de itens
    var t = e.target.parentNode,
        n = t.querySelector("span").innerText.match(/€(\d+(\.\d{1,2})?) \* (\d+) unid = €(\d+(\.\d{1,2})?)/),
        r = parseFloat(n[1]),
        o = parseInt(n[3]),
        l = document.getElementById("total"),
        a = parseFloat(l.innerText) - freight, // subtract freight before calculating the new total
        c = document.getElementById("cart");

    // subtract the value of the item from the total
    a -= r * o;
    t.remove();

    // Remove the item from the cart in localStorage
    let cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    cartItems = cartItems.filter(item => item.item !== t.outerHTML);
    localStorage.setItem("cart", JSON.stringify(cartItems));

    // if all items are removed from the cart, the total should be the freight value
    if (itemsInCart === 0) {
        l.innerText = freight.toFixed(2);
    } else {
        l.innerText = (a + freight).toFixed(2);
    }
}



    
window.addEventListener("resize", function() {
    let e;
    (initialViewportHeight - window.innerHeight) / initialViewportHeight * 100 > 20 ? document.body.classList.add("keyboard-open") : document.body.classList.remove("keyboard-open")
}), document.addEventListener("click", e => {
    e.target.classList.contains("measure") && (selectedSize && selectedSize.classList.remove("selected"), e.target.classList.add("selected"), selectedSize = e.target)
}), document.getElementById("popup-add").addEventListener("click", addToCartFromPopup);
for (var colorButtons = document.getElementsByClassName("color"), i = 0; i < colorButtons.length; i++) colorButtons[i].addEventListener("click", openPopup);

function closePopup() {
    document.getElementById("popup").style.display = "none"
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
document.getElementById("whatsappButton").addEventListener("click", function() {
    var cartText = getCartItemsText();
    var totalText = "*Total: €" + document.getElementById("total").innerText + "*";
    var freightText = "Frete: *€" + freight.toFixed(2) + "*"; // Assuming "freight" is a global variable
    var message = encodeURIComponent("*Resumo da Compra:*\n\n" + cartText + freightText + "\n\n" + totalText);
    window.open(`https://wa.me/393898986018?text=${message}`);
});
document.getElementById("copyButton").addEventListener("click", function() {
    var cartText = getCartItemsText();
    var totalText = "*Total: €" + document.getElementById("total").innerText + "*";
    var freightText = "Frete: *€" + freight.toFixed(2) + "*"; // Assuming "freight" is a global variable
    var copiedText = document.createElement("textarea");
    copiedText.style = "position: absolute; left: -1000px; top: -1000px";
    copiedText.value = "*Resumo da Compra:*\n\n" + cartText + freightText + "\n\n" + totalText;
    document.body.appendChild(copiedText);
    copiedText.select();
    document.execCommand("copy");
    document.body.removeChild(copiedText);
    var copyConfirmation = document.getElementById("copiedText");
    copyConfirmation.innerText = "Copiado!";
    copyConfirmation.style.visibility = "visible";
    setTimeout(function() {
        copyConfirmation.style.visibility = "hidden";
    }, 3e3);
});

document.getElementById("clearCartButton").addEventListener("click", function() {
    if (confirm("Você deseja remover todos os produtos do carrinho?")) {
        var cart = document.getElementById("cart");
        while (cart.firstChild) {
            cart.firstChild.remove();
        }
        document.getElementById("total").innerText = "0";
        localStorage.removeItem("cart");
    }
});
