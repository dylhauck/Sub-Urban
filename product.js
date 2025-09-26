// product.js — dynamic PDP (swap images on color change), simple wishlist/add-to-bag toasts

// ---- Product data ---------------------------------------------------------
const PRODUCTS = {
  "aurora-set": {
    id: "aurora-set",
    title: "Aurora Satin Set",
    price: 129,
    sku: "SUB-AUR-001",
    note: "Limited drop. Rose-Gold & Teal available.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: {
      "Rose-Gold": {
        swatch: "#B76E79",
        images: [
          "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1520976005265-3b5c3a621b83?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1543862470-d4c43e9d5b09?q=80&w=1600&auto=format&fit=crop"
        ]
      },
      "Teal": {
        swatch: "#14B8A6",
        images: [
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519744352450-63228bd3b9fb?q=80&w=1600&auto=format&fit=crop"
        ]
      }
    },
    bullets: [
      "Satin two-piece with silver piping",
      "Hidden side zip, adjustable straps",
      "True to size; size up for more ease"
    ],
    related: ["neon-violet-slip", "teal-rib-top", "holo-skirt"]
  },

  "neon-violet-slip": {
    id: "neon-violet-slip",
    title: "Neon Violet Slip",
    price: 98,
    sku: "SUB-NVS-002",
    note: "Electric violet with metallic sheen.",
    sizes: ["XS","S","M","L"],
    colors: {
      "Violet": {
        swatch: "#7C3AED",
        images: [
          "https://images.unsplash.com/photo-1549216962-9f7b6ac7f8a9?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1532444458054-3d8b1fefb5d8?q=80&w=1600&auto=format&fit=crop"
        ]
      }
    },
    bullets: [
      "Bias-cut for fluid drape",
      "Adjustable straps, midi length",
      "Fully lined"
    ],
    related: ["aurora-set", "holo-skirt"]
  },

  "teal-rib-top": {
    id: "teal-rib-top",
    title: "Teal Ribbed Top",
    price: 54,
    sku: "SUB-TRT-003",
    note: "Cooling teal, second-skin rib knit.",
    sizes: ["XS","S","M","L","XL"],
    colors: {
      "Teal": {
        swatch: "#14B8A6",
        images: [
          "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
        ]
      }
    },
    bullets: [
      "Ultra-stretch rib knit",
      "Mock neck, cropped length",
      "Machine wash cold"
    ],
    related: ["aurora-set", "neo-bomber"]
  },

  "silver-parka": {
    id: "silver-parka",
    title: "Silver Tech Parka",
    price: 189,
    sku: "SUB-STP-004",
    note: "Weather-proof shell with silver finish.",
    sizes: ["S","M","L","XL"],
    colors: {
      "Silver": {
        swatch: "#C0C0C0",
        images: [
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1600&auto=format&fit=crop"
        ]
      }
    },
    bullets: [
      "Wind & rain resistant",
      "Detachable hood, chrome hardware",
      "Interior tech pockets"
    ],
    related: ["holo-skirt", "neo-bomber"]
  },

  "holo-skirt": {
    id: "holo-skirt",
    title: "Holographic Midi Skirt",
    price: 79,
    sku: "SUB-HLS-005",
    note: "Iridescent silver that catches every light.",
    sizes: ["XS","S","M","L"],
    colors: {
      "Silver": {
        swatch: "#C0C0C0",
        images: [
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1543862470-d4c43e9d5b09?q=80&w=1600&auto=format&fit=crop"
        ]
      }
    },
    bullets: [
      "Iridescent finish, midi length",
      "Back slit, invisible zip",
      "Fully lined"
    ],
    related: ["silver-parka", "neon-violet-slip"]
  },

  "neo-bomber": {
    id: "neo-bomber",
    title: "Neo Bomber Jacket",
    price: 139,
    sku: "SUB-NBJ-006",
    note: "Matte violet paneling, chrome zip hardware.",
    sizes: ["S","M","L","XL"],
    colors: {
      "Violet": {
        swatch: "#7C3AED",
        images: [
          "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
        ]
      }
    },
    bullets: [
      "Padded body, rib cuffs",
      "Two-way zipper",
      "Hand wash"
    ],
    related: ["teal-rib-top", "aurora-set"]
  },

  "teal-wrap-dress": {
    id: "teal-wrap-dress",
    title: "Teal Wrap Dress",
    price: 119,
    sku: "SUB-TWD-007",
    note: "Fluid satin wrap in signature teal.",
    sizes: ["XS","S","M","L","XL"],
    colors: {
      "Teal": {
        swatch: "#14B8A6",
        images: [
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519744352450-63228bd3b9fb?q=80&w=1600&auto=format&fit=crop"
        ]
      }
    },
    bullets: [
      "Adjustable tie waist",
      "V-neck, midi length",
      "Lightweight satin"
    ],
    related: ["neon-violet-slip", "aurora-set"]
  }
};

