

const VALIDATION_RULES = {
    month: {
        required: true
    },
    year: {
        required: true,
        rangelength: [4, 4],
        number: true,
        min: 2000
    }
}

const VALIDATION_MESSAGES = {
    month: {
        required: "Month is required"
    },
    year: {
        required: "Year is required",
        rangelength: "Year must be 4 digits",
        number: "Year must be a number",
        min: "Year must be 2000 or later"
    }
}


export function initMonthFormValidation(formId) {
    if (typeof $(`#${formId}`).validate !== 'function') {
        console.warn('jQuery Validate plugin not found — client-side validation disabled for', formId);
        return;
    }

    $(`#${formId}`).validate({
        rules: VALIDATION_RULES,
        messages: VALIDATION_MESSAGES
    });
}
