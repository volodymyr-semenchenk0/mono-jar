document.addEventListener('DOMContentLoaded', function() {
    const inputBlock = document.querySelector('.money-input-block');
    const moneyInput = document.querySelector('.money-input-contenteditable');
    const subtitle = document.querySelector('.money-input-subtitle');
    const chipButton = document.querySelector('.chip-button');

    placeCaretAtEnd(moneyInput);

    moneyInput.addEventListener('input', function() {
        inputBlock.classList.remove('empty');
        let value = moneyInput.textContent.trim().replace(/\D/g, '');
        let num = parseInt(value, 10) || 0;

        if (num > 29999) {
            num = 29999;
        }

        let formatted;
        if (num >= 10000) {
            formatted = formatNumber(num);
        } else {
            formatted = num.toString();
        }

        moneyInput.textContent = formatted;
        placeCaretAtEnd(moneyInput);

        if (num < 10) {
            subtitle.classList.remove('hidden');
            inputBlock.classList.add('incorrect');
        } else {
            subtitle.classList.add('hidden');
            inputBlock.classList.remove('incorrect');
        }

        if (num === 0) {
            inputBlock.classList.remove('incorrect');
            inputBlock.classList.add('empty');
        }
    });

    document.addEventListener('click', function(e) {
        if (!document.querySelector('.money-input-block').contains(e.target)) {
            moneyInput.blur();
        }
    });

    chipButton.addEventListener('click', function(e) {
        if (!document.querySelector('.money-input-block').contains(e.target)) {
            moneyInput.blur();
        }
    });
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