(function () {

  const HOST = "http://localhost:3000";
  const LOGOTYPE_SRC = "images/logotype.png";
  const LOGOTYPE_ALT = "Логотип";
  const MAX_COUNT_ADD_CONTACTS = 10;
  const MAX_COUNT_USER_CONTACTS = 5;
  const searchHint = true;

  let usersData = [];

  let currentUserId = null;
  let appContainer = null;
  let statusBlock = null;
  let modal = null;
  let countSelectContacts = 0;

  let orderBy = "id";
  let sortBy = "asc";

  const fieldsContact = {
    "phone": "Телефон",
    "other": "Доп телефон",
    "email": "Email",
    "vk": "Vk",
    "fb": "Facebook",
  };

  async function startAppCRM(container) {
    appContainer = container;
    statusBlock = createstatusBlock();

    container.append(createHeader(), createBody(), statusBlock);

    usersData = await getData();

    renderUsers(usersData);
    setEvents();
  }

  function sortUsers(a, b) {

    if (orderBy === "id") {
      if (sortBy === "asc") {
        return a[orderBy] - b[orderBy];
      } else {
        return b[orderBy] - a[orderBy];
      }
    } else if (orderBy === "name") {

      const aName = [a.surname, a.name, a.lastName].join(" ");
      const bName = [b.surname, b.name, b.lastName].join(" ");

      if (sortBy === "asc") {
        if (aName < bName)
          return -1;
        if (aName > bName)
          return 1;
        return 0;
      } else {
        if (aName > bName)
          return -1;
        if (aName < bName)
          return 1;
        return 0;
      }
    } else if (orderBy === "createdate") {
      if (sortBy === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    } else if (orderBy === "updatedate") {
      if (sortBy === "asc") {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    }

  }

  function createstatusBlock() {
    const block = document.createElement("div");
    block.classList.add("status-block");
    return block;
  }

  function startLoadingUsersBlock() {
    const block = appContainer.querySelector(".section-users");
    block.classList.add("section-users--loading");
  }

  function stopLoadingUsersBlock() {
    const block = appContainer.querySelector(".section-users");
    block.classList.remove("section-users--loading");
  }

  async function getData() {

    startLoadingUsersBlock();

    await wait(500);

    try {

      const res = await fetch(`${HOST}/api/clients/`);

      if (res.status === 200) {
        return res.json();
      }


    } catch (err) {
      createStatusBlockItem("Что-то пошло не так :( Попробуйте позже");
      return [];

    } finally {
      stopLoadingUsersBlock();
    }
  }

  function renderUsers(data) {
    const body = appContainer.querySelector(".users__list");
    body.innerHTML = "";
    if (data.length) {
      data.sort(sortUsers);

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const user = createUser(item);
        body.append(user);
      }
    }
  }

  function createUser(data) {
    const user = document.createElement("tr");
    const btnEdit = document.createElement("button");
    const btnDelete = document.createElement("button");

    const list = [
      "id",
      "name",
      "createdate",
      "updatedate",
      "contacts",
      "controls"
    ];

    const nodeTd = {};

    for (let i = 0; i < list.length; i++) {
      const td = document.createElement("td");
      td.classList.add("users__item", `users__item-${list[i]}`);
      nodeTd[list[i]] = td;
      user.append(td);
    }

    user.classList.add("users__element");

    nodeTd.id.textContent = data.id;
    nodeTd.name.textContent = [data.surname, data.name, data.lastName].join(" ").trim();

    btnEdit.innerHTML = `
      <svg class="users__btn-edit-svg">
        <use xlink:href="images/sprite.svg#edit" />
      </svg>

      <svg class="spinner users__btn-svg-spinner">
        <use xlink:href="images/sprite.svg#spinner" />
      </svg>
      Изменить
    `;
    btnDelete.innerHTML = `
      <svg class="users__btn-delete-svg">
        <use xlink:href="images/sprite.svg#cancel" />
      </svg>
      <svg class="spinner users__btn-svg-spinner">
        <use xlink:href="images/sprite.svg#spinner" />
      </svg>
      Удалить
    `;

    btnEdit.classList.add("users__btn-edit");
    btnDelete.classList.add("users__btn-delete");

    nodeTd.controls.append(btnEdit, btnDelete);

    nodeTd.createdate.innerHTML = formatDate(data.createdAt);
    nodeTd.updatedate.innerHTML = formatDate(data.updatedAt);

    const contacts = createUserContacts(data.contacts);

    if (contacts) {
      nodeTd.contacts.append(contacts);
    }

    return user;
  }

  function createUserContacts(contacts) {
    if (contacts.length) {
      const list = document.createElement("ul");
      list.classList.add("users__contacts");


      for (let i = 0; i < contacts.length; i++) {

        const contact = contacts[i];
        const item = document.createElement("li");
        const link = document.createElement("a");

        item.classList.add("users__contact");

        if (contacts.length !== MAX_COUNT_USER_CONTACTS) {
          if (i >= MAX_COUNT_USER_CONTACTS - 1) {
            item.classList.add("d-none");
          }
        }

        link.classList.add("users__contact-link", "tooltip");

        link.innerHTML = `
          <svg class="users__contact-link-svg">
            <use xlink:href="images/sprite.svg#${contact.type}" />
          </svg>
          <span class="tooltip__content">${fieldsContact[contact.type]}:&nbsp;${contact.value}</span>
        `;

        item.append(link);
        list.append(item);
      }

      const diff = contacts.length - MAX_COUNT_USER_CONTACTS;

      if (diff > 0) {
        const item = document.createElement("li");
        const btn = document.createElement("button");
        item.classList.add("users__contact");
        btn.classList.add("users__contact-link", "users__contact-link--more");
        btn.textContent = `+${diff + 1}`;
        item.append(btn);
        list.append(item);
      }


      return list;
    }
    return false;
  }

  function formatDate(date) {
    const newDate = new Date(date);
    return `<span class="users__item-date">${newDate.toLocaleDateString()}</span><span class="users__item-time">${newDate.toLocaleTimeString().slice(0,-3)}</span>`;
  }

  function setEvents() {
    const btnAdd = appContainer.querySelector(".btn-callmodal-add-user");
    btnAdd.addEventListener("click", async e => {
      e.preventDefault();
      modal = createModalMain();
      appContainer.append(modal);
      showModal();
    });

    appContainer.addEventListener("click", async e => {
      const target = e.target;
      let element = null;

      if (element = target.closest(".users__btn-delete")) {
        e.preventDefault();

        setBtnLoading(element);
        await wait(600);

        currentUserId = getElementIdByTarget(target);
        modal = createModalDelete();

        const data = await getUserDataById(currentUserId);

        if (data) {
          appContainer.append(modal);
          showModal();
        }

        stopBtnLoading(element);
      }

      if (element = target.closest(".users__btn-edit")) {
        e.preventDefault();

        setBtnLoading(element);
        await wait(600);

        currentUserId = getElementIdByTarget(target);
        modal = createModalMain(true);

        const data = await getUserDataById(currentUserId);

        if (data) {
          setUserModal(data);
          appContainer.append(modal);
          showModal();
        }

        stopBtnLoading(element);
      }

      if (element = target.closest(".btn-sort")) {

        orderBy = element.getAttribute("data-order");
        sortBy = element.getAttribute("data-sort");

        if (element.classList.contains("btn-sort--selected")) {

          if (sortBy === "asc") {
            element.setAttribute("data-sort", "desc");
          } else {
            element.setAttribute("data-sort", "asc");
          }
        } else {
          if (sortBy === "asc") {
            sortBy = "desc";
          } else {
            sortBy = "asc";
          }
        }

        setBtnSortSelected(element);
        renderUsers(usersData);

      }

      if (element = target.closest(".users__contact-link--more")) {
        const parent = element.closest(".users__contacts");
        const items = parent.querySelectorAll(".users__contact.d-none");

        if (items.length) {
          for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("d-none");
          }
        }

        element.remove();
      }

    });

    const search = appContainer.querySelector(".search-input");
    let searchTimer = null;

    search.addEventListener("keyup", e => {

      const value = e.target.value;

      if (searchHint) {

        if (e.key === 'Enter') {
          hideSearchHints();
          unsetSearchHints();
          showCheckedUsers(search.value);

          return false;
        }

        setSearchHints(value);
        showSearchHints();
      } else {
        clearTimeout(searchTimer);

        searchTimer = setTimeout(e => {
          startSearch(value);
        }, 300);
      }
    });

    if (searchHint) {
      search.addEventListener("blur", e => {

        if(search.value.length<=0) {
          hideSearchHints();
          unsetSearchHints();
          showCheckedUsers(search.value);
        }
      });
    }

    const hints = appContainer.querySelector(".search-input-hints");

    hints.addEventListener("click", async e => {
      const target = e.target;
      let element = null;

      if (element = target.closest(".search-input-hints__item")) {
        search.value = element.innerHTML;
        hideSearchHints();
        unsetSearchHints();
        showCheckedUsers(search.value);
      }
    });
  }

  function showCheckedUsers(query = "") {

    let users = document.querySelectorAll(".users__item-name");

    if (users.length <= 0) {
      return;
    }

    if (users.length) {

      for (let i = 0; i < users.length; i++) {
        const userName = users[i];
        const user = userName.closest(".users__element");
        if (user) {
          user.classList.remove("users__element--search");
        }
      }

    }

    if (query.length <= 0) {
      return;
    }

    query = query.toLowerCase();
    users = Array.from(users).filter(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        return item;
      }
    });

    if (users.length) {

      for (let i = 0; i < users.length; i++) {
        const userName = users[i];
        const user = userName.closest(".users__element");

        if (user) {
          user.classList.add("users__element--search");
        }
      }

      const firstUser = users[0];
      const elemRect = firstUser.getBoundingClientRect();
      window.scrollBy({
        top: elemRect.top - 100,
        behavior: 'smooth'
      });

    }

  }

  function showSearchHints() {
    const hints = appContainer.querySelector('.search-input-hints');

    if (hints.children.length) {
      hints.classList.add("search-input-hints--show");
    } else {
      hints.classList.remove("search-input-hints--show");
    }
  }

  function hideSearchHints() {
    const hints = appContainer.querySelector('.search-input-hints');
    hints.classList.remove("search-input-hints--show");
  }

  async function setSearchHints(query = "") {
    const usersList = await getSearchResult(query);

    const hints = appContainer.querySelector('.search-input-hints');
    hints.innerHTML = "";

    if (usersList.length) {
      for (let i = 0; i < usersList.length; i++) {
        hints.append(createSearchHints(usersList[i]));
      }
    }
  }

  function unsetSearchHints() {
    const hints = appContainer.querySelector('.search-input-hints');
    hints.innerHTML = "";
  }

  function createSearchHints(item) {
    const hint = document.createElement("li");
    hint.classList.add("search-input-hints__item");
    hint.innerHTML = [item.surname, item.name, item.lastName].join(" ").trim();

    return hint;
  }

  function setBtnSortSelected(element) {

    if (element.classList.contains("btn-sort--selected")) {
      return;
    }
    const selected = appContainer.querySelector(".btn-sort--selected");
    if (selected) {
      selected.classList.remove("btn-sort--selected");
    }
    element.classList.add("btn-sort--selected");
  }

  async function getSearchResult(query) {
    try {

      const res = await fetch(`${HOST}/api/clients/?search=${query}`);

      if (res.status === 200) {
        const data = res.json();
        return data;

      } else if (res.status === 404) {

        const text = await res.json();
        throw new Error(text.message);

      }

    } catch (err) {

      if (err.name === "Error") {
        createStatusBlockItem(err.message);
      } else {
        throw err;
      }
    }
  }

  function startSearchLoading() {
    const block = appContainer.querySelector(".section-users");
    block.classList.add("section-search--loading");
  }

  function stopSearchLoading() {
    const block = appContainer.querySelector(".section-users");
    block.classList.remove("section-search--loading");
  }

  async function startSearch(query = "") {

    startSearchLoading();
    await wait(1000);

    usersData = await getSearchResult(query);

    renderUsers(usersData);

    if (!usersData.length) {
      createStatusBlockItem("Ничего не найдено :(");
    }

    stopSearchLoading();

  }

  function setUserModal(data) {

    if (data) {

      const form = modal.querySelector('form');

      ["name", "surname", "lastName"].map(item => {
        setInputText(form.querySelector(`input[name="${item}"]`), data[item]);
      });

      setModalContacts(data.contacts);

      return true;
    }

    return false;

  }

  function setModalContacts(contacts) {
    if (contacts.length) {

      const form = modal.querySelector("form");
      const row = form.querySelector(".modal__row-contacts");
      const list = form.querySelector(".fields-group-contacts");

      row.classList.remove("modal__row--short");

      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const item = createModalMainFieldsSelect();

        setSelect(item, contact.type, contact.value);
        list.append(item);
      }

      checkCountContacts();
    }
  }

  function setSelect(selectRow, type, value) {
    setInputText(selectRow.querySelector(".field-text-contact"), value);

    const btnValue = selectRow.querySelector(".field-contact__value");
    const list = selectRow.querySelector(".field-contact__list");

    if (list.children.length) {
      for (let i = 0; i < list.children.length; i++) {
        const item = list.children[i];
        item.classList.remove("field-contact__item--selected");
        const input = item.querySelector(".field-contact__radio");
        const desc = item.querySelector(".field-contact__desc");

        if (input.value == type) {
          input.checked = true;
          item.classList.add("field-contact__item--selected");
          btnValue.innerHTML = desc.innerHTML;
        }
      }
    }

  }

  function setInputText(input, value) {
    input.value = value;

    if (value.length) {
      const parent = input.closest(".field-wrapper");
      if (parent) {
        parent.classList.add("field-wrapper--no-empty");
      }
    }

  }

  function initEventInput(inputs) {

    if (inputs.length <= 0) {
      return;
    }

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("blur", e => {
        const target = e.target;
        const parent = target.closest(".field-wrapper");

        if (target.value.length) {
          parent.classList.add("field-wrapper--no-empty");
        } else {
          parent.classList.remove("field-wrapper--no-empty");
        }
      });
    }

  }

  async function getUserDataById(id) {
    try {

      const res = await fetch(`${HOST}/api/clients/${id}`, {
        method: 'GET',
      });

      if (res.status === 200) {
        const data = res.json();;
        return data;

      } else if (res.status === 404) {

        const text = await res.json();
        throw new Error(text.message);

      }


    } catch (err) {
      if (err.name === "Error") {
        createStatusBlockItem(err.message);
      } else {
        throw err;
      }
    }
  }

  function setBtnLoading(target) {
    target.classList.add("users__btn--loading");
    target.setAttribute("disabled", true);
  }

  function stopBtnLoading(target) {
    target.classList.remove("users__btn--loading");
    target.removeAttribute("disabled");
  }

  async function deleteUser() {

    try {

      const res = await fetch(`${HOST}/api/clients/${currentUserId}`, {
        method: 'DELETE',
      });

      if (res.status === 200) {
        startLoadingUsersBlock();

        usersData = await getData();
        renderUsers(usersData);

        await wait(200);

        destroyModal();
        stopLoadingUsersBlock();

      } else if (res.status === 404) {

        const text = await res.json();
        throw new Error(text.message);

      }


    } catch (err) {
      if (err.name === "Error") {
        setErrors([err.message]);
      } else {
        throw err;
      }
    }
  }

  function setErrors(arrErrors) {

    deleteErrors();

    if (arrErrors.length) {
      const form = modal.querySelector("form");
      const errors = form.querySelector(".form__errors-messages");

      for (let i = 0; i < arrErrors.length; i++) {
        const error = document.createElement("li");
        error.classList.add("form__errors-message");
        error.innerHTML = arrErrors[i];
        errors.append(error);
      }
      errors.classList.remove("d-none");
    }

  }

  function deleteErrors() {
    const form = modal.querySelector("form");
    const errors = form.querySelector(".form__errors-messages");
    errors.classList.add("d-none");
    errors.innerHTML = "";
  }

  function createStatusBlockItem(text) {
    const item = document.createElement("div");
    item.classList.add("status-block__item");
    item.innerHTML = text;

    statusBlock.append(item);

    setTimeout(() => {
      item.classList.add("status-block__item--show");
    }, 50);

    setTimeout(() => {
      item.classList.remove("status-block__item--show");
    }, 2500);

    setTimeout(() => {
      item.remove();
    }, 2800);
  }

  function getElementIdByTarget(target) {
    const element = target.closest(".users__element");
    const id = element.querySelector(".users__item-id");
    return id.textContent;
  }

  function createModal() {
    const newModal = document.createElement("div");
    const shadow = document.createElement("div");
    const container = document.createElement("div");
    const content = document.createElement("div");
    const close = document.createElement("button");

    newModal.classList.add("modal");
    shadow.classList.add("modal__shadow", "js-close-modal");
    container.classList.add("modal__container");
    content.classList.add("modal__content");
    close.classList.add("modal__close", "js-close-modal");

    content.append(close);
    container.append(content);
    newModal.append(shadow, container);

    newModal.addEventListener("click", e => {
      const target = e.target;

      if (target.closest(".js-close-modal")) {
        e.preventDefault();
        destroyModal();
      }

      if (target.closest(".form__btn-add-contact")) {
        e.preventDefault();
        addContact();
        checkCountContacts();
      }

      if (target.closest(".field-contact__input")) {
        e.preventDefault();
        showSelect(target.closest(".field-contact__input"));
      }

      if (target.closest(".field-contact__item")) {
        setSelectValue(target.closest(".field-contact__item"));
        hideSelect();
      }

      if (target.closest(".btn-add-user")) {
        e.preventDefault();
        addUser();
      }

      if (!target.closest(".field-contact")) {
        hideSelect();
      }

      if (target.closest(".delete-contact")) {
        e.preventDefault();
        deleteContact(target);
        checkCountContacts();
      }

      if (target.closest(".btn-delete-user")) {
        e.preventDefault();
        deleteErrors();
        deleteUser();
      }


      if (target.closest(".btn-update-user")) {
        e.preventDefault();
        deleteErrors();
        updateUser();
      }


    });

    newModal.addEventListener("input", e => {
      const target = e.target;
      unsetInputTextError(target);
      unsetInputSelectError(target);
    });

    return newModal;
  }

  function createModalDelete() {
    const newModal = createModal();
    const content = newModal.querySelector(".modal__content");
    const form = document.createElement("form");
    const titleRow = document.createElement("div");
    const title = document.createElement("h2");
    const subtitle = document.createElement("p");

    const errorsArea = document.createElement("ul");


    const controlsRow = document.createElement("div");
    const btnDeleteWrapper = document.createElement("div");
    const btnCancelWrapper = document.createElement("div");
    const btnDelete = document.createElement("button");
    const btnCancel = document.createElement("button");


    form.classList.add("form", "modal__form");
    titleRow.classList.add("modal__row", "modal__row-pb-0");
    title.classList.add("modal__title", "modal__title--center");
    subtitle.classList.add("modal__text", "modal__text--center");
    errorsArea.classList.add("form__errors-messages", "d-none");

    title.innerHTML = "Удалить клиента";
    subtitle.innerHTML = "Вы&nbsp;действительно хотите удалить данного клиента?";

    titleRow.append(title, subtitle);

    controlsRow.classList.add("modal__row");
    btnDeleteWrapper.classList.add("form__btn-wrapper", "modal__btn-wrapper");
    btnCancelWrapper.classList.add("modal__btn-wrapper");
    btnDelete.classList.add("btn-main", "modal__btn", "btn-main--primary", "btn-delete-user");
    btnCancel.classList.add("btn-link", "modal__btn", "js-close-modal");

    btnDelete.textContent = "Удалить";
    btnCancel.textContent = "Отмена";

    btnDeleteWrapper.append(btnDelete);
    btnCancelWrapper.append(btnCancel);
    controlsRow.append(errorsArea, btnDeleteWrapper, btnCancelWrapper);

    form.append(titleRow, controlsRow);
    content.append(form);

    return newModal;
  }

  function createModalMain(edit = false) {

    const newModal = createModal();
    const content = newModal.querySelector(".modal__content");
    const form = document.createElement("form");
    const fieldsRow = document.createElement("div");
    const title = document.createElement("h2");
    const fieldsGroup = createModalMainFieldsInput();

    const contactsRow = document.createElement("div");
    const contactsGroup = document.createElement("div");

    const contactsAdd = document.createElement("button");
    const controlsRow = document.createElement("div");
    const btnSaveWrapper = document.createElement("div");
    const btnSave = document.createElement("button");
    const btnCancelWrapper = document.createElement("div");
    const btnCancel = document.createElement("button");

    const errorsArea = document.createElement("ul");

    form.classList.add("form", "modal__form");
    fieldsRow.classList.add("modal__row");

    title.classList.add("modal__title");
    title.innerHTML = "Новый клиент";

    if (edit) {
      title.innerHTML = `<span class="modal__title--mr">Изменить данные</span><span class="modal__title-id">ID: ${currentUserId}</span>`;
    }

    fieldsRow.append(title, fieldsGroup);

    contactsRow.classList.add("modal__row", "modal__row--gray", "modal__row--short", "modal__row-contacts");

    contactsGroup.classList.add("fields-group", "fields-group-contacts");
    contactsAdd.classList.add("form__btn-add-contact");
    contactsAdd.innerHTML = `
        <div class="btn-svg-wrapper">
          <svg class="btn-svg">
            <use xlink:href="images/sprite.svg#plus" />
          </svg>
        </div>
        Добавить контакт
    `;

    contactsRow.append(contactsGroup, contactsAdd);


    controlsRow.classList.add("modal__row");
    btnSaveWrapper.classList.add("form__btn-wrapper", "modal__btn-wrapper");
    btnSave.classList.add("btn-add-user", "btn-submit", "btn-main", "modal__btn", "btn-main--primary");
    btnCancelWrapper.classList.add("modal__btn-wrapper");
    btnCancel.classList.add("btn-link", "modal__btn", "js-close-modal");

    btnSave.innerHTML = `
      <svg class="load-svg">
        <use xlink:href="images/sprite.svg#spinner" />
      </svg>
      Сохранить`;
    btnCancel.innerHTML = "Отмена";

    if (edit) {
      btnSave.classList.remove("btn-add-user");
      btnSave.classList.add("btn-update-user");
      btnCancel.innerHTML = "Удалить клиента";
      btnCancel.classList.remove("js-close-modal");
      btnCancel.classList.add("btn-delete-user");
    }


    errorsArea.classList.add("form__errors-messages", "d-none");

    btnSaveWrapper.append(btnSave);
    btnCancelWrapper.append(btnCancel);

    controlsRow.append(errorsArea, btnSaveWrapper, btnCancelWrapper);

    form.append(fieldsRow, contactsRow, controlsRow);
    content.append(form);

    const inputsText = form.querySelectorAll(".field-text");
    initEventInput(inputsText);

    return newModal;

  }

  function createModalMainFieldsInput() {
    const fieldsGroup = document.createElement("div");
    const fields = [{
        code: "surname",
        required: true,
        name: "Фамилия"
      },
      {
        code: "name",
        required: true,
        name: "Имя"
      },
      {
        code: "lastName",
        required: false,
        name: "Отчество"
      }
    ];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const item = document.createElement("label");
      const input = document.createElement("input");
      const desc = document.createElement("span");

      item.classList.add("field-wrapper");
      input.name = field.code;
      input.classList.add("field-text");
      desc.classList.add("field-desc");
      desc.textContent = field.name;

      if (field.required) {
        const star = document.createElement("span");
        star.classList.add("field-desc__star");
        star.textContent = "*";
        desc.append(star);
      }

      item.append(input, desc);
      fieldsGroup.append(item);
    }

    fieldsGroup.classList.add("fields-group");

    return fieldsGroup;

  }

  function createModalMainFieldsSelect() {

    const fieldsRow = document.createElement("div");
    const select = document.createElement("div");
    const selectBtn = document.createElement("button");
    const selectList = document.createElement("div");
    const inputContact = document.createElement("input");
    const deleteBtn = document.createElement("button");


    select.classList.add("field-contact");
    fieldsRow.classList.add("field-row", "field-contact-row");
    selectBtn.classList.add("field-contact__input");
    selectBtn.innerHTML = `<span class="field-contact__value"></span>
      <svg class="field-contact__arrow">
        <use xlink:href="images/sprite.svg#shevron" />
      </svg>`;
    selectList.classList.add("field-contact__list");

    for (const type in fieldsContact) {
      const value = fieldsContact[type];
      const item = document.createElement("label");
      const input = document.createElement("input");
      const desc = document.createElement("span");

      item.classList.add("field-contact__item");
      input.classList.add("field-contact__radio");
      input.type = "radio";
      input.name = `contactsType_${countSelectContacts}`;
      input.value = type;
      desc.textContent = value;
      desc.classList.add("field-contact__desc");

      item.append(input, desc);

      selectList.append(item);
    }

    const firstItem = selectList.firstChild;
    firstItem.classList.add("field-contact__item--selected");
    const firstInput = firstItem.querySelector("input");
    firstInput.checked = true;
    const mainDesc = selectBtn.querySelector(".field-contact__value");
    mainDesc.textContent = fieldsContact["phone"];

    inputContact.classList.add("field-text-border", "field-text-contact");
    inputContact.placeholder = "Введите данные контакта";
    inputContact.name = `contactsValue_${countSelectContacts}`;


    deleteBtn.classList.add("delete-contact", "tooltip");
    deleteBtn.innerHTML = `
      <svg class="delete-contact__svg">
        <use xlink:href="images/sprite.svg#remove" />
      </svg>
      <span class="tooltip__content">Удалить&nbsp;контакт</span>
    `;

    select.append(selectBtn, selectList);
    fieldsRow.append(select, inputContact, deleteBtn);


    countSelectContacts++;
    return fieldsRow;

  }

  function destroyModal() {

    if (!modal) {
      return;
    }

    modal.classList.remove("modal--show");

    setTimeout(() => {
      modal.remove();
      document.body.classList.remove("overflow-hidden");
    }, 300);


    countSelectContacts = 0;
    currentUserId = null;

  }

  function showModal() {

    if (!modal) {
      return;
    }

    document.body.classList.add("overflow-hidden");
    modal.classList.add("modal--display");

    setTimeout(() => {
      modal.classList.add("modal--show");
    }, 50);
  }

  function checkCountContacts() {
    const list = modal.querySelector(".fields-group-contacts");
    const btn = modal.querySelector(".form__btn-add-contact");

    if (list.children.length >= MAX_COUNT_ADD_CONTACTS) {
      btn.classList.add("d-none");
      list.classList.add("fields-group--no-mb");
      return false;
    } else {
      list.classList.remove("fields-group--no-mb");
      btn.classList.remove("d-none");
    }

    return true;
  }

  function startLoadingSaveModal() {
    const btnSave = modal.querySelector(".btn-submit");
    btnSave.classList.add("btn-loading");
    btnSave.setAttribute("disabled", true);
  }

  function stopLoadingSaveModal() {
    const btnSave = modal.querySelector(".btn-submit");
    btnSave.classList.remove("btn-loading");
    btnSave.removeAttribute("disabled");
  }

  function getUserContacts() {
    const form = appContainer.querySelector(".modal__form");
    const formData = new FormData(form);
    const contacts = [];

    const contactsTypes = {};
    const contactsValues = {};

    for (const [key, value] of formData.entries()) {

      if (/^contactsType/i.test(key)) {
        const index = key.split('_')[1];
        contactsTypes[`id_${index}`] = value;

      } else if (/^contactsValue/i.test(key)) {
        const index = key.split('_')[1];
        contactsValues[`id_${index}`] = value;
      }
    }

    for (const index in contactsTypes) {

      if (contactsValues[index].length) {
        contacts.push({
          type: contactsTypes[index],
          value: contactsValues[index],
        });
      }
    }

    return contacts;
  }

  function createUserData() {
    const form = appContainer.querySelector(".modal__form");
    const inputs = {};
    const contacts = getUserContacts();

    ["name", "surname", "lastName"].map(item => {
      inputs[item] = form.querySelector(`input[name="${item}"]`);
    });

    const result = {
      name: inputs["name"].value,
      surname: inputs["surname"].value,
      lastName: inputs["lastName"].value,
      contacts: contacts
    };


    return result;

  }


  async function updateUser() {

    if (!validation()) {
      return false;
    }

    try {

      startLoadingSaveModal();
      await wait(1000);

      const user = createUserData();

      const res = await fetch(`${HOST}/api/clients/${currentUserId}`, {
        method: 'PATCH',
        body: JSON.stringify(user),
        header: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {

        usersData = await getData();
        renderUsers(usersData);
        destroyModal();

      }

      if (res.status === 422) {
        const text = await res.json();
        const errorsMessage = [];
        for (let i = 0; i < text.errors.length; i++) {
          errorsMessage.push(text.errors[i].message);
        }

        throw new Error(errorsMessage.join(";"));
      }

    } catch (err) {

      if (err.name === "Error") {
        setErrors(err.message.split(";"));
      } else {
        throw err;
      }

    } finally {
      stopLoadingSaveModal();
    }
  }

  function setInputTextError(input) {
    input.classList.add("field-text--error");
  }

  function unsetInputTextError(input) {
    input.classList.remove("field-text--error");
  }

  function setInputSelectError(input) {
    const parent = input.closest(".field-contact-row");
    if (parent) {
      parent.classList.add("field-contact-row--error");
    }
  }

  function unsetInputSelectError(input) {
    const parent = input.closest(".field-contact-row");
    if (parent) {
      parent.classList.remove("field-contact-row--error");
    }
  }

  function validation() {

    let success = true;
    const form = modal.querySelector("form");

    ["name", "surname"].map(item => {
      const input = form.querySelector(`input[name="${item}"]`);
      if (input.value.length <= 0) {
        setInputTextError(input);
        success = false;
      }
    });

    const contacts = form.querySelectorAll("input.field-text-contact");

    if (contacts.length) {

      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        if (contact.value.length <= 0) {
          setInputSelectError(contact);
          success = false;
        }

      }
    }

    return success;
  }

  async function addUser() {

    if (!validation()) {
      return false;
    }

    try {

      startLoadingSaveModal();
      await wait(1000);

      const user = createUserData();

      const res = await fetch(`${HOST}/api/clients/`, {
        method: 'POST',
        body: JSON.stringify(user),
        header: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 201) {
        usersData = await getData();
        renderUsers(usersData);
        destroyModal();
      }


      if (res.status === 422) {
        const text = await res.json();
        const errorsMessage = [];
        for (let i = 0; i < text.errors.length; i++) {
          errorsMessage.push(text.errors[i].message);
        }

        throw new Error(errorsMessage.join(";"));
      }

    } catch (err) {
      if (err.name === "Error") {
        setErrors(err.message.split(";"));
      } else {
        throw err;
      }
    } finally {
      stopLoadingSaveModal();
    }

  }

  function setSelectValue(target) {
    const select = target.closest(".field-contact");
    const desc = target.querySelector(".field-contact__desc");
    const oldInput = select.querySelector(".field-contact__item--selected");
    const newValue = select.querySelector(".field-contact__value");

    oldInput.classList.remove("field-contact__item--selected");
    target.classList.add("field-contact__item--selected");
    newValue.textContent = desc.textContent;
  }

  function showSelect(target) {
    const select = target.closest(".field-contact");

    if (!select) {
      return false;
    }

    select.classList.add("field-contact--display");

    setTimeout(() => {
      select.classList.add("field-contact--show");
    }, 50);

  }

  function hideSelect() {
    const selects = modal.querySelectorAll(".field-contact--display");
    if (selects.length) {
      for (let i = 0; i < selects.length; i++) {
        selects[i].classList.remove("field-contact--show");

        setTimeout(() => {
          selects[i].classList.remove("field-contact--display");
        }, 500);
      }
    }
  }

  function addContact() {
    const row = modal.querySelector(".modal__row-contacts");
    const list = modal.querySelector(".fields-group-contacts");

    if (checkCountContacts()) {
      row.classList.remove("modal__row--short");
      list.append(createModalMainFieldsSelect());
    }
  }

  function deleteContact(target) {
    const row = modal.querySelector(".modal__row-contacts");
    const list = modal.querySelector(".fields-group-contacts");
    const contact = target.closest(".field-contact-row");
    contact.remove();

    if (list.children.length <= 0) {
      row.classList.add("modal__row--short");
    }
  }

  function createHeader() {

    const header = document.createElement("header");
    const headerContainer = document.createElement("div");
    const logotype = document.createElement("img");
    const logotypeLink = document.createElement("a");
    const searchInput = document.createElement("input");
    const searchInputWrapper = document.createElement("div");
    const searchInputHints = document.createElement("ul");

    header.classList.add("header");
    headerContainer.classList.add("container-lg", "header__container");

    logotypeLink.classList.add("logo", "header__logo");

    logotype.classList.add("logo__img");
    logotype.src = LOGOTYPE_SRC;
    logotype.alt = LOGOTYPE_ALT;

    searchInput.classList.add("field-text", "search-input", "header__search-input");
    searchInput.type = "text";
    searchInput.placeholder = "Введите запрос";

    searchInputWrapper.classList.add("search-input-wrapper");

    searchInputHints.classList.add("search-input-hints");
    searchInputWrapper.append(searchInput, searchInputHints);

    logotypeLink.append(logotype);
    headerContainer.append(logotypeLink);
    headerContainer.append(searchInputWrapper);
    header.append(headerContainer);

    return header;
  }

  function createBody() {

    const main = document.createElement("main");
    const mainContainer = document.createElement("div");
    const mainTitle = document.createElement("h2");
    const usersBlock = createUsersBlock();
    const btnAdd = createUsersBlockBtnAdd();

    mainTitle.classList.add("section-title");
    mainTitle.textContent = "Клиенты";

    mainContainer.classList.add("container", "section-users");
    mainContainer.append(mainTitle, usersBlock, btnAdd);
    main.append(mainContainer);

    return main;
  }

  function createUsersBlockBtnAdd() {
    const btn = document.createElement("button");
    btn.classList.add("btn-main", "btn-main--secondary", "btn-callmodal-add-user");
    btn.innerHTML = `
        <svg class="btn-main__svg">
          <use xlink:href="images/sprite.svg#add-client" />
        </svg>
        Добавить клиента
    `;

    return btn;
  }

  function createUsersBlockSpinner() {
    const spinner = document.createElement("div");
    spinner.classList.add("spin-area");
    spinner.innerHTML = `
        <svg class="spinner section-users__body-spinner">
          <use xlink:href="images/sprite.svg#spinner" />
        </svg>`;
    return spinner;
  }

  function createUsersBlock() {
    const block = document.createElement("div");
    const table = document.createElement("table");
    const thead = createUsersHeader();
    const tBody = document.createElement("tbody");
    const spinner = createUsersBlockSpinner();

    block.classList.add("section-users__body", "scrollbar-hidden");
    table.classList.add("users");
    tBody.classList.add("users__list");

    table.append(thead, tBody);
    block.append(table, spinner);

    return block;
  }

  function createUsersHeader() {
    const headerItemsSort = [{
        code: "id",
        name: "ID",
        measure: "",
        ariaLabel: "Сортировать по идентификатору"
      },
      {
        code: "name",
        name: "Фамилия Имя Отчество",
        measure: "А-Я",
        ariaLabel: "Сортировать по имени"
      },
      {
        code: "createdate",
        name: "Дата и время создания",
        measure: "",
        ariaLabel: "Сортировать по дате создания"
      },
      {
        code: "updatedate",
        name: "Последние изменения",
        measure: "",
        ariaLabel: "Сортировать по дате последнего изменения"
      }
    ];

    const headerItems = [{
        code: "contacts",
        name: "Контакты"
      },
      {
        code: "controls",
        name: "Действия"
      }
    ];

    const thead = document.createElement("thead");

    for (let i = 0; i < headerItemsSort.length; i++) {
      const item = headerItemsSort[i];

      const th = document.createElement("th");
      const btn = document.createElement("button");
      btn.innerHTML = `${item.name}<svg class="btn-sort__svg">
        <use xlink:href="images/sprite.svg#arrow" />
      </svg>`;

      if (item.measure.length > 0) {
        btn.innerHTML += `&nbsp;<span class="btn-sort__measure">${item.measure}</span>`;
      }

      th.classList.add("users__header", `users__header-${item.code}`);

      btn.classList.add("btn-sort");
      btn.setAttribute("data-order", `${item.code}`);
      btn.setAttribute("data-sort", "desc");
      btn.setAttribute("aria-label", `${item.ariaLabel}`);

      th.append(btn);
      thead.append(th);
    }

    const elementId = thead.querySelector(".btn-sort[data-order='id']");
    elementId.classList.add("btn-sort--selected");

    for (let i = 0; i < headerItems.length; i++) {
      const item = headerItems[i];
      const th = document.createElement("th");
      th.classList.add("users__header", `users__header-${item.code}`);
      th.textContent = item.name;
      thead.append(th);
    }

    return thead;
  }

  function wait(ms, success = true) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success)
          resolve();
        else
          reject();

      }, ms);
    });
  }

  window.startAppCRM = startAppCRM;
})();