// ---- Helpers --------------------------------------------------------------
const $ = (sel, root=document) => root.querySelector(sel);
function el(tag, attrs={}, children=[]) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === "style" && typeof v === "object") Object.assign(n.style, v);
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
    else if (k === "dataset") Object.assign(n.dataset, v);
    else n.setAttribute(k, v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c == null) return;
    n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return n;
}
function toast(msg){
  const t = el('div', { class:'toast' }, msg);
  document.body.appendChild(t);
  requestAnimationFrame(()=>{ t.style.opacity=1; t.style.transform='translateX(-50%)'; });
  setTimeout(()=>{ t.style.opacity=0; }, 1400);
  setTimeout(()=>{ t.remove(); }, 1800);
}

// ---- Render PDP -----------------------------------------------------------
const params = new URLSearchParams(location.search);
const productId = params.get('id') || 'aurora-set';
const product = PRODUCTS[productId];

const mainImg = $("#pdpMain");
const thumbs  = $("#pdpThumbs");
const titleEl = $("#pdpTitle");
const priceEl = $("#pdpPrice");
const skuEl   = $("#pdpSku");
const noteEl  = $("#pdpNote");
const swatches= $("#pdpSwatches");
const sizesEl = $("#pdpSizes");
const crumb   = $("#crumbName");
const bulletsList = $("#pdpBullets");

if (!product){
  $("#pdpRoot").innerHTML = `<p>Sorry, this product was not found. <a href="index.html#collection">Back to collection</a></p>`;
  throw new Error("Product not found");
}

titleEl.textContent = product.title;
priceEl.textContent = `$${product.price}`;
skuEl.textContent   = product.sku;
noteEl.textContent  = product.note || noteEl.textContent;
crumb.textContent   = product.title;

// bullets
if (product.bullets?.length){
  bulletsList.innerHTML = "";
  product.bullets.forEach(b => bulletsList.appendChild(el("li", {}, b)));
}

// default color = first key
const colorNames = Object.keys(product.colors);
let selectedColor = colorNames[0];
let selectedSize = product.sizes?.[0] || null;

// sizes radios
sizesEl.innerHTML = "";
(product.sizes || []).forEach(sz=>{
  const id = `size_${sz}`;
  const input = el("input", { type:"radio", name:"size", id, value:sz, ...(sz===selectedSize?{checked:""}:{}) });
  const label = el("label", { for:id }, sz);
  sizesEl.appendChild(input);
  sizesEl.appendChild(label);
});
sizesEl.addEventListener('change', (e)=>{
  if (e.target.name === 'size') selectedSize = e.target.value;
});

// swatches
function renderSwatches(){
  swatches.innerHTML = "";
  colorNames.forEach(name=>{
    const c = product.colors[name];
    const s = el("button", {
      class:"swatch",
      type:"button",
      title:name,
      "aria-label":name,
      style:{ background: c.swatch, borderColor: "rgba(0,0,0,.12)" }
    });
    if (name === selectedColor) s.style.outline = "3px solid rgba(0,0,0,.15)";
    s.addEventListener('click', ()=>{
      selectedColor = name;
      renderSwatches();
      renderImages();
    });
    swatches.appendChild(s);
  });
}

// thumbs + main image for current color
function renderImages(){
  const imgs = product.colors[selectedColor].images;
  mainImg.src = imgs[0];
  mainImg.alt = `${product.title} in ${selectedColor}`;
  thumbs.innerHTML = "";
  imgs.forEach((src, i)=>{
    const btn = el("button", { class:"thumb", type:"button" }, el("img", { src, alt:`${product.title} image ${i+1}` }));
    btn.addEventListener('click', ()=>{ mainImg.src = src; });
    thumbs.appendChild(btn);
  });
}

renderSwatches();
renderImages();

// ---- Wishlist & Add to bag (lightweight demo) -----------------------------
$("#addToWishlist")?.addEventListener("click", ()=>{
  try {
    const key = "wishlist_local";
    const entry = { id: product.id, title: product.title, price: product.price, color: selectedColor, size: selectedSize, ts: Date.now() };
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = arr.find(i => i.id === entry.id && i.color === entry.color && i.size === entry.size);
    if (!exists) arr.push(entry);
    localStorage.setItem(key, JSON.stringify(arr));
    toast("Added to wishlist");
  } catch(e){ console.warn(e); toast("Could not add to wishlist"); }
});

$("#addToBag")?.addEventListener("click", ()=>{
  toast(`Added ${selectedSize || ""} ${selectedColor} to bag`);
});

// ---- Related (simple cards using same style) ------------------------------
const relatedWrap = document.getElementById("relatedGrid");
if (relatedWrap && product.related?.length){
  product.related.forEach(id=>{
    const p = PRODUCTS[id];
    if (!p) return;
    const firstColor = Object.keys(p.colors)[0];
    const img = p.colors[firstColor].images[0];
    const card = el("article", { class:"card" }, [
      el("a", { href:`product.html?id=${p.id}`, "aria-label":`View ${p.title}` }, el("img", { src: img, alt: `${p.title}` })),
      el("div", { class:"card-body" }, [
        el("h3", {}, p.title),
        el("p", { class:"price" }, `$${p.price}`),
        el("p", { class:"desc" }, p.note || ""),
        el("div", { class:"card-actions" }, [
          el("a", { class:"btn outline", href:`product.html?id=${p.id}` }, "View details"),
          el("button", { class:"btn ghost", type:"button", onclick:()=>toast("Added to wishlist") }, "♡ Wishlist")
        ])
      ])
    ]);
    relatedWrap.appendChild(card);
  });
}
