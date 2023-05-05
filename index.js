import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-f395a-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);

const database = getDatabase(app);

const listInDB = ref(database, "list");

const inputFieldEl = document.getElementById("input-field");
const addBtnEl = document.getElementById("add-btn");
const listEl = document.getElementById("list");
const cancelBtn = document.getElementById("cancel-btn");
const deleteBtn = document.getElementById("delete-btn");
const emptyFieldError = document.getElementById("emptyField-error");
const historyIcon = document.getElementById("history-icon");
const deleteNotificationTab = document.getElementById("delete-notification");

onValue(listInDB, function (snapshot) {
  if (snapshot.exists()) {
    const allItemsArray = Object.entries(snapshot.val());

    clearListEl();

    for (let i = 0; i < allItemsArray.length; i++) {
      const currentItem = allItemsArray[i];
      addItemInList(currentItem);
    }
  } else {
    listEl.innerHTML = `<h4>You don't have "To-Do" list yet...</h4>`;
  }
});

addBtnEl.addEventListener("click", () => {
  let inputValue = inputFieldEl.value;
  if (inputValue) {
    push(listInDB, inputValue);
  } else {
    emptyFieldError.classList.add("flex-container");
    emptyFieldError.classList.toggle("visibility");
    setTimeout(() => {
      emptyFieldError.classList.remove("flex-container");
      emptyFieldError.classList.toggle("visibility");
    }, 3000);
  }
  clearInputValueEl();
});

function clearInputValueEl() {
  inputFieldEl.value = "";
}

function clearListEl() {
  listEl.innerHTML = "";
}

function addItemInList(item) {
  let itemKey = item[0];
  let itemValue = item[1];
  const itemKeysBoolean = [];
  itemKeysBoolean.push(`{${itemKey}: false }`);
  let newDivEl = document.createElement("div");
  newDivEl.classList.add("list-item-div");
  newDivEl.classList.add("undone");
  newDivEl.innerHTML = `<li><span class="list-font"><span id="item-${itemKey}">${itemValue}</span><i class="fa-solid fa-trash delete-icon" style="color: #840606;" id="${itemKey}"></i></span></li>`;
  listEl.append(newDivEl);
  const deleteIcon = document.getElementById(`${itemKey}`);
  const itemValueToggle = document.getElementById(`item-${itemKey}`);

  newDivEl.addEventListener("click", () => {
    if (itemKeysBoolean[0]) {
      itemValueToggle.classList.add("done");
      newDivEl.classList.add("list-item-hover");
      deleteIcon.classList.add("text-overline-none");
    } else {
      newDivEl.classList.remove("list-item-hover");
      itemValueToggle.classList.remove("done");
    }
    itemKeysBoolean[0] = !itemKeysBoolean[0];
  });
  deleteIcon.addEventListener("click", () => {
    deleteNotificationTab.classList.remove("visibility");
    deleteBtn.addEventListener("click", () => {
      let exactLocationOfItemInDB = ref(database, `list/${itemKey}`);
      remove(exactLocationOfItemInDB);
      deleteNotificationTab.classList.add("visibility");
    });
    cancelBtn.addEventListener("click", () => {
      deleteNotificationTab.classList.add("visibility");
    });
  });
}
