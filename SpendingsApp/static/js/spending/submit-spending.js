
import { updateRecentSpendings } from './update-recent-spendings.js';
import { initSpendingFormValidation } from './spending-form-validation.js';
import { showMessageBox } from '../messaging/show-message-box.js';

$(document).ready(function() {
    const form = document.getElementById('submit-spending-form');
    if (!form) {
        console.warn('Submit spending form not found — client-side validation may not work as expected.');
        return;
    }
    
    initSpendingFormValidation("submit-spending-form");


    const submitButton = document.getElementById('submit-spending-btn');
    submitButton.addEventListener('click', async function(event) {
        event.preventDefault();
        await executeSubmit();
    });
});

async function executeSubmit() {
    const form = document.getElementById('submit-spending-form');
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
    const form = document.getElementById('submit-spending-form');
    if (form) {
        form.reset();
    }
}

function sendSpendingToServer() {
    var formData = new FormData(document.getElementById('submit-spending-form'));
    
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
