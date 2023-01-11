import { validateForms } from './validate-forms';
const rulesSubscribe = [
  {
    ruleSelector: 'input[name="email"]',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните Email'
      },
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      }
    ]
  }
];

const rulesCallback = [
  {
    ruleSelector: 'input[name="name"]',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните Имя'
      },
    ]
  },
  {
    ruleSelector: 'input[name="email"]',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните Email'
      },
      {
        rule: 'email',
        errorMessage: 'Недопустимый формат',
      }
    ]
  }
];

const afterFormSubscribe = () => {
  alert('Подписка на рассылку оформлена!');
};

const afterFormCallback = () => {
  alert('Заявка отправлена, ожидайте звонка!');
};

export const form = () => {
  validateForms('.form-subscribe', rulesSubscribe, afterFormSubscribe);
  validateForms('.form-callback', rulesCallback, afterFormCallback);
}

