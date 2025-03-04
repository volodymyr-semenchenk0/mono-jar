document.addEventListener('DOMContentLoaded', () => {
    const inputBlock = document.querySelector('.money-input-block');
    const moneyInput = document.querySelector('.money-input-contenteditable');
    const subtitle = document.querySelector('.money-input-subtitle');
    const chipButtons = document.querySelectorAll('.chip-button');

    // Общие константы
    const MIN_VALUE = 10;
    const MAX_VALUE = 29999;
    const MIN_FORMATTED_VALUE = 10000;

    // Утилитные функции
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

    // Основной обработчик ввода
    const handleMoneyInput = () => {
        let value = sanitizeValue(moneyInput.textContent);
        moneyInput.textContent = formatInputValue(value);
        placeCaretAtEnd(moneyInput);
        updateInputState(value);
    };

    // Обработчик чип-кнопок
    const handleChipClick = (chip) => {
        const chipValue = sanitizeValue(chip.querySelector('.data-value').textContent);
        let currentValue = sanitizeValue(moneyInput.textContent);
        let newValue = Math.min(currentValue + chipValue, MAX_VALUE);

        moneyInput.textContent = formatInputValue(newValue);
        placeCaretAtEnd(moneyInput);

        inputBlock.classList.remove('empty', 'incorrect');
        subtitle.classList.add('hidden');
    };

    // Навешивание обработчиков
    moneyInput.addEventListener('input', handleMoneyInput);
    chipButtons.forEach(chip => chip.addEventListener('click', () => handleChipClick(chip)));

    // Обработка клика вне инпута
    document.addEventListener('click', (e) => {
        if (!inputBlock.contains(e.target)) {
            moneyInput.blur();
        }
    });

    // Установка курсора в конец при загрузке
    placeCaretAtEnd(moneyInput);
});

// Утилитные функции для работы с Dom
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