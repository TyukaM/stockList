"use strict";

//* 在庫リスト・ショッピングリストの追加ボタンを押した後のポップアップ制御 *//

//* 追加ボタンを押した後にポップアップが開く *//
const item_add = document.getElementById("form_popup_open");
item_add.addEventListener("click", () => {
  const form_popup = document.getElementById("form_popup");
  form_popup.classList.add("open");
});

//* 入力フォーム画面の×ボタンを押した後にポップアップが閉じる *//
const close = document.getElementById("form_popup_close");
close.addEventListener("click", () => {
  const form_popup = document.getElementById("form_popup");
  form_popup.classList.remove("open");
});


//* 在庫リスト・ショッピングリストの追加ボタンを押した後の入力フォーム画面 *//

/* カテゴリ・数量・必要数のプルダウンリスト作成 */
function readSort(){
  // カテゴリ
  for(let i=0; i<category_list.length; i++){
    const category_opt = document.createElement("option");
    category_opt.value = category_list[i].txt;  //value値
    category_opt.text = category_list[i].txt;   //テキスト値
    document.getElementById("category").appendChild(category_opt);
  }

  // 数量(amount)
  for(let i=0; i<amount_list.length; i++){
    const amount_opt = document.createElement("option");
    amount_opt.value = amount_list[i].txt;  //value値
    amount_opt.text = amount_list[i].txt;   //テキスト値
    document.getElementById("amount").appendChild(amount_opt);
  }

  // 必要数(need)
  for(let i=1; i<amount_list.length; i++){
    const need_opt = document.createElement("option");
    need_opt.value = amount_list[i].txt;  //value値
    need_opt.text = amount_list[i].txt;   //テキスト値
    document.getElementById("need").appendChild(need_opt);
  }

  // 数量(quantity)
  for(let i=0; i<quantity_list.length; i++){
    const quantity_opt = document.createElement("option");
    quantity_opt.value = quantity_list[i].txt;  //value値
    quantity_opt.text = quantity_list[i].txt;   //テキスト値
    document.getElementById("quantity").appendChild(quantity_opt);
  }

};


/* 画像uファイルを読み込む */
let read_pic = document.getElementById("read_pic");
let img = document.getElementById("pic");

// ファイルを読み込んだ時に実行する
read_pic.addEventListener("change", function(pic){
  let file = pic.target.files; // fileの取得
  let reader = new FileReader();
  reader.readAsDataURL(file[0]); // fileの要素をdataURL形式で読み込む
 
  // ファイルを読み込んだ時に実行する
  reader.onload = function(){
   let dataUrl = reader.result; // 読み込んだファイルURL
   img.src = dataUrl;
  }
}, false);


/* 在庫数・在庫量の切り替え */
// 在庫数→在庫量
const amount_to_quantity = document.querySelector(".amount_to_quantity");
amount_to_quantity.addEventListener("click", () => {
  document.querySelector(".zaiko_quantity").classList.add("appear");
  document.querySelector(".zaiko_amount").classList.remove("appear");
  document.querySelector(".need_amount").classList.remove("appear");
});

// 在庫量→在庫数
const quantity_to_amount = document.querySelector(".quantity_to_amount");
quantity_to_amount.addEventListener("click", () => {
  document.querySelector(".zaiko_amount").classList.add("appear");
  document.querySelector(".need_amount").classList.add("appear");
  document.querySelector(".zaiko_quantity").classList.remove("appear");
});

/* フォームが送信されたら、その入力値を関数「renderStock」に渡して、「renderStock」を実行する */
document.querySelector("#add_form").addEventListener("submit", (e) => {
  e.preventDefault();
  const pic = document.querySelector("#add_form #pic");
  const category = document.querySelector("#add_form #category");
  const name = document.querySelector("#add_form #name");
  const amount = document.querySelector("#add_form #amount");
  const need = document.querySelector("#add_form #need");
  const quantity = document.querySelector("#add_form #quantity");
  const limit = document.querySelector("#add_form #limit");

  let stock;
  if (document.querySelector(".zaiko_amount").classList.contains("appear")) {
    stock = {
      id: Date.now(),
      pic:pic.src,
      category: category.value,
      name: name.value,
      amount: Number(amount.value),
      need: Number(need.value),
      limit: limit.value,
    };
  } else {
    stock = {
      id: Date.now(),
      pic:pic.src,
      category: category.value,
      name: name.value,
      quantity: quantity.value,
      limit: limit.value,
    };
  }

  /* IndexedDBにデータを追加する */
  request = indexedDB.open(db_name);

  // DBを開けなかった時の処理
  request.onerror = (event) => {
    alert("IndexedDBのデータ取得に失敗しました");
  };
  
  // DBを開けた時の処理
  request.onsuccess = (event) => {
    db = request.result;

    // トランザクションを開き、オブジェクトストアにアクセス
    const transaction = db.transaction([food_db], "readwrite");
    const objectStore = transaction.objectStore(food_db);

    // オブジェクトストアに「stock」を追加
    objectStore.put(stock);
  };

  /* ページをリロードする */
  window.location.reload(false);

});