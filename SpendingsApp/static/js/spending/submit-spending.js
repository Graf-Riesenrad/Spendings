
import { updateRecentSpendings } from './update-recent-spendings.js';
import { initSpendingFormValidation } from './spending-form-validation.js';
import { showMessageBox } from '../messaging/show-message-box.js';
import { initAmountWhitespaceStripping } from './strip-amount-whitespace.js';


const SPENDING_FORM_ID = 'submit-spending-form';

$(document).ready(function() {
    const form = document.getElementById(SPENDING_FORM_ID);
    if (!form) {
        console.warn('Submit spending form not found — client-side validation may not work as expected.');
        return;
    }
    
    initSpendingFormValidation(SPENDING_FORM_ID);
    initAmountWhitespaceStripping();


    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        await executeSubmit();
    });
});

async function executeSubmit() {
    const form = document.getElementById(SPENDING_FORM_ID);
    if (!form || !$(form).valid()) {
        console.log('Form not found or invalid');
        return;
    }

    try {
        await sendSpendingToServer();
        updateRecentSpendings();
        resetSpendingForm();
    } catch (error) {
        showMessageBox("Error submitting spending. Please check the console for details.", 'error');
    }
}

function resetSpendingForm() {
    const form = document.getElementById(SPENDING_FORM_ID);
    if (form) {
        form.reset();
    }
}

function sendSpendingToServer() {
    var formData = new FormData(document.getElementById(SPENDING_FORM_ID));
    
    return $.ajax({
        type: "POST",
        url: DJANGO_URLS.spending_post,
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log("Spending submitted successfully:", data);
        },
        error: function(xhr, status, error) {
            console.error("Error status:", xhr.status);
            console.error("Error response:", xhr.responseText);
            console.error("Error message:", error);
        }
    });
}
