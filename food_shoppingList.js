"use strict";

//* ショッピングリスト画面 *//

/* カテゴリを作成 */
category_list.forEach( category => {

  const dt = document.createElement("dt");
  dt.textContent = category.txt;

  const div = document.createElement("div");
  div.appendChild(dt);
  div.id = category.txt;

  document.querySelector("#food_buy_items").appendChild(div);
});


/* dtがクリックされたら、dtの親要素(div)に
	close要素を追加する */
const dts = document.querySelectorAll("dt");

dts.forEach(dt => {
  dt.addEventListener("click", () => {
    dt.parentNode.classList.toggle("close");
  });
});


/* 関数「createBuyList」：HTMLにtable要素を作成する関数 */
const createBuyList = (stock) => {

  // IndexerdDBの数量が必要量を下回った場合、実行
  if (((typeof stock.amount !== "undefined") && (stock.amount - stock.need < 0)) ||
      ((typeof stock.amount === "undefined") && (stock.quantity === "在庫なし"))||
      ((typeof stock.amount === "undefined") && (stock.quantity === "あと少し")) ||
      ((typeof stock.amount === "undefined") && (stock.quantity === "半分")))  {
        
    // チェックボックスを作成
    const item_buy = document.createElement("input");
    item_buy.type = "checkbox";
    item_buy.className = "checkbox";

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
  
      //* 入力フォーム画面の×ボタンを押した後にポップアップが閉じる *//
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
    item_name.className = "name2";

    // 数量を作成
    const item_amount = document.createElement("div");
    let add_amount;

    if (typeof stock.amount !== "undefined") {
      const buy_amount = stock.need - stock.amount;
      add_amount = buy_amount;

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
      item_amount_text.value = buy_amount;

      item_amount.appendChild(item_amount_text);
      item_amount.appendChild(item_amount_button);
      item_amount.className = "buy_amount";

      // ＋－ボタンをクリックすると、を変更するとIndexedDBデータを更新するイベントリスナー
      up_button.addEventListener('click', () => {
        item_amount_text.value++;
        add_amount = Number(item_amount_text.value);
      });

      down_button.addEventListener('click', () => {
        item_amount_text.value--;
        add_amount = Number(item_amount_text.value);
      });

      /* リスト内の数量を変更すると数量データを更新するイベントリスナー */
      item_amount_text.addEventListener("change", (changeAmount) => {
        if (typeof stock.amount !== "undefined") {
          add_amount = Number(changeAmount.target.value);
        }
      });

    } else {
      item_amount.className = "remain_amount";
      item_amount.textContent = "(残量：" + stock.quantity + ")";

      /* リスト内の数量を変更すると数量データを更新するイベントリスナー */
      item_amount.addEventListener("change", (changeAmount) => {
        if (typeof stock.amount !== "undefined") {
          add_amount = Number(changeAmount.target.value);
        }
      });
    }

    /* チェックボックスにチェックを入れると、在庫リストの数量を更新するイベントリスナー */
    item_buy.addEventListener("change", () => {
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
        .transaction([food_db],"readwrite")
        .objectStore(food_db);

        // IndexedDBデータ更新
        if (typeof stock.amount !== "undefined") {
          stock.amount += add_amount;
        } else {
          stock.quantity = "備蓄あり";
        }
        stocks_ObjectStore.put(stock);
        
        /* ページをリロードする */
        // window.location.reload(false);
      }
    });

    /* ddを作成 */
    const dd = document.createElement("dd");

    // ddの中に挿入する
    dd.appendChild(item_buy);
    dd.appendChild(item_pic);
    dd.appendChild(item_name);
    dd.appendChild(item_amount);

      /* 要素をクリックするとdd要素を強調するイベントリスナー */
    dd.addEventListener("click", () => {
      if (dd.classList.contains("active")) {
        dd.classList.remove("active");
      } else {
        const all_dd = document.querySelectorAll("#food_buy_items dd");
        all_dd.forEach(item => {
          item.classList.remove("active");
        });
        dd.classList.add("active");
      };
    });

    // idで紐づいたdivの中にddを挿入する
    document.getElementById(stock.category).appendChild(dd);

  };
};


/* 関数「getBuyListData」：IndexedDBのデータを、web上に表示するための関数 */
function getBuyListData() {
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
    .transaction([food_db],"readonly")
    .objectStore(food_db)
    .index("category");
  
    // IndexedDBのデータを取得する
    const get_data = stocks_ObjectStore.getAll();
    
    // データ取得に成功した時、配列「stocks」にIndexedDBのデータを格納
    get_data.onsuccess = (data) => {
      const stocks = data.target.result;

      /* 関数「createBuyLists」
        ：ローカルストレージのデータリスト「stocks」を関数「createBuyList」に渡して、HTMLに反映させる関数 */
      const createBuyLists = () => {
        stocks.forEach((stock) => {
          createBuyList(stock);
        });
      };
      
      /* 関数「createBuyLists」を実行 */
      createBuyLists();
    };

    // 取得に失敗した時、エラーメッセージを表示する
    get_data.onerror = () => {
      alert("IndexedDBのデータ取得に失敗しました");
    };
  };
};

// 関数を実行
getBuyListData();
