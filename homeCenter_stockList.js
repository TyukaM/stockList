"use strict";

//* 「ホームセンター」在庫リスト画面 *//

/* カテゴリを作成 */
home_center_category_list.forEach( category => {

  const dt = document.createElement("dt");
  dt.textContent = category.txt;

  const div = document.createElement("div");
  div.appendChild(dt);
  div.id = category.txt;

  document.querySelector("#home_center_stocks").appendChild(div);
});


/* dtがクリックされたら、dtの親要素(div)に
	close要素を追加する */
const dts = document.querySelectorAll("dt");

dts.forEach(dt => {
  dt.addEventListener("click", () => {
    dt.parentNode.classList.toggle("close");
  });
});

/* 関数「getStocksData」：IndexedDBのデータを、web上に表示するための関数 */
function getStocksData() {
  request = indexedDB.open(db_name); // DBを開く

  // DBを開けなかった時、エラーメッセージを表示する
  request.onerror = () => {
    alert("IndexedDBのデータ取得に失敗しました");
  };

  // DBを開けた時
  request.onsuccess = (event) => {
    db = event.target.result;

    // トランザクションを開き、オブジェクトストアにアクセス
    const stocks_ObjectStore = db
    .transaction([homeCenter_db],"readonly")
    .objectStore(homeCenter_db)
    .index("category");
  
    // IndexedDBのデータを取得する
    const get_data = stocks_ObjectStore.getAll();
    
    // データ取得に成功した時、配列「stocks」にIndexedDBのデータを格納
    get_data.onsuccess = (data) => {
      const stocks = data.target.result;

      /* 関数「createStocksList」
        ：ローカルストレージのデータリスト「stocks」を関数「createStock」に渡して、HTMLに反映させる関数 */
      const createStocksList = () => {
        stocks.forEach((stock) => {
          createStockList(stock);
        });
      };
      
      /* 関数「createStocks」を実行 */
      createStocksList();
    };

    // 取得に失敗した時、エラーメッセージを表示する
    get_data.onerror = () => {
      alert("IndexedDBのデータ取得に失敗しました");
    };
  };
};

// 関数を実行
getStocksData();


/* 関数「createStockList」：HTMLにtable要素を作成する関数 */
const createStockList = (stock) => {

  // 画像を作成
  const item_pic = document.createElement("img");
  item_pic.className = "pic";

  if (stock.pic !== "") {
    item_pic.src = stock.pic;

    //* 画像を押した後にポップアップが開く *//
    item_pic.addEventListener("click", () => {
      const pic_popup = document.getElementById("pic_popup");
      document.getElementById("pic_src").src = stock.pic;
      pic_popup.classList.add("open");
    });

    //* 画像ポップアップの×ボタンを押した後にポップアップが閉じる *//
    const close = document.getElementById("pic_popup_close");
    close.addEventListener("click", () => {
      const pic_popup = document.getElementById("pic_popup");
      pic_popup.classList.remove("open");
    });
  } else {
    item_pic.src = "NoImage.jpg";
  };

  // 商品名を作成
  const item_name = document.createElement("div");
  item_name.textContent = stock.name;
  item_name.className = "name";

  // 数量を作成
  const item_amount = document.createElement("div");

  // 数量が個数の場合
  if (typeof stock.amount !== "undefined") {
    const up_button = document.createElement("button");
    up_button.textContent = "+";
    up_button.id = "up";
    const down_button = document.createElement("button");
    down_button.textContent = "-";
    down_button.id = "down";
    const item_amount_button = document.createElement("div");
    item_amount_button.appendChild(up_button);
    item_amount_button.appendChild(down_button);
    item_amount_button.className = "amount_button";

    const item_amount_text = document.createElement("input");
    item_amount_text.type = "Text";
    item_amount_text.value = stock.amount;

    item_amount.appendChild(item_amount_text);
    item_amount.appendChild(item_amount_button);
    item_amount.className = "amount";

    // ＋－ボタンをクリックすると、を変更するとIndexedDBデータを更新するイベントリスナー
    up_button.addEventListener('click', () => {
      item_amount_text.value++;
      stock.amount = Number(item_amount_text.value);
      DataChange();
    });

    down_button.addEventListener('click', () => {
      item_amount_text.value--;
      stock.amount = Number(item_amount_text.value);
      DataChange();
    });

    /* テキストボックスの数量を変更すると数量データを更新するイベントリスナー */
    item_amount_text.addEventListener("change", (changeAmount) => {
      if (typeof stock.amount !== "undefined") {
        stock.amount = Number(changeAmount.target.value);
        DataChange();
      }
    });

  } else {
    const item_quantity_select = document.createElement("select");
    item_quantity_select.className = "material-symbols-outlined";
    item_quantity_select.id = "materal_select";

    const item_quantity_text = document.createElement("p");
    item_quantity_text.className = "quantity_text";

    for(let i=0; i<quantity_list.length; i++){
      const item_quantity_opt = document.createElement("option");
      item_quantity_opt.value = quantity_list[i].txt;  //value値
      item_quantity_opt.text = quantity_list[i].img;   //テキスト値
      item_quantity_opt.style.color = quantity_list[i].color;   //色
      item_quantity_select.appendChild(item_quantity_opt);

      if (quantity_list[i].txt === stock.quantity) {
        item_quantity_select.options[i].selected = true;
        item_quantity_select.style.color = quantity_list[i].color;
        item_quantity_text.textContent = quantity_list[i].txt;
      }

      item_amount.appendChild(item_quantity_select);
      item_amount.appendChild(item_quantity_text);
      item_amount.className = "quantity";

      // 残量の説明書きを表示する
      let amount_click_count = 0;
      item_quantity_select.addEventListener("click", () => {
        amount_click_count += 1;
        const bounds = item_quantity_select.getBoundingClientRect(); // クリックされた座標位置を取得
        const amount_describe = document.querySelector(".amount_describe");

        if (amount_describe.style.display = "none") {
          amount_describe.style.display = "block"; //表示する
          amount_describe.style.top = bounds.top + 30 + "px"; //30px分下げた縦位置にセット
          amount_describe.style.left = bounds.left + 50 + "px"; //50px分右にずらした位置にセット
        };

        // 偶数回クリックしたら、残量の説明書きを非表示にする
        if (amount_click_count%2 === 0 ) {
          amount_describe.style.display = "none"; //非表示にする
        }
      });

      // プルダウンリスト以外の場所をクリックしたら、残量の説明書きを非表示にする
      item_quantity_select.addEventListener("blur", () => {
        const amount_describe = document.querySelector(".amount_describe");

        if (amount_describe.style.display = "block") {
          amount_describe.style.display = "none"; //非表示にする

          amount_click_count = 0;
        };
      });

      // 数量を変更するとIndexedDBデータを更新するイベントリスナー
      item_amount.addEventListener("change", (changeAmount) => {
        stock.quantity = changeAmount.target.value;

        for(let i=0; i<quantity_list.length; i++){
          if (quantity_list[i].txt === changeAmount.target.value) {
            item_quantity_select.style.color = quantity_list[i].color;
            item_quantity_text.textContent = quantity_list[i].txt;
          }
        };
        DataChange();
      });

    }
  }

  // 期限を作成
  const item_limit = document.createElement("input");
  item_limit.className = "limit";
  item_limit.type = "Date";
  item_limit.value = stock.limit;

  // 期限切れ、もしくは期限が2週間以内の場合は、期限を強調する
  const today = new Date();
  let remain_limit = new Date(stock.limit) - today;
  remain_limit = parseInt(remain_limit / 1000 / 60 / 60 / 24);
  
  if ((remain_limit < 0) || (remain_limit < 14)) {
    item_limit.classList.add("caution");
  };

  // 期限を変更するとIndexedDBデータを更新するイベントリスナー
  item_limit.addEventListener("change", (changeLimit) => {
    stock.limit = changeLimit.target.value;
    DataChange();
  
    // 期限切れ、もしくは期限が2週間以内の場合は、期限を強調する
    const today = new Date();
    let remain_limit = new Date(stock.limit) - today;
    remain_limit = parseInt(remain_limit / 1000 / 60 / 60 / 24);
    
    if ((remain_limit < 0) || (remain_limit < 14)) {
      item_limit.classList.add("caution");
    } else {
      item_limit.classList.remove("caution");
    };
  });

  // 詳細ボタンを作成
  const item_change = document.createElement("span");
  item_change.textContent = "more_horiz";
  item_change.className = "material-symbols-outlined";

  //* 詳細ボタンを押した後に商品変更フォームのポップアップが開くイベントリスナー *//
  item_change.addEventListener("click", () => {
    const change_popup = document.getElementById("change_popup");

    const pic = document.querySelector("#change_form #change_pic");
    const category = document.querySelector("#change_form #change_category");
    const name = document.querySelector("#change_form #change_name");
    const amount = document.querySelector("#change_form #change_amount");
    const need = document.querySelector("#change_form #change_need");
    const quantity = document.querySelector("#change_form #change_quantity");
    const limit = document.querySelector("#change_form #change_limit");

    /* 初期値を設定 */
    // 画像
    if (stock.pic != ""){
      pic.src = stock.pic; 
    };

    /* 画像の変更をすると、IndexedDBデータを更新するイベントリスナー */
    let read_pic = document.getElementById("change_read_pic");
    let img = document.getElementById("change_pic");

    // ファイルを読み込んだ時に実行する
    read_pic.addEventListener("change", function(pic){
      let file = pic.target.files; // fileの取得
      let reader = new FileReader();
      reader.readAsDataURL(file[0]); // fileの要素をdataURL形式で読み込む
    
      // ファイルを読み込んだ時に実行する
      reader.onload = function(){
      let dataUrl = reader.result; // 読み込んだファイルURL
      img.src = dataUrl;
      stock.pic = dataUrl;
      }
    }, false);
    
    // カテゴリ
    for(let i=0; i<home_center_category_list.length; i++){
      const category_opt = document.createElement("option");
      category_opt.value = home_center_category_list[i].txt;  //value値
      category_opt.text = home_center_category_list[i].txt;   //テキスト値
      document.getElementById("change_category").appendChild(category_opt);
    }
    category.value = stock.category;

    // 商品名
    name.value = stock.name;

    // 数量
    if (typeof stock.amount !== "undefined") {
      for(let i=0; i<amount_list.length; i++){
        const amount_opt = document.createElement("option");
        amount_opt.value = amount_list[i].txt;  //value値
        amount_opt.text = amount_list[i].txt;   //テキスト値
        document.getElementById("change_amount").appendChild(amount_opt);
      }
      amount.value = stock.amount;

    } else {
      for(let i=0; i<quantity_list.length; i++){
        const quantity_opt = document.createElement("option");
        quantity_opt.value = quantity_list[i].txt;  //value値
        quantity_opt.text = quantity_list[i].txt;   //テキスト値
        document.getElementById("change_quantity").appendChild(quantity_opt);
      }
      quantity.value = stock.quantity;
    };

    // 必要数
    if (typeof stock.amount !== "undefined") {
      for(let i=1; i<amount_list.length; i++){
        const need_opt = document.createElement("option");
        need_opt.value = amount_list[i].txt;  //value値
        need_opt.text = amount_list[i].txt;   //テキスト値
        document.getElementById("change_need").appendChild(need_opt);
      }
      need.value = stock.need;
    };
   
    // 期限
    limit.value = stock.limit;

    // ポップアップを開く
    if (typeof stock.amount === "undefined") {
      document.querySelector(".change_zaiko_quantity").classList.add("appear");
      document.querySelector(".change_zaiko_amount").classList.remove("appear");
      document.querySelector(".change_need_amount").classList.remove("appear");
      change_popup.classList.add("open");
    } else {
      document.querySelector(".change_zaiko_amount").classList.add("appear");
      document.querySelector(".change_need_amount").classList.add("appear");
      document.querySelector(".change_zaiko_quantity").classList.remove("appear");
      change_popup.classList.add("open");
    }
    

    /* 「商品を削除」ボタンを押すとIndexedDBのデータを削除するイベントリスナー */
    const item_delete = document.querySelector(".delete_button");
    item_delete.addEventListener("click", () => {
      // 削除するか確認メッセージを表示
      if (!confirm("削除しますか？")) {
          return;
      }
      dd.remove();
      
      // IndexedDBデータ削除
      request = indexedDB.open(db_name); // DBを開く

      // DBを開けなかった時、エラーメッセージを表示する
      request.onerror = () => {
        alert("IndexedDBのデータ取得に失敗しました");
      };

      // DBを開けた時
      request.onsuccess = (event) => {
        db = event.target.result;

        // トランザクションを開き、オブジェクトストアにアクセス
        const stocks_ObjectStore = db
        .transaction([homeCenter_db],"readwrite")
        .objectStore(homeCenter_db);

        // IndexedDBデータ削除
        stocks_ObjectStore.delete(stock.id);
      };
    });

    /* 「変更」ボタンを押すとIndexedDBのデータを更新するイベントリスナー */
    const item_change = document.querySelector(".change_button");
    item_change.addEventListener("click", () => {
      if (typeof stock.amount !== "undefined") {
        stock.pic = document.querySelector("#change_form #change_pic").src;
        stock.category = document.querySelector("#change_form #change_category").value;
        stock.name = document.querySelector("#change_form #change_name").value;
        stock.amount = Number(document.querySelector("#change_form #change_amount").value);
        stock.need = Number(document.querySelector("#change_form #change_need").value);
        stock.limit = document.querySelector("#change_form #change_limit").value;
      } else {
        stock.pic = document.querySelector("#change_form #change_pic").src;
        stock.category = document.querySelector("#change_form #change_category").value;
        stock.name = document.querySelector("#change_form #change_name").value;
        stock.quantity = document.querySelector("#change_form #change_quantity").value;
        stock.limit = document.querySelector("#change_form #change_limit").value;
      }

      DataChange();
    });
  });

  //* 商品変更フォームの×ボタンを押した後にポップアップが閉じる *//
  const close = document.getElementById("change_popup_close");
  close.addEventListener("click", () => {
    const change_popup = document.getElementById("change_popup");
    change_popup.classList.remove("open");
  });


  /* 関数「DataChange」：在庫リストの値を更新すると、IndexedDBデータを更新する関数 */
  function DataChange() {
    request = indexedDB.open(db_name); // DBを開く

    // DBを開けなかった時、エラーメッセージを表示する
    request.onerror = () => {
      alert("IndexedDBのデータ取得に失敗しました");
    };

    // DBを開けた時
    request.onsuccess = (event) => {
      db = event.target.result;

      // トランザクションを開き、オブジェクトストアにアクセス
      const stocks_ObjectStore = db
      .transaction([homeCenter_db],"readwrite")
      .objectStore(homeCenter_db);

      stocks_ObjectStore.put(stock);
    };
  };

  /* ddを作成 */
  const dd = document.createElement("dd");

  // ddの中に挿入する
  dd.appendChild(item_pic);
  dd.appendChild(item_name);
  dd.appendChild(item_amount);
  dd.appendChild(item_limit);
  dd.appendChild(item_change);

  /* 要素をクリックするとdd要素を強調するイベントリスナー */
  dd.addEventListener("click", () => {
    if (dd.classList.contains("active")) {
      dd.classList.remove("active");
    } else {
      const all_dd = document.querySelectorAll("#stocks dd");
      all_dd.forEach(item => {
        item.classList.remove("active");
      });
      dd.classList.add("active");
    };
  });

  // idで紐づいたdivの中にddを挿入する
  document.getElementById(stock.category).appendChild(dd);

};