
import { renderSpendingsTbody } from '../render-spendings-tbody.js';

export function renderMonthTable(spendings) {
    const table = document.getElementById('month-spendings-table');
    const tbody = document.getElementById('month-spendings-tbody');
    if(!tbody || !table) return;

    if (table.querySelector('tfoot')) table.querySelector('tfoot').remove();

    if(!spendings || spendings.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');

        const iElment = document.createElement('i');
        iElment.className = 'bi bi-emoji-frown-fill';

        td.colSpan = 6;
        td.textContent = 'No entries found ';
        td.appendChild(iElment);
        
        tr.appendChild(td);

        tbody.innerHTML = '';
        tbody.appendChild(tr);
        
        return;
    }

    const newTbody = renderSpendingsTbody(spendings);
    newTbody.id = tbody.id;
    newTbody.className = tbody.className;
    tbody.replaceWith(newTbody);

    
    const tfoot = document.createElement('tfoot');
    tfoot.className = 'table-group-divider';

    const totalTr = document.createElement('tr');
    
    const totalLabelTd = document.createElement('td');
    totalLabelTd.className = 'text-end';
    totalLabelTd.textContent = 'Total';
    totalLabelTd.colSpan = 3;
    
    const totalAmountTd = document.createElement('td');
    totalAmountTd.className = 'text-end';
    const totalAmount = extract_total(spendings);
    totalAmountTd.textContent = totalAmount.toFixed(2);
    
    const backTd = document.createElement('td');
    backTd.colSpan = 2;

    totalTr.appendChild(totalLabelTd);
    totalTr.appendChild(totalAmountTd);
    totalTr.appendChild(backTd);
    
    tfoot.appendChild(totalTr);

    table.appendChild(tfoot);
}

function extract_total(spendings) {
    return spendings.reduce(function(acc, spending) {
        return acc + Number(spending.amount);
    }, 0);
}