import { initCategoryFormValidation } from './category-form-validate.js';
import { categoryTableUpdate } from './category-table-update.js';
import { showMessageBox } from '../messaging/show-message-box.js';

const CATEGORY_FORM_ID = 'category-form';
const SUBMIT_BTN_ID = 'category-submit-btn';

$(document).ready(function() {
    const form = document.getElementById(CATEGORY_FORM_ID);
    if (!form) {
        console.error("category-post: form element with id 'category-form' not found");
        return;
    }

    initCategoryFormValidation(CATEGORY_FORM_ID);

    $(`#${SUBMIT_BTN_ID}`).on('click', function(e) {
        e.preventDefault();
        executeCategoryPost(); 
    });
});

async function executeCategoryPost() {
    const form = document.getElementById(CATEGORY_FORM_ID);

    if (!$(form).valid())
        return;

    const formData = new FormData(form);
    try {
        await submitCategoryToServer(formData);
        form.reset();
        categoryTableUpdate();
    } catch (error) {
        console.error("Error submitting category to server:", error);
        showMessageBox("Error submitting category. Check the console for details.", 'error');
    }
}

async function submitCategoryToServer(formData) {
    await $.ajax({
        type: "POST",
        url: DJANGO_URLS.category_post,
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