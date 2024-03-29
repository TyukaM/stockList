"use strict";

//* タスクリスト画面 *//

/* dtがクリックされたら、dtの親要素(div)に
	close要素を追加する */
  const dts = document.querySelectorAll("dt");

  dts.forEach(dt => {
    dt.addEventListener("click", () => {
      dt.parentNode.classList.toggle("close");
    });
  });

/* 関数「getTasksData」：IndexedDBのデータを、web上に表示するための関数 */
function getTasksData() {
  request = indexedDB.open("tasks"); // DBを開く

  // DBを開けなかった時、エラーメッセージを表示する
  request.onerror = () => {
    alert("IndexedDBのデータ取得に失敗しました");
  };

  // DBを開けた時
  request.onsuccess = (event) => {
    db = event.target.result;

    // トランザクションを開き、オブジェクトストアにアクセス
    const stocks_ObjectStore = db
    .transaction(["tasks"],"readonly")
    .objectStore("tasks")
    .index("status");
  
    // IndexedDBのデータを取得する
    const get_data = stocks_ObjectStore.getAll();
    
    // データ取得に成功した時、配列「stocks」にIndexedDBのデータを格納
    get_data.onsuccess = (data) => {
      const tasks = data.target.result;

      /* 関数「createTasksList」
        ：ローカルストレージのデータリスト「tasks」を関数「createTask」に渡して、HTMLに反映させる関数 */
      const createTasksList = () => {
        tasks.forEach((task) => {
          createTaskList(task);
        });
      };
      
      /* 関数「createTasks」を実行 */
      createTasksList();
    };

    // 取得に失敗した時、エラーメッセージを表示する
    get_data.onerror = () => {
      alert("IndexedDBのデータ取得に失敗しました");
    };
  };
};

// 関数を実行
getTasksData();


/* 関数「createTaskList」：HTMLにtable要素を作成する関数 */
const createTaskList = (task) => {
  // チェックボックスを作成
  const task_finished = document.createElement("input");
  task_finished.type = "checkbox";
  task_finished.className = "checkbox";

  // データ取得時に、ステータスが完了済みになっているタスクはチェックボックスにチェックを入れる
  if (task.status === "完了済み") {
    task_finished.checked = true;
  };

  // チェックボックスをクリックすると、取り消し線を引く
  task_finished.addEventListener("click", () => {
    if (task.status === "完了済み") {
      task.status = "未完了";
      DataChange();
      window.location.reload(false);
    } else {
      task.status = "完了済み";
      DataChange();
      window.location.reload(false);
    };
  });

  // タスクを作成
  const task_name = document.createElement("input");
  task_name.type = "Text";
  task_name.value = task.name;
  task_name.className = "name";

  // 期限を作成
  const task_limit = document.createElement("input");
  task_limit.className = "limit";
  task_limit.type = "Date";
  task_limit.value = task.limit;

  // 期限切れ、もしくは期限が1週間以内の場合は、期限を強調する
  const today = new Date();
  let remain_limit = new Date(task.limit) - today;
  remain_limit = parseInt(remain_limit / 1000 / 60 / 60 / 24);
  
  if ((remain_limit < 0) || (remain_limit < 7)) {
    task_limit.classList.add("caution");
  };

  // 削除ボタンを作成
  const task_delete = document.createElement("span");
  task_delete.textContent = "x";
  task_delete.className = "task_delete";

  /* 「商品を削除」ボタンを押すとIndexedDBのデータを削除するイベントリスナー */
  task_delete.addEventListener("click", () => {
    // 削除するか確認メッセージを表示
    if (!confirm("削除しますか？")) {
        return;
    }
    dd.remove();
    
    // IndexedDBデータ削除
    request = indexedDB.open("tasks"); // DBを開く

    // DBを開けなかった時、エラーメッセージを表示する
    request.onerror = () => {
      alert("IndexedDBのデータ取得に失敗しました");
    };

    // DBを開けた時
    request.onsuccess = (event) => {
      db = event.target.result;

      // トランザクションを開き、オブジェクトストアにアクセス
      const stocks_ObjectStore = db
      .transaction(["tasks"],"readwrite")
      .objectStore("tasks");

      // IndexedDBデータ削除
      stocks_ObjectStore.delete(task.id);
    };
  });

  /* 関数「DataChange」：在庫リストの値を更新すると、IndexedDBデータを更新する関数 */
  function DataChange() {
    request = indexedDB.open("tasks"); // DBを開く

    // DBを開けなかった時、エラーメッセージを表示する
    request.onerror = () => {
      alert("IndexedDBのデータ取得に失敗しました");
    };

    // DBを開けた時
    request.onsuccess = (event) => {
      db = event.target.result;

      // トランザクションを開き、オブジェクトストアにアクセス
      const stocks_ObjectStore = db
      .transaction(["tasks"],"readwrite")
      .objectStore("tasks");

      stocks_ObjectStore.put(task);
    };
  };

  /* リスト内の〇〇を変更するとIndexedDBデータを更新するイベントリスナー */
  // タスク
  task_name.addEventListener("change", (changeName) => {
    task.name = changeName.target.value;
    DataChange();
  })

  // 期限
  task_limit.addEventListener("change", (changeLimit) => {
    task.limit = changeLimit.target.value;
    DataChange();

    // 期限切れ、もしくは期限が1週間以内の場合は、期限を強調する
    const today = new Date();
    let remain_limit = new Date(task.limit) - today;
    remain_limit = parseInt(remain_limit / 1000 / 60 / 60 / 24);
    
    if ((remain_limit < 0) || (remain_limit < 7)) {
      task_limit.classList.add("caution");
    } else {
      task_limit.classList.remove("caution");
    };

    //完了済みタスクの場合は、期限切れ、もしくは期限が1週間以内の場合の期限を強調をやめる
    if (task.status === "完了済み") {
      task_limit.classList.remove("caution"); 
    };
  });


  /* ddを作成 */
  const dd = document.createElement("dd");

  // ddの中に挿入する
  dd.appendChild(task_finished);
  dd.appendChild(task_name);
  dd.appendChild(task_limit);
  dd.appendChild(task_delete);

  /* 要素をクリックするとdd要素を強調するイベントリスナー */
  dd.addEventListener("click", () => {
    if (dd.classList.contains("active")) {
      dd.classList.remove("active");
    } else {
      const all_dd = document.querySelectorAll("#tasks dd");
      all_dd.forEach(item => {
        item.classList.remove("active");
      });
      dd.classList.add("active");
    };
  });

  // idで紐づいたdivの中にddを挿入する
  document.getElementById(task.status).appendChild(dd);

};