'use strict';

//* リスト *//
  // 【食品】カテゴリのリスト
  const category_list = [
    {txt:"パン"},
    {txt:"乳製品"},
    {txt:"飲料・お酒"},
    {txt:"茶葉"},
    {txt:"ハム・ソーセージ類"},
    {txt:"肉"},
    {txt:"魚"},
    {txt:"野菜"},
    {txt:"卵"},
    {txt:"豆製品"},
    {txt:"練物"},
    {txt:"惣菜"},
    {txt:"インスタント食品・スープ"},
    {txt:"ふりかけ・お茶漬け"},
    {txt:"麺類"},
    {txt:"調味料"},
    {txt:"乾物"},
    {txt:"缶詰"},
    {txt:"冷凍食品"},
    {txt:"アイス"},
    {txt:"米"},
    {txt:"お菓子"},
    {txt:"その他"},
  ];

  // 【薬局】カテゴリのリスト
  const drug_store_category_list = [
    {txt:"医薬品・湿布"},
    {txt:"衛生用品"},
    {txt:"スタイリング剤・シャンプー類"},
    {txt:"化粧水・乳液"},
    {txt:"クリーム・日焼け止め"},
    {txt:"オーラルケア"},
    {txt:"化粧品"},
    {txt:"洗面・お風呂用品"},
    {txt:"洗濯用品"},
    {txt:"トイレ用品"},
    {txt:"キッチン用品"},
    {txt:"消臭・芳香用品"},
    {txt:"掃除用品"},
    {txt:"殺虫剤・虫よけ"},
    {txt:"ティッシュ・トイレットペーパー"},
    {txt:"生理用品"},
    {txt:"食品・飲料"},
    {txt:"サプリメント"},
    {txt:"その他"},
  ];

  // 【ホームセンター】カテゴリのリスト
  const home_center_category_list = [
    {txt:"掃除用品"},
    {txt:"収納用品"},
    {txt:"日用品"},
    {txt:"ペット用品"},
    {txt:"工具"},
    {txt:"園芸用品"},
    {txt:"カー用品"},
    {txt:"家電・電材"},
    {txt:"その他"},
  ];

  // 【防災グッズ】カテゴリのリスト
  const emergency_item_category_list = [
    {txt:"食品・飲料"},
    {txt:"医薬品・湿布"},
    {txt:"簡易トイレ"},
    {txt:"衛生用品"},
    {txt:"洗面・お風呂用品"},
    {txt:"オーラルケア"},
    {txt:"その他"},
  ];

  // 数量のリスト(個数)
  const amount_list = [
    {txt:0},
    {txt:1},
    {txt:2},
    {txt:3},
    {txt:4},
    {txt:5},
    {txt:6},
    {txt:7},
    {txt:8},
    {txt:9},
    {txt:10},
    {txt:11},
    {txt:12},
    {txt:13},
    {txt:14},
    {txt:15},
  ];

  // 数量のリスト(分量)
  const quantity_list = [
    {txt:"在庫なし", img:"battery_alert", color:"black"},
    {txt:"あと少し", img:"battery_1_bar", color:"red"},
    {txt:"半分", img:"battery_3_bar", color:"orange"},
    {txt:"使い始め", img:"battery_6_bar", color:"green"},
    {txt:"備蓄あり", img:"battery_full", color:"blue"},
  ];


//* IndexedDBのデータを扱うための定数 *//  

  let request; // DBを開く要求結果を格納するための定数
  let db; // DBを開いた結果を格納しておく変数

  const db_name = "stocks"; // 在庫リストのDB名
  const food_db = "food_stocks"; // 食品のオブジェクトストア名
  const drugStore_db = "drugStore_stocks"; // 薬局のオブジェクトストア名
  const homeCenter_db = "homeCenter_stocks"; // ホームセンターのオブジェクトストア名
  const emergencyItem_db = "emergencyItem_stocks"; // 防災グッズのオブジェクトストア名


//* 関数「createTasksDB」：タスクリストのIndexedDB「tasks」を作成する関数 *//
function createTasksDB() {
  request = indexedDB.open("tasks"); // DBを開く

  // DBを開けなかった時、エラーメッセージを表示する
  request.onerror = () => {
   alert("IndexedDBのデータ取得に失敗しました");
  };

  // DBを開けた時
  request.onupgradeneeded = (event) => {
    db = event.target.result;

    // IndexedDBにobjectStore「tasks」を作成（idをキーパスとして使用）
    const task_objectStore = db.createObjectStore("tasks", { keyPath: "id" });

    task_objectStore.createIndex("status", "status", { unique: false });

    task_objectStore.transaction.oncomplete = () => {
      db.transaction("tasks")
        .objectStore("tasks"); 
    };
  };
};

// 関数を実行
createTasksDB();


//* 関数「createStocksDB」：在庫リストのIndexedDB「stocks」を作成する関数 *//
function createStocksDB() {
  request = indexedDB.open(db_name); // DBを開く

  // DBを開けなかった時、エラーメッセージを表示する
  request.onerror = () => {
   alert("IndexedDBのデータ取得に失敗しました");
  };

  // DBを開けた時
  request.onupgradeneeded = (event) => {
    db = event.target.result;

    // IndexedDBにobjectStore「food_stocks」を作成（idをキーパスとして使用）
    const food_objectStore = db.createObjectStore(food_db, { keyPath: "id" });

    food_objectStore.createIndex("category", "category", { unique: false });

    food_objectStore.transaction.oncomplete = () => {
      db.transaction([food_db])
        .objectStore(food_db); 
    };

    // IndexedDBにobjectStore「drugStore_stocks」を作成（idをキーパスとして使用）
    const drugStore_objectStore = db.createObjectStore(drugStore_db, { keyPath: "id" });
    
    drugStore_objectStore.createIndex("category", "category", { unique: false });

    drugStore_objectStore.transaction.oncomplete = () => {
      db.transaction([drugStore_db])
        .objectStore(drugStore_db); 
    };

    // IndexedDBにobjectStore「homeCenter_stocks」を作成（idをキーパスとして使用）
    const homeCenter_objectStore = db.createObjectStore(homeCenter_db, { keyPath: "id" });

    homeCenter_objectStore.createIndex("category", "category", { unique: false });

    homeCenter_objectStore.transaction.oncomplete = () => {
      db.transaction([homeCenter_db])
        .objectStore(homeCenter_db); 
    };

    // IndexedDBにobjectStore「emergencyItem_stocks」を作成（idをキーパスとして使用）
    const emergencyItem_objectStore = db.createObjectStore(emergencyItem_db, { keyPath: "id" });

    emergencyItem_objectStore.createIndex("category", "category", { unique: false });

    emergencyItem_objectStore.transaction.oncomplete = () => {
      db.transaction([emergencyItem_db])
        .objectStore(emergencyItem_db); 
    };

  };
};

// 関数を実行
createStocksDB();