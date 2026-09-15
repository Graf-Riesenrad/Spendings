
import { initSpendingFormValidation } from './spending-form-validation.js';
import { showMessageBox } from '../messaging/show-message-box.js';


const SPENDING_FORM_ID = 'edit-spending-form';

$(document).ready(function() {
    const form = document.getElementById(SPENDING_FORM_ID);
    if (!form) {
        console.error(`Form with id '${SPENDING_FORM_ID}' not found.`);
        return;
    }

    initSpendingFormValidation(SPENDING_FORM_ID);

    const button = document.getElementById('edit-spending-button');
    button.addEventListener('mouseup', function(event) {
        event.preventDefault();
        executeEdit();
    });

});

function executeEdit() {
    const form = document.getElementById(SPENDING_FORM_ID);
    if (!form || !$(form).valid()) 
        return;

    try {
        editSpending();
        showMessageBox("Spending edited successfully.", 'success');
    } catch (error) {
        console.error("Error executing edit:", error);
        showMessageBox("An unexpected error occurred. Check the console for details.", 'error');
    }
}

function editSpending() {
    const form = document.getElementById(SPENDING_FORM_ID);
    const url = form?.dataset?.editUrl;

    if (!url)
        throw new Error("Edit URL not found on form (data-edit-url).");


    const formData = new FormData(form);

    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        success: function(_data) { },
        error: function(xhr, _status, error) {
            console.error("Error status:", xhr.status);
            console.error("Error response:", xhr.responseText);
            console.error("Error message:", error);
        }
    });
}