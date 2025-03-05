document.addEventListener('DOMContentLoaded', () => {
    const inputBlock = document.querySelector('.money-input-block');
    const moneyInput = document.querySelector('.money-input-contenteditable');
    const subtitle = document.querySelector('.money-input-subtitle');
    const chipButtons = document.querySelectorAll('.chip-button');
    const payButtons = document.querySelectorAll('.pay-button')
    const commentInput = document.getElementById('comment');
    const savedAmountElement = document.querySelector('.jar-stats .stats-data:first-child .data-value');
    const savedAmountContainer = document.querySelector('.jar-stats .stats-data:first-child');
    const goalAmountElement = document.querySelector('.jar-stats .stats-data:last-child .data-value');
    const jarImage = document.querySelector('.jar-glass');

    const MIN_VALUE = 10;
    const MAX_VALUE = 29999;
    const MIN_FORMATTED_VALUE = 10000;
    const CURRENCY_SYMBOL = ' ₴';
    const GOAL_AMOUNT = 10000;

    let totalSaved = parseInt(localStorage.getItem('totalSaved')) || 0;

    savedAmountElement.textContent = formatNumber(totalSaved) + CURRENCY_SYMBOL;
    goalAmountElement.textContent = formatNumber(GOAL_AMOUNT) + CURRENCY_SYMBOL;

    const updateJarImage = () => {
        const progressPercent = (totalSaved / GOAL_AMOUNT) * 100;

        if (totalSaved === 0) {
            jarImage.src = "https://send.monobank.ua/img/jar/0.png";
            savedAmountContainer.style.display = 'none';

        } else if (progressPercent >= 100) {
            jarImage.src = "https://send.monobank.ua/img/jar/uah_100.png";
        } else if (progressPercent >= 50) {
            jarImage.src = "https://send.monobank.ua/img/jar/uah_50.png";
        } else {
            jarImage.src = "https://send.monobank.ua/img/jar/uah_33.png";
            savedAmountContainer.style.display = '';
        }
    };

    const sanitizeValue = (value) => parseInt(value.trim().replace(/\D/g, ''), 10) || 0;

    const updateInputState = (value) => {
        const isValidAmount = value >= MIN_VALUE;
        const isEmpty = value === 0;

        subtitle.classList.toggle('hidden', isValidAmount);
        inputBlock.classList.toggle('incorrect', !isValidAmount && !isEmpty);
        inputBlock.classList.toggle('empty', isEmpty);
    };

    const formatInputValue = (value) => {
        if (value > MAX_VALUE) value = MAX_VALUE;
        return value >= MIN_FORMATTED_VALUE ? formatNumber(value) : value.toString();
    };

    const updateSavedAmount = (newAmount) => {
        totalSaved += newAmount;

        localStorage.setItem('totalSaved', totalSaved);
        savedAmountElement.textContent = formatNumber(totalSaved) + CURRENCY_SYMBOL;

        updateJarImage();
    };

    const resetFields = () => {
        moneyInput.textContent = '0';

        inputBlock.classList.remove('incorrect');
        inputBlock.classList.add('empty');
        subtitle.classList.remove('hidden');

        commentInput.value = '';
    };

    const handleMoneyInput = () => {
        let value = sanitizeValue(moneyInput.textContent);
        moneyInput.textContent = formatInputValue(value);
        placeCaretAtEnd(moneyInput);
        updateInputState(value);
    };

    const handleChipClick = (chip) => {
        const chipValue = sanitizeValue(chip.querySelector('.data-value').textContent);
        let currentValue = sanitizeValue(moneyInput.textContent);
        let newValue = Math.min(currentValue + chipValue, MAX_VALUE);

        moneyInput.textContent = formatInputValue(newValue);
        placeCaretAtEnd(moneyInput);

        inputBlock.classList.remove('empty', 'incorrect');
        subtitle.classList.add('hidden');
    };

    const handlePayButtonClick = (button) => {
        const amount = sanitizeValue(moneyInput.textContent);
        const comment = commentInput.value.trim();

        if (amount < MIN_VALUE) {
            console.error(`Amount must be at least ${MIN_VALUE}. `);
            return;
        }

        console.log(`Payment Method: ${button}`, {
            amount: amount,
            comment: comment || 'No comment'
        });

        resetFields();

        updateSavedAmount(amount);
    }

    moneyInput.addEventListener('input', handleMoneyInput);

    chipButtons.forEach(chip =>
        chip.addEventListener('click', () => handleChipClick(chip))
    );

    payButtons.forEach(button =>
        button.addEventListener('click', () => {
            const payButton = button.querySelector('img').alt;
            handlePayButtonClick(payButton);
        })
    );

    document.addEventListener('click', (e) => {
        if (!inputBlock.contains(e.target)) {
            moneyInput.blur();
        }
    });

    placeCaretAtEnd(moneyInput);

    updateJarImage();
});

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}