// Keycode for the ENTER and ESC keys.
const ENTER_KEY = 13;
const ESC_KEY = 27;

// Initial todo items in a stringified format.
// JSON: JavaScript Objet Notation
const stringifiedTodoItems = `
    [
        {
            "name": "This item is done",
            "done": true
        },
        {
            "name": "This item is not done",
            "done": false
        }
    ]
`;


/**
* Model describes how todo items are stored and
* specifies the methods that are used to modify the todo list.
*
* Note that model should NOT have interaction with the UI,
* i.e. no DOM manipulation here.
*
* Instead, the DOM should be updated in controller and view.
*/
const model = {
    // items is the field of model
    // items is an array, we need to use JSON.parse to transfer Sting to array
    items: JSON.parse(stringifiedTodoItems),

    /**
    * Count the total number of items
    * and the number of done items.
    * @return {Object} { numItems: ..., numDoneItems: ... }
    */
    countItems: function() {
        //constant: the value CANNOT be changed
        const numItems = this.items.length;

        //let: the value CAN be changed
        let numDoneItems = 0;
        this.items.forEach((item) => {
            if (item.done === true) {
                numDoneItems++;
            }
        });

        // this.items.array.forEach(function(item) {
        //     if (this.items.done === true) {
        //         numDoneItems++;
        //     }
        // });
        // return an Object
        return {
            numItems: numItems,
            numDoneItems: numDoneItems,
        };
    },

    /**
    * Create a todo item, set it as undone and add it to the "items" array.
    * Items should have the following format:
    * { name: ..., done: true/false }
    * @param {string} name - the name of the new item
    */
    createItem: function(name) {
        //fist check if the name is valid
        if (typeof name === 'string' && name.length > 0) {
            this.items.push({
                name: name,
                done: false,
            });
        }
    },

    /**
    * Change the name of the specified todo item.
    * @param {Number} index - the index of the item in the zero-indexed "items" array
    * @param {string} name - the item's new name
    */
    changeItemName: function(index, name) {
        this.items[index].name = name;
    },

    /**
    * Delete the specified item.
    * @param {Number} index - the index of the item in the zero-indexed "items" array
    */
    deleteItem: function(index) {
        //start from items[index], delete 1 element
        this.items.splice(index, 1);

        // const newItems = [];
        // for (let i = 0; i < this.items.length; i++) {
        //     if (i !== index) {
        //         this.newItems.push(this.items[i]);
        //     }
        // }
    },

    /**
    * Delete all items.
    */
    deleteAllItems: function() {
        this.items = [];
    },

    /**
    * Toggle the status of the specified item.
    * If it is done, change it to undone.
    * If it is undone, change it to done.
    * @param {Number} index - the index of the item in the zero-indexed "items" array
    */
    toggleItem: function(index) {
        const item = this.items[index];
        item.done = !item.done;
    },

    /**
    * Toggle the status of all items.
    * If all item is done, change it to undone.
    * If an item is undone, change it to done.
    */
    toggleAllItems: function() {
        //destructuring assignment
        const {numItems, numDoneItems} = this.countItems();
        // equivalent to
        // const count = this.countItems();
        // const numItems = count.numItems;
        // const numDoneItems = count.numDoneItems;
        const markItemAsDone = (item) => {(item.done = true)};
        const markItemAsUndone = (item) => {(item.done = false)};
        const allItemsDone = numItems === numDoneItems;
        this.items.forEach(allItemsDone ? markItemAsUndone : markItemAsDone);
    },
};

/**
* Controller servers as a bridge between model and view.
*
* In every controller method, remember to update the UI
* by calling view.displayTodoItems().
*
* Difference between controller and view:
* Only event handling methods should be included in controller
* (e.g. methods that respond to an add-item event).
* Pure display methods and methods that are not
* directly related to the todo list
* should be included in view instead.
*/
const controller = {
    /**
    * Read the content from the input field
    * and create a new todo item.
    */
    createItem: function() {
        //get the data from webpage
        const createItemInput = document.getElementById('create-item-input');
        model.createItem(createItemInput.value);
        createItemInput.value = '';
        view.displayTodoItems();
    },

    /**
    * 2 keyboard events should be monitored:
    * pressing the ENTER key and pressing the ESC key.
    *
    * Update the name of the selected todo item
    * when the ENTER key is pressed.
    *
    * Exit editing mode and revert to the original name
    * when the ESC key is pressed.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    updateItemNameOnKeyUp: function(event) {
        //event.target tells us from which element the event was triggered
        const updateItemInput = event.target;

        // get the id attribute from updateItemInput's parent <li> element
        const id = updateItemInput.parentNode.getAttribute('id');

        const newName = updateItemInput.value;

        // If there is some text in the update input,
        // then change the name of the selected item
        // when the ENTER key is pressed.
        if (event.keyCode === ENTER_KEY && newName.length > 0) {
            this.changeItemName(id, newName);
        }

        // When the ESC key is pressed,
        // reset the name of the selected item to the original value.
        if (event.keyCode === ESC_KEY) {
            // IMPORTANT
            // If updateItemInput.value is not reset to the original value,
            // then this.updateItemNameOnFocusOut() will still run and
            // update, which is incorrect.
            updateItemInput.value = model.items[id].name;
            view.displayTodoItems();
        }
    },

    /**
    * Update the name of the selected todo item
    * when the user clicks on anything
    * that lies outside the input box.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    updateItemNameOnFocusOut: function(event) {
        const updateItemInput = event.target;

        const id = updateItemInput.parentNode.getAttribute("id");

        const newName = updateItemInput.value;

        if (newName) {
            this.changeItemName(id, newName);
        } else {
            this.deleteItem(id);
        }
    },

    /**
    * Change the name of the specified item.
    * @param {Number} index - the index of the item (index starts from zero)
    * @param {string} name - the item's new name
    */
    changeItemName: function(index, name) {
        model.changeItemName(index, name);
        view.displayTodoItems();
    },

    /**
    * Delete the specified item.
    * @param {Number} index - the index of the item (index starts from zero)
    */
    deleteItem: function(index) {
        model.deleteItem(index);
        view.displayTodoItems();
    },

    /**
    * Delete all items.
    */
    deleteAllItems: function() {
        //pop up the confirming notice
        const confirmDelete = confirm('This will delete all TODO items!');
        if (confirmDelete) {
            model.deleteAllItems();
            view.displayTodoItems();
        }
    },

    /**
    * Turn on the updating mode.
    * Display the update input and hide the todo item label.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    turnOnUpdatingMode: function(event) {
        const itemLabel = event.target;
        const updateItemInput = itemLabel.parentNode.querySelector('.update-item-input');
        view.hideDOMElement(itemLabel);
        view.displayDOMElement(updateItemInput);
        updateItemInput.focus();
    },

    /**
    * Read the index of the selected item from the UI.
    * Toggle the status of the selected item.
    * If it is done, change it to undone.
    * If it is undone, change it to done.
    * @param {Event} event - the event paramter that is available to event handlers
    */
    toggleItem: function(event) {
        const toggleItemCheckBox = event.target;
        const id = toggleItemCheckBox.parentNode.getAttribute('id');
        model.toggleItem(id);
        view.displayTodoItems();
    },

    /**
    * Toggle the status of all items.
    * If an item is done, change it to undone.
    * If an item is undone, change it to done.
    */
    toggleAllItems: function() {
        model.toggleAllItems();
        view.displayTodoItems();
    },

    /**
    * Clear the input form that is used to add new items.
    */
    clearForm: function() {
        const createItemInput = document.getElementById("create-item-input");
        createItemInput.value = createItemInput.getAttribute("placeholder");
        const createItemForm = document.getElementById("create-item-form");
        createItemForm.reset();
    },
};

/**
* View contains methods that are responsible for displaying only but
* do not handle events (e.g. displayTodoItems).
* View also contains DOM manipulation methods where we can
* modified the appearance of UI elements and/or
* attach event listeners to them.
*/
const view = {
    /**
     * Render all todo items on the webpage.
     * This method is long and complex.
     * I have broken down the method into several smaller steps.
     * See the comments below.
     */
    displayTodoItems: function () {
        /**
         * If there is at least one item,
         * then display a button that is used to toggle the status of all items.
         * Otherwise, do not display.
         *
         * For each todo item, we should do the following:
         *
         * 1️⃣
         * Render a checkbox on the left.
         * If the item is done, the checkbox should be checked.
         * Otherwise, the checkbox should be empty;
         *
         * 2️⃣
         * Add an input box in order to edit the item's name.
         * Initially the input box should be invisible.
         * It becomes visible only when the user clicks on the item's name.
         *
         * 3️⃣
         * Display the item's name.
         * For a done item, its name should be displayed as stricken-through.
         *
         * 4️⃣
         * Display a delete button on the right.
         * Remember to attach appropriate event listener(s) to the button.
         */

        const todoListUl = document.querySelector("ul");
        todoListUl.innerHTML = "";

        model.items.forEach((item, index) => {
            const itemLi = document.createElement("li");
            itemLi.id = index;

            //step1: for the togglebox
            const toggleItemCheckBox = document.createElement("input");
            toggleItemCheckBox.type = "checkbox";
            toggleItemCheckBox.classList.add("toggle-item-checkbox");
            toggleItemCheckBox.addEventListener(
                "change",
                controller.toggleItem
            );
            toggleItemCheckBox.checked = item.done;

            //step2:for the updateInput
            const updateItemInput = document.createElement("input");
            updateItemInput.type = "text";
            updateItemInput.classList.add("update-item-input", "hide");
            updateItemInput.value = item.name;
            updateItemInput.addEventListener(
                "keyup",
                controller.updateItemNameOnKeyUp.bind(controller)
            );
            updateItemInput.addEventListener(
                "focusout",
                controller.updateItemNameOnFocusOut.bind(controller)
            );

            //step3: display item's name
            const itemLabel = document.createElement("label");
            itemLabel.addEventListener("click", controller.turnOnUpdatingMode);
            itemLabel.textContent = item.name;
            itemLabel.classList.add("item-label");

            //step4: delete button
            const deleteItemButton = document.createElement("button");
            deleteItemButton.textContent = "x";
            deleteItemButton.className = "x-button";
            deleteItemButton.addEventListener("click", (event) =>
                controller.deleteItem(index)
            );

            if (item.done) {
                itemLabel.classList.add("item-strikethrough");
            } else {
                itemLabel.classList.remove("item-strikethrough");
            }

            //add toggleCheckBox, inputBox, itemLabel, x-button to each li element
            itemLi.appendChild(toggleItemCheckBox);
            itemLi.appendChild(itemLabel);
            itemLi.appendChild(updateItemInput);
            itemLi.appendChild(deleteItemButton);
            //the newest li is placed at the top
            todoListUl.insertBefore(itemLi, todoListUl.childNodes[0]);
        });

        // Display the button to toggle all items
        // if there is at least one item.
        // Hide the button if there are no items.
        const toggleAllItemsButton = document.querySelector(
            "#toggle-all-items-button"
        );
        if (model.countItems().numItems > 0) {
            view.displayDOMElement(toggleAllItemsButton);
        } else {
            view.hideDOMElement(toggleAllItemsButton);
        }

        // Show a "+" button if the user is typing the new item's name.
        // Hide the button if there is no input value.
        const createItemButton = document.querySelector("#create-item-button");
        const createItemInput = document.getElementById("create-item-input");
        if (createItemInput.value) {
            view.displayDOMElement(createItemButton);
        } else {
            view.hideDOMElement(createItemButton);
        }

        

    },

    /**
     * Display a DOM element.
     * @param {HTMLElement} domElement - the DOM element that you want to display
     */
    displayDOMElement: function (domElement) {
        domElement.classList.remove("hide");
    },

    /**
     * Hide a DOM element.
     * @param {HTMLElement} domElement - the DOM element that you want to hide
     */
    hideDOMElement: function (domElement) {
        domElement.classList.add("hide");
    },
};

view.displayTodoItems();