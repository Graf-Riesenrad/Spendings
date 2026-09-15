
import { initCategoryFormValidation } from "./category-form-validate.js";
import { showMessageBox } from "../messaging/show-message-box.js";

const CATEGORY_FORM_ID = "category-form";

$(document).ready(function() {
    const form = document.getElementById(CATEGORY_FORM_ID);
    if (!form) {
        console.error(`category-edit: form element with id '${CATEGORY_FORM_ID}' not found`);
        return;
    }
    
    initCategoryFormValidation(CATEGORY_FORM_ID);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!$(form).valid()) 
            return;
        

        const formData = new FormData(form);
        const url = form.getAttribute("url");

        $.ajax({
            type: "POST",
            url: url,
            data: formData,
            processData: false,
            contentType: false
        }).done(function(_data) {
            showMessageBox("Category edited successfully.", "success");
        }).fail(function(xhr, _status, error) {
            console.error("Error status:", xhr.status);
            console.error("Error response:", xhr.responseText);
            console.error("Error message:", error);
            showMessageBox("Error editing category. Please check the console.", "error");
        });
    });
});

