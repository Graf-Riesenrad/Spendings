

const NORMAL_SPACE = ' ';
const NON_BREAKING_SPACE = '\u00A0';
const NARROW_NO_BREAK_SPACE = '\u202F';
const TAB = '\t';
const SPACES_PATTERN = new RegExp(
    `[${NORMAL_SPACE}${NON_BREAKING_SPACE}${NARROW_NO_BREAK_SPACE}${TAB}]+`,
    'g'
);
const LEADING_SPACES_PATTERN = new RegExp(
    `^[${NORMAL_SPACE}${NON_BREAKING_SPACE}${NARROW_NO_BREAK_SPACE}${TAB}]+`
);

export const cleanAmount = value => value.replace(SPACES_PATTERN, '');
export const cleanDescription = value => value.replace(LEADING_SPACES_PATTERN, '');

export function initWhitespaceStripping(inputId, cleanValue) {
    const input = document.getElementById(inputId);
    if (!input) {
        return;
    }

    const stripWhitespace = () => {
        const cleaned = cleanValue(input.value);
        if (cleaned !== input.value) {
            input.value = cleaned;
        }
    };

    input.addEventListener('input', stripWhitespace);
    input.addEventListener('paste', () => setTimeout(stripWhitespace, 0));
}
