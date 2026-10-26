

const NORMAL_SPACE = ' ';
const NON_BREAKING_SPACE = '\u00A0';
const NARROW_NO_BREAK_SPACE = '\u202F';
const SPACES_PATTERN = new RegExp(
    `[${NORMAL_SPACE}${NON_BREAKING_SPACE}${NARROW_NO_BREAK_SPACE}]+`,
    'g'
);

export function initAmountWhitespaceStripping(inputId = 'id_amount') {
    const input = document.getElementById(inputId);
    if (!input) {
        return;
    }

    const stripWhitespace = () => {
        const cleaned = input.value.replace(SPACES_PATTERN, '');
        if (cleaned !== input.value) {
            input.value = cleaned;
        }
    };

    input.addEventListener('input', stripWhitespace);
    input.addEventListener('paste', () => setTimeout(stripWhitespace, 0));
}
