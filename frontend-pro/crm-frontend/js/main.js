(function() {

  const MESS_SEARCH_INPUT_PLACEHOLDER = 'Введите запрос',
        LOGOTYPE_SRC = 'images/logotype.png',
        LOGOTYPE_ALT = 'Логотип',
        TITLE_TABLE = 'Клиенты',
        TABLE_TH_ID = 'ID',
        TABLE_TH_NAME = 'Фамилия Имя Отчество',
        TABLE_TH_CREATE = 'Дата и время создания',
        TABLE_TH_EDIT = 'Последние изменения',
        TABLE_TH_CONTACTS = 'Контакты',
        TABLE_TH_ACTIONS = 'Действия',
        TABLE_BTN_EDIT = 'Изменить',
        TABLE_BTN_DELETE = 'Удалить',
        DESC_BTN_ADD_CLIENT = 'Добавить клиента',
        FORM_TITLE_NEW_CLIENT = 'Новый клиент',
        FORM_BTN_ADD_CONTACT = 'Добавить контакт',
        FORM_BTN_SAVE = 'Сохранить',
        FORM_BTN_CANCEL = 'Отмена',
        FORM_CONTACT_INPUT_PLACEGOLDER = 'Введите данные контакта';

  const optionsContact = [
    {
      'name': 'Телефон',
      'value': 'phone',
    },
    {
      'name': 'Email',
      'value': 'email',
    },
    {
      'name': 'Facebook',
      'value': 'fb',
    },
    {
      'name': 'VK',
      'value': 'vk',
    },
    {
      'name': 'Другое',
      'value': 'other',
    }

  ];
  const arr = [{
    name: 'Денис',
    surname: 'Скворцов',
    middleName: 'Юрьевич',
    contacts: [],
    id: 123454,
    create: {
      date: '21.02.2020',
      time: '12:41'
    },
    edit:{
      date: '21.02.2021',
      time: '12:50'
    }
  },
  {
    name: 'Денис',
    surname: 'Скворцов',
    middleName: 'Юрьевич',
    contacts: [
      {
        type: 'phone',
        value: '+71234567890'
      },
      {
        type: 'viber',
        value: '+71234567890'
      },
      {
        type: 'other',
        value: '+71234567890'
      }
    ],
    id: 123455,
    create: {
      date: '21.02.2021',
      time: '12:41'
    },
    edit:{
      date: '21.02.2021',
      time: '12:50'
    }
  }];

  // const now = new Date();

  // console.log('Год', now.getFullYear());
  // console.log('Месяц', now.getMonth() + 1);
  // console.log('День', now.getDate());
  // console.log('Часы', now.getHours());
  // console.log('Минуты', now.getMinutes());

  // console.log(now.toLocaleDateString());

  function startAppCRM(container) {

    const header = createDisplayHeader(),
          body = createDisplayBody(),
          table = createDisplayTable(),
          btnAddClient = createBtnAddClient(),
          preload = createDisplayPreload();

    for (const item of arr) {
      table.tBody.append(createDisplayTableItem(item));
    }


    body.mainContainer.append(table.table, btnAddClient);

    btnAddClient.addEventListener('click', (e) => {

        e.preventDefault();
        const modal = createModalBlock();
        document.body.append(modal);

    });

    container.append(header, body.main, preload);
  }

  function createForm(type = 'new') {
    const form = document.createElement('form');
    let fields = null;

    form.classList.add('form');

    switch (type) {
      case 'edit':

        break;

      case 'delete':

        break;

      case 'new':
      default:
        fields = createFormNewClient();
        form.append(fields.containerFields, fields.containerContacts, fields.containerBtns);
        break;
    }

    return {
      form: form,
      btnSave: fields.btnSave,
      btnCancel: fields.btnCancel
    };
  }

  function createFormField(item) {
    const fieldWrapper = document.createElement('div'),
          fieldDesc = document.createElement('span'),
          fieldInput = document.createElement('input');


    fieldWrapper.classList.add('field-wrapper');
    fieldDesc.classList.add('field-desc');
    fieldInput.classList.add('field-text');

    fieldDesc.textContent = item.desc;
    fieldInput.name = item.name;
    fieldInput.type = 'text';

    if(item.require) {
      const requireStar = document.createElement('span');
      requireStar.classList.add('field-desc__star');
      requireStar.textContent = '*';
      fieldDesc.append(requireStar);
    }

    fieldWrapper.append(fieldDesc);
    fieldWrapper.append(fieldInput);

    return fieldWrapper;
  }

  function createFormNewClient() {

    const containerFields = document.createElement('div'),
          containerGroup = document.createElement('div'),
          title = document.createElement('h2'),
          fields = [
            {
              name: 'surname',
              desc: 'Фамилия',
              require: true
            },
            {
              name: 'name',
              desc: 'Имя',
              require: true
            },
            {
              name: 'MiddleName',
              desc: 'Отчество',
              require: false
            }
          ],
          containerContacts = document.createElement('div'),
          contactsFields = document.createElement('div'),
          contactsBtn = document.createElement('button'),
          containerBtns = document.createElement('div'),
          btnWrapSave = document.createElement('div'),
          btnSave = document.createElement('button'),
          btnWrapCancel = document.createElement('div'),
          btnCancel = document.createElement('button');

    containerGroup.classList.add('fields-group');

    for (let i = 0; i < fields.length; i++) {
      const item = createFormField(fields[i]);
      containerGroup.append(item);
    }

    title.classList.add('modal-block__title');
    title.textContent = FORM_TITLE_NEW_CLIENT;

    containerFields.classList.add('form__container');
    containerFields.append(title, containerGroup);


    containerContacts.classList.add('contacts-container');
    contactsFields.classList.add('contacts-list');
    contactsBtn.classList.add('add-contact');
    contactsBtn.textContent = FORM_BTN_ADD_CONTACT;

    contactsBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      const contactField = document.createElement('div'),
            contactFieldSelect = document.createElement('select'),
            contactFieldInput = document.createElement('input'),
            contactFieldBtn = document.createElement('button');

      contactFieldSelect.classList.add('select');
      contactFieldInput.classList.add('field-text-border');
      //contactFieldInput.placeholder = ;
      contactFieldBtn.classList.add('delete-contact');

      contactField.classList.add('fields-group', 'field-row');
      contactsFields.append(contactField);
    });
    containerContacts.append(contactsFields);
    containerContacts.append(contactsBtn);

    containerBtns.classList.add('form__container');

    btnWrapSave.classList.add('btn-wrapper');
    btnWrapCancel.classList.add('btn-wrapper');

    btnSave.classList.add('btn-main');
    btnCancel.classList.add('btn-link');

    btnSave.textContent = FORM_BTN_SAVE;
    btnCancel.textContent = FORM_BTN_CANCEL;

    btnWrapSave.append(btnSave);
    btnWrapCancel.append(btnCancel);

    containerBtns.append(btnWrapSave, btnWrapCancel);

    return {
      containerFields: containerFields,
      containerContacts: containerContacts,
      containerBtns: containerBtns,
      btnSave: btnSave,
      btnCancel: btnCancel
    };
  }

  function closeModalBlock(modal) {
    event.preventDefault();
    modal.remove();
  }

  function createModalBlock(type = 'new') {

    const modal = document.createElement('div'),
          modalShadow = document.createElement('div'),
          modalContainer = document.createElement('div'),
          modalInner = document.createElement('div'),
          modalClose = document.createElement('button');
          form = createForm(type);

    modal.classList.add('modal-block');
    modalShadow.classList.add('modal-block__shadow');
    modalContainer.classList.add('modal-block__container');
    modalInner.classList.add('modal-block__inner');
    modalClose.classList.add('modal-block__close');

    modalClose.addEventListener('click', () => closeModalBlock(modal), false);
    modalShadow.addEventListener('click', () => closeModalBlock(modal), false);

    form.btnSave.addEventListener('click', () => closeModalBlock(modal), false);
    form.btnCancel.addEventListener('click', () => closeModalBlock(modal), false);

    modalInner.append(form.form);
    modalContainer.append(modalInner);
    modal.append(modalShadow);
    modal.append(modalContainer);
    modalContainer.append(modalClose);

    return modal;
  }

  function createBtnAddClient(container) {
    const btn = document.createElement('button');
    btn.classList.add('add-client');
    btn.textContent = DESC_BTN_ADD_CLIENT;

    return btn;
  }

  function createDisplayHeader() {
    const header = document.createElement('header'),
          headerContainer = document.createElement('div'),
          logotype = document.createElement('img'),
          logotypeLink = document.createElement('a'),
          searchInput = document.createElement('input');

    header.classList.add('header');
    headerContainer.classList.add('container-lg', 'header__container');
    logotypeLink.classList.add('logotype', 'header__logotype');
    logotype.classList.add('logotype__img');
    logotype.src = LOGOTYPE_SRC;
    logotype.alt = LOGOTYPE_ALT;
    searchInput.classList.add('search-input', 'header__search-input');
    searchInput.type = 'text';
    searchInput.placeholder = MESS_SEARCH_INPUT_PLACEHOLDER;

    logotypeLink.append(logotype);
    headerContainer.append(logotypeLink);
    headerContainer.append(searchInput);
    header.append(headerContainer);

    return header;
  }

  function createDisplayTableItem(item) {

    const tr = document.createElement('tr'),
          tdID = document.createElement('td'),
          tdName = document.createElement('td'),
          tdCreate = document.createElement('td'),
          tdCreateDate = document.createElement('span'),
          tdCreateTime = document.createElement('span'),
          tdEdit = document.createElement('td'),
          tdEditDate = document.createElement('span'),
          tdEditTime = document.createElement('span'),
          tdContacts = document.createElement('td'),
          tdActions = document.createElement('td'),
          tdActionsWrap = document.createElement('div'),
          tdActionnEdit = document.createElement('button'),
          tdActionnDelete = document.createElement('button');

    tdID.classList.add('table-list__body', 'table-list__body-id');
    tdName.classList.add('table-list__body');
    tdCreate.classList.add('table-list__body');
    tdEdit.classList.add('table-list__body');
    tdContacts.classList.add('table-list__body');
    tdActions.classList.add('table-list__body');

    tdCreateDate.classList.add('table-list__date');
    tdCreateTime.classList.add('table-list__time');
    tdEditDate.classList.add('table-list__date');
    tdEditTime.classList.add('table-list__time');

    tdActionsWrap.classList.add('table-list__actions');
    tdActionnEdit.classList.add('table-list__action', 'table-list__action-edit');
    tdActionnDelete.classList.add('table-list__action', 'table-list__action-delete');

    tdID.textContent = item.id;
    tdName.textContent = `${item.surname} ${item.name} ${item.middleName}`;

    tdCreateDate.textContent = item.create.date;
    tdCreateTime.textContent = item.create.time;

    tdCreate.append(tdCreateDate);
    tdCreate.append(tdCreateTime);

    tdEditDate.textContent = item.edit.date;
    tdEditTime.textContent = item.edit.time;

    tdEdit.append(tdEditDate);
    tdEdit.append(tdEditTime);


    if(item.contacts.length > 0) {
      for (const contact of item.contacts) {
        const contactElement = document.createElement('a'),
              contactElementText = document.createElement('span');

        if(contact.type.length <= 0)
          contact.type = 'other';

        contactElement.classList.add('soc-link', contact.type);
        contactElementText.classList.add('soc-tooltip');
        contactElementText.textContent = contact.value;
        contactElement.append(contactElementText);

        tdContacts.append(contactElement);
      }
    }

    tdActionnEdit.textContent = TABLE_BTN_EDIT;
    tdActionnDelete.textContent = TABLE_BTN_DELETE;

    tdActionsWrap.append(tdActionnEdit);
    tdActionsWrap.append(tdActionnDelete);
    tdActions.append(tdActionsWrap);

    tr.append(tdID);
    tr.append(tdName);
    tr.append(tdCreate);
    tr.append(tdEdit);
    tr.append(tdContacts);
    tr.append(tdActions);

    return tr;
  }
  function createDisplayTableHeader() {

    const thead = document.createElement('thead'),
          theadTr = document.createElement('tr'),
          thID = document.createElement('th'),
          thName = document.createElement('th'),
          thCreate = document.createElement('th'),
          thEdit = document.createElement('th'),
          thIDBtn = document.createElement('button'),
          thNameBtn = document.createElement('button'),
          thCreateBtn = document.createElement('button'),
          thEditBtn = document.createElement('button'),
          thContacts = document.createElement('th'),
          thActions = document.createElement('th');

    thID.classList.add('table-list__head');
    thName.classList.add('table-list__head');
    thCreate.classList.add('table-list__head');
    thEdit.classList.add('table-list__head');

    thIDBtn.classList.add('table-list__sort');
    thNameBtn.classList.add('table-list__sort');
    thCreateBtn.classList.add('table-list__sort');
    thEditBtn.classList.add('table-list__sort');

    thContacts.classList.add('table-list__head');
    thActions.classList.add('table-list__head');

    thIDBtn.textContent = TABLE_TH_ID;
    thNameBtn.textContent = TABLE_TH_NAME;
    thCreateBtn.textContent = TABLE_TH_CREATE;
    thEditBtn.textContent = TABLE_TH_EDIT;
    thContacts.textContent = TABLE_TH_CONTACTS;
    thActions.textContent = TABLE_TH_ACTIONS;


    thID.append(thIDBtn);
    thName.append(thNameBtn);
    thCreate.append(thCreateBtn);
    thEdit.append(thEditBtn);

    theadTr.append(thID);
    theadTr.append(thName);
    theadTr.append(thCreate);
    theadTr.append(thEdit);
    theadTr.append(thContacts);
    theadTr.append(thActions);

    thead.append(theadTr);
    return thead;
  }
  function createDisplayTable() {
    const table = document.createElement('table'),
          thead = createDisplayTableHeader(),
          tBody = document.createElement('tbody');

    table.classList.add('table-list')
    table.append(thead);
    table.append(tBody);

    return {
      table:table,
      tBody:tBody
    }
  }

  function createDisplayBody() {

    const main = document.createElement('main'),
          mainContainer = document.createElement('div'),
          mainTitle = document.createElement('h2');


    mainTitle.classList.add('table-title');
    mainTitle.textContent = TITLE_TABLE;
    main.classList.add('main');

    mainContainer.classList.add('container');
    mainContainer.append(mainTitle);
    main.append(mainContainer);

    return {
      main: main,
      mainContainer: mainContainer
    };
  }

  function createDisplayPreload() {

    const preload = document.createElement('div');
    preload.classList.add('loading-container');
    return preload;
  }

  window.startAppCRM = startAppCRM;

})();
