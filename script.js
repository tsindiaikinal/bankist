'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
/* const account1 = {
  owner: 'Alex Geic',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davinchi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Piter Savin',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sasha Mosina',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4]; */
const account1 = {
  owner: 'Alex Geic',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-02-21T17:01:17.194Z',
    '2023-02-23T10:36:17.929Z',
    '2023-02-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davinchi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/* Event handlers */
let currentAccount, timer;

// Fake always logged in *********************
/* currentAccount = account1;
containerApp.style.opacity = 1;
updateUI(currentAccount); */
/* ***************************************** */

btnLogin.addEventListener('click', ev => {
  ev.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    console.log('Pin is correct! Enjoy 🎉');
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    let options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(new Date());
    console.log(navigator.language);
    init();
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogoutTimer();
  } else {
    console.log('Pin is incorrect! Sorry! 🙇');
  }
  // console.log(currentAccount);
});

btnTransfer.addEventListener('click', ev => {
  ev.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    // console.log('Transfer is valid!');
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  // console.log(receiverAcc, amount);
});

btnLoan.addEventListener('click', ev => {
  ev.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // update movements
    updateUI(currentAccount);
    inputLoanAmount.value = '';
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnClose.addEventListener('click', ev => {
  ev.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      i => i.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    console.log('Removed account!');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', ev => {
  ev.preventDefault();

  displayMovement(currentAccount, (sorted = !sorted));
});

/* *********************************************** */

/* FUNCTIONS */

// Initialization function after logging into the account
const init = function () {
  displayMovement(currentAccount);
  calcAndPrintBalance(currentAccount);
  calcAndPrintSummary(currentAccount);
};
/* ******************************* */

function displayMovement(acc, sort = false) {
  containerMovements.innerHTML = '';
  const movSorted = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movSorted.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Getting converted date and with passed days format
    const displayDate = converterDateTime(
      acc.movementsDates[i],
      acc.locale,
      true
    );
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    // Template
    const tmpl = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', tmpl);
  });
}

function createUsernames(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
createUsernames(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

const euroToUsd = 1.1;
const movmentsUSD = currentAccount?.movements.map(
  mov => +(mov * euroToUsd).toFixed(2)
);

// console.log(movmentsUSD);

function calcAndPrintBalance(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${formatCurrency(
    acc?.balance,
    acc?.locale,
    acc?.currency
  )}`;
  /* const { day, month, year, hour, minutes } = converterDateTime(new Date());
  labelDate.textContent = `${day}/${month}/${year} ${hour}:${minutes}`; */
}

function calcAndPrintSummary(acc) {
  let incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((mov, cur) => mov + cur, 0);
  let out = acc.movements
    .filter(mov => mov < 0)
    .reduce((mov, cur) => mov + cur, 0);
  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
  // `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );
  // `${Math.abs(out).toFixed(2)}€`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
  // `${interest.toFixed(2)}€`;
}

// Function for update UI
function updateUI(acc) {
  displayMovement(acc);
  calcAndPrintBalance(acc);
  calcAndPrintSummary(acc);
}

// Function Timer
const startLogoutTimer = function () {
  let time = 600;
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };

  const timer = setInterval(tick, 1000);
  return timer;
};

/* ******************************* */
/* const allmovements = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000);

const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0); */
/* ****************************** */

/* UTILITES */
function converterDateTime(date, locale, formatDaysPassed = false) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(
      Math.abs(
        (new Date(date2.toISOString()).getTime() - new Date(date1).getTime()) /
          (24 * 60 * 60 * 1000)
      )
    );
  /*  const now = new Date(date);
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const day = `${now.getDate()}`.padStart(2, 0);
  const hour = `${now.getHours()}`.padStart(2, '0');
  const minutes = `${now.getMinutes()}`.padStart(2, '0');
  const converted = {
    year,
    month,
    day,
    hour,
    minutes,
  }; */
  if (formatDaysPassed) {
    const daysPassed = calcDaysPassed(date, new Date());
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
      // return `${day}/${month}/${year}`;
      // console.log(date)
      return new Intl.DateTimeFormat(locale).format(new Date(date));
    }
  } else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

// ---------------------
function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
/* ****************************************************** */
