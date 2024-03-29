"use strict";

//* タスクリストの追加ボタンを押した後のポップアップ制御 *//

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


//* タスクリストの追加ボタンを押した後の入力フォーム画面 *//

/* フォームが送信されたら、その入力値を関数「renderStock」に渡して、「renderStock」を実行する */
document.querySelector("#add_form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.querySelector("#add_form #name");
  const limit = document.querySelector("#add_form #limit");

  let task;
  task = {
    id: Date.now(),
    name: name.value,
    limit: limit.value,
    status: "未完了",
  };

  /* IndexedDBにデータを追加する */
  request = indexedDB.open("tasks");

  // DBを開けなかった時の処理
  request.onerror = (event) => {
    alert("IndexedDBのデータ取得に失敗しました");
  };
  
  // DBを開けた時の処理
  request.onsuccess = (event) => {
    db = request.result;

    // トランザクションを開き、オブジェクトストアにアクセス
    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks");

    // オブジェクトストアに「task」を追加
    objectStore.put(task);
  };

  /* ページをリロードする */
  window.location.reload(false);

});