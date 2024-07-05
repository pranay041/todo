document.addEventListener("DOMContentLoaded", () => {
  const listTitle = "My To-Do List"; // Change the title as needed
  document.getElementById("listTitle").textContent = listTitle;

  const listContainer = document.getElementById("listContainer");
  const completedTasksContainer = document.getElementById("completedTasksContainer");
  const addForm = document.getElementById("addForm");
  const newItemInput = document.getElementById("newItemInput");

  // Load items from localStorage
  const loadItems = () => {
    const items = JSON.parse(localStorage.getItem("todoItems")) || [];
    listContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";
    items.forEach(item => {
      if (!item.completed) {
        createItemElement(item);
      } else {
        createCompletedItemElement(item);
      }
    });
  };

  // Save items to localStorage
  const saveItems = (items) => {
    localStorage.setItem("todoItems", JSON.stringify(items));
  };

  // Create item element
  const createItemElement = (item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    const checkboxForm = document.createElement("form");
    checkboxForm.action = "#";
    checkboxForm.addEventListener("submit", (e) => {
      e.preventDefault();
      deleteItem(item.id);
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "deleteItemId";
    checkbox.value = item.id;
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
      toggleCompleted(item.id);
    });

    const titleP = document.createElement("p");
    titleP.id = `title${item.id}`;
    titleP.textContent = item.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "edit";
    deleteButton.type = "submit";
    deleteButton.innerHTML = '<img class="icon" src="assets/trash-blank-alt-svgrepo-com (1).svg" alt="trash image">';
    deleteButton.addEventListener("click", () => {
      deleteItem(item.id);
    });

    const editForm = document.createElement("form");
    editForm.className = "edit";
    editForm.action = "#";
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      updateItem(item.id, editInput.value);
    });

    const hiddenIdInput = document.createElement("input");
    hiddenIdInput.type = "hidden";
    hiddenIdInput.name = "updatedItemId";
    hiddenIdInput.value = item.id;

    const editInput = document.createElement("input");
    editInput.id = `input${item.id}`;
    editInput.type = "text";
    editInput.name = "updatedItemTitle";
    editInput.value = item.title;
    editInput.autocomplete = "off";
    editInput.hidden = true;

    const doneButton = document.createElement("button");
    doneButton.id = `done${item.id}`;
    doneButton.className = "edit";
    doneButton.type = "submit";
    doneButton.innerHTML = '<img class="icon" src="assets/check-solid.svg" alt="tick image">';
    doneButton.hidden = true;

    const editButton = document.createElement("button");
    editButton.id = `edit${item.id}`;
    editButton.className = "edit";
    editButton.type = "button";
    editButton.innerHTML = '<img class="icon" src="assets/pencil-solid.svg" alt="pencil image">';
    editButton.addEventListener("click", () => {
      handler(item.id);
    });

    checkboxForm.appendChild(checkbox);
    itemDiv.appendChild(checkboxForm);
    itemDiv.appendChild(titleP);
    itemDiv.appendChild(deleteButton);
    itemDiv.appendChild(editForm);
    editForm.appendChild(hiddenIdInput);
    editForm.appendChild(editInput);
    editForm.appendChild(doneButton);
    itemDiv.appendChild(editButton);

    listContainer.appendChild(itemDiv);
  };

  // Create completed item element
  const createCompletedItemElement = (item) => {
    const completedItemDiv = document.createElement("div");
    completedItemDiv.className = "item completed";

    const checkboxForm = document.createElement("form");
    checkboxForm.action = "#";
    checkboxForm.addEventListener("submit", (e) => {
      e.preventDefault();
      deleteCompletedItem(item.id);
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "deleteItemId";
    checkbox.value = item.id;
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
      toggleCompleted(item.id);
    });

    const titleP = document.createElement("p");
    titleP.id = `title${item.id}`;
    titleP.textContent = item.title;

    const unmarkButton = document.createElement("button");
    unmarkButton.className = "edit";
    unmarkButton.type = "button";
    unmarkButton.innerHTML = '<img class="icon" src="assets/undo-svgrepo-com.svg" alt="undo image">';
    unmarkButton.addEventListener("click", () => {
      toggleCompleted(item.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "edit";
    deleteButton.type = "button";
    deleteButton.innerHTML = '<img class="icon" src="assets/trash-blank-alt-svgrepo-com (1).svg" alt="trash image">';
    deleteButton.addEventListener("click", () => {
      deleteCompletedItem(item.id);
    });

    checkboxForm.appendChild(checkbox);
    completedItemDiv.appendChild(checkboxForm);
    completedItemDiv.appendChild(titleP);
    completedItemDiv.appendChild(unmarkButton);
    completedItemDiv.appendChild(deleteButton);

    completedTasksContainer.appendChild(completedItemDiv);
  };

  // Add new item
  const addItem = (title) => {
    const items = JSON.parse(localStorage.getItem("todoItems")) || [];
    const newItem = {
      id: Date.now().toString(),
      title: title,
      completed: false // New items are initially not completed
    };
    items.push(newItem);
    saveItems(items);
    createItemElement(newItem);
  };

  // Toggle item completion status
  const toggleCompleted = (id) => {
    let items = JSON.parse(localStorage.getItem("todoItems")) || [];
    items = items.map(item => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });
    saveItems(items);
    loadItems();
  };

  // Delete active item
  const deleteItem = (id) => {
    let items = JSON.parse(localStorage.getItem("todoItems")) || [];
    items = items.filter(item => item.id !== id);
    saveItems(items);
    loadItems();
  };

  // Delete completed item
  const deleteCompletedItem = (id) => {
    let items = JSON.parse(localStorage.getItem("todoItems")) || [];
    items = items.filter(item => item.id !== id);
    saveItems(items);
    loadItems();
  };

  // Update item
  const updateItem = (id, newTitle) => {
    let items = JSON.parse(localStorage.getItem("todoItems")) || [];
    items = items.map(item => {
      if (item.id === id) {
        item.title = newTitle.trim(); // Trim whitespace from the new title
        if (item.title === "") {
          deleteItem(item.id); // Delete the item if title becomes empty
        }
      }
      return item;
    });
    saveItems(items);
    loadItems();
  };

  // Handler for edit button
  const handler = (id) => {
    document.getElementById(`title${id}`).hidden = true;
    document.getElementById(`edit${id}`).hidden = true;
    document.getElementById(`done${id}`).hidden = false;
    document.getElementById(`input${id}`).hidden = false;
  };

  // Event listener for add form
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newItemTitle = newItemInput.value.trim();
    if (newItemTitle) {
      addItem(newItemTitle);
      newItemInput.value = "";
    }
  });

  // Initial load
  loadItems();
});
