
import { renderSpendingsTbody } from '../render-spendings-tbody.js';

const SPENDING_COUNT = 10;

export async function updateRecentSpendings() {
    let spendings;
    try {
        spendings = await fetchRecentSpendings();
    } catch (error) {
        console.error("Error fetching recent spendings:", error);
        throw error;
    }

    const tableId = 'table-spendings';
    const table = document.getElementById(tableId);
    if (!table) {
        console.warn(`Table with id '${tableId}' not found.`);
        return;
    }
    
    const oldTbody = table.querySelector('tbody');
    const newTbody = renderSpendingsTbody(spendings);
    if (oldTbody) {
        newTbody.className = oldTbody.className;
        oldTbody.replaceWith(newTbody);
    } else {
        table.appendChild(newTbody);
    }
}

async function fetchRecentSpendings() {
    const data = await $.ajax({
        type: "GET",
        datatype: "json",
        contentType: "application/json",
        data: {spendings_count: SPENDING_COUNT, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
        url: DJANGO_URLS.spending_get_recent
    });

    return data.spendings;
}

$(document).ready(function() {
    updateRecentSpendings();
});
