const SPENDING_FORM_RULES = {
    spendingDate: {
        required: true
    },
    description: {
        required: true,
        minlength: 2
    },
    amount: {
        required: true,
        number: true,
        min: 0.01
    },
    category: {
        required: true
    }
};

const SPENDING_FORM_MESSAGES = {
    spendingDate: "Please enter a date",
    description: "Description is required (min 2 characters)",
    amount: "Please enter a valid amount (numeric greater than or equal 0.01)",
    category: "Please select a category"
};

export function initSpendingFormValidation(formId) {
    if (typeof $(`#${formId}`).validate !== 'function') {
        console.warn('jQuery Validate plugin not found — client-side validation disabled for', formId);
        return;
    }

    $(`#${formId}`).validate({
        rules: SPENDING_FORM_RULES,
        messages: SPENDING_FORM_MESSAGES
    });
}
