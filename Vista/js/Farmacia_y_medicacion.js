// === Sesión (opcional) si vienes de tu login con localStorage ===
    const STORAGE_SESSION = "technopets_session";

    function getUserFromSession(){
      try{
        const s = JSON.parse(localStorage.getItem(STORAGE_SESSION));
        if(s && s.loggedIn && s.user) return s.user;
      }catch(e){}
      return null;
    }

    // === Datos DEMO (cliente) ===
    const today = new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});

    const recetas = [
      { med:"Amoxicilina 500mg", pres:"Tableta", dosis:"1 tableta", freq:"Cada 12 horas", dias:7, nota:"Dar con alimento." },
      { med:"Vitaminas (suplemento)", pres:"Gotas", dosis:"10 gotas", freq:"Cada 24 horas", dias:14, nota:"No mezclar con calcio." }
    ];

    const catalogo = [
      { name:"Antipulgas (pipeta)", price: 28000, tag:"Perros/Gatos" },
      { name:"Shampoo medicado", price: 35000, tag:"Cuidado piel" },
      { name:"Vitaminas y minerales", price: 22000, tag:"Suplemento" },
      { name:"Protector gástrico", price: 18000, tag:"Digestivo" }
    ];

    let cart = []; // {name, price, qty}

    // === Render Recetas ===
    function renderRx(){
      const box = document.getElementById("rxList");
      box.innerHTML = recetas.map((r, idx)=>`
        <div class="item">
          <div style="min-width:0">
            <strong>${r.med}</strong>
            <div class="muted" style="font-size:.86rem">
              ${r.pres} · <b>${r.dosis}</b> · ${r.freq} · ${r.dias} días
              <br>📝 ${r.nota || "—"}
            </div>
          </div>
          <span class="tag">Receta #${idx+1}</span>
        </div>
      `).join("");
    }

    // === Render Catálogo (venta libre) ===
    function renderCatalog(){
      const q = (document.getElementById("search").value || "").toLowerCase().trim();
      const list = document.getElementById("catalog");
      const filtered = catalogo.filter(p => p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
      list.innerHTML = filtered.map(p=>`
        <div class="item">
          <div style="min-width:0">
            <strong>${p.name}</strong>
            <div class="muted" style="font-size:.86rem">${p.tag}</div>
          </div>
          <div style="text-align:right">
            <div class="price">$${p.price.toLocaleString("es-CO")}</div>
            <div class="btn-row" style="margin-top:8px;justify-content:flex-end">
              <button class="mini mini-orange" onclick="addToCart('${escapeQuotes(p.name)}', ${p.price})">➕ Agregar</button>
            </div>
          </div>
        </div>
      `).join("") || `<p class="muted">No se encontraron productos.</p>`;
    }

    function escapeQuotes(s){ return String(s).replace(/'/g,"\\'"); }

    // === Carrito ===
    function addToCart(name, price){
      const item = cart.find(x=>x.name===name);
      if(item) item.qty++;
      else cart.push({name, price, qty:1});
      renderCart();
      recalc();
    }

    function removeFromCart(i){
      cart.splice(i,1);
      renderCart();
      recalc();
    }

    function changeQty(i, val){
      const qty = Math.max(1, parseInt(val||"1",10));
      cart[i].qty = qty;
      recalc();
    }

    function renderCart(){
      const body = document.getElementById("cartBody");
      if(!cart.length){
        body.innerHTML = `<tr><td colspan="4" class="muted" style="padding:16px;text-align:center">Carrito vacío</td></tr>`;
        return;
      }
      body.innerHTML = cart.map((c,i)=>`
        <tr>
          <td><strong>${c.name}</strong><div class="muted" style="font-size:.78rem">$${c.price.toLocaleString("es-CO")} c/u</div></td>
          <td>
            <input type="number" min="1" value="${c.qty}" style="width:72px"
              onchange="changeQty(${i}, this.value)">
          </td>
          <td class="price">$${(c.price*c.qty).toLocaleString("es-CO")}</td>
          <td><button class="xbtn" onclick="removeFromCart(${i})">✕</button></td>
        </tr>
      `).join("");
    }

    function recalc(){
      const subtotal = cart.reduce((a,c)=>a + c.price*c.qty, 0);
      const shipMode = document.getElementById("ship").value;
      const service = shipMode === "delivery" ? 8000 : 0;
      const iva = Math.round((subtotal + service) * 0.19);
      const total = subtotal + service + iva;

      document.getElementById("sub").textContent = "$" + subtotal.toLocaleString("es-CO");
      document.getElementById("serv").textContent = "$" + service.toLocaleString("es-CO");
      document.getElementById("iva").textContent = "$" + iva.toLocaleString("es-CO");
      document.getElementById("total").textContent = "$" + total.toLocaleString("es-CO");
    }

    function clearCart(){
      cart = [];
      renderCart();
      recalc();
    }

    // === Reposición de recetas (demo) ===
    function requestRefill(){
      alert("✅ Solicitud enviada (demo). La clínica confirmará disponibilidad y precio.");
    }

    // === Checkout (demo) ===
    function checkout(){
      if(!cart.length){
        alert("⚠️ Tu carrito está vacío. Agrega un producto antes de finalizar.");
        return;
      }
      openModal("mFactura");
    }

    // === Factura ===
    function renderInvoice(){
      const user = getUserFromSession() || "Cliente";
      document.getElementById("fCliente").textContent = user;
      document.getElementById("fFecha").textContent = today;

      const shipMode = document.getElementById("ship").value;
      document.getElementById("fEntrega").textContent =
        shipMode === "delivery" ? "Envío a domicilio" : "Recoger en clínica";

      const note = (document.getElementById("note").value || "").trim();
      document.getElementById("fNota").textContent = note ? note : "—";

      const tbody = document.getElementById("fItems");
      if(!cart.length){
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#999;padding:12px">Sin ítems</td></tr>`;
      } else {
        tbody.innerHTML = cart.map(c=>`
          <tr>
            <td>${c.name}</td>
            <td>${c.qty}</td>
            <td>$${c.price.toLocaleString("es-CO")}</td>
            <td>$${(c.price*c.qty).toLocaleString("es-CO")}</td>
          </tr>
        `).join("");
      }

      const subtotal = cart.reduce((a,c)=>a + c.price*c.qty, 0);
      const service = shipMode === "delivery" ? 8000 : 0;
      const iva = Math.round((subtotal + service) * 0.19);
      const total = subtotal + service + iva;

      document.getElementById("fIva").textContent = "$" + iva.toLocaleString("es-CO");
      document.getElementById("fTotal").textContent = "$" + total.toLocaleString("es-CO");
    }

    // === Modales ===
    function openModal(id){
      if(id==="mFactura") renderInvoice();
      document.getElementById(id).classList.add("show");
    }
    function closeModal(id){
      document.getElementById(id).classList.remove("show");
    }
    function overlayClose(e, id){
      if(e.target.id === id) closeModal(id);
    }

    // === Init ===
    (function init(){
      const u = getUserFromSession();
      document.getElementById("who").textContent = "👤 Cliente: " + (u || "—");

      renderRx();
      renderCatalog();
      renderCart();
      recalc();
    })();
