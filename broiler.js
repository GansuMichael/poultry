// ===============================
// BROILER.JS
// ===============================

let broilerRecords =
JSON.parse(localStorage.getItem("broilerRecords")) || [];

let broilerSales =
JSON.parse(localStorage.getItem("broilerSales")) || [];

let broilerExpenses =
JSON.parse(localStorage.getItem("broilerExpenses")) || [];

let growthChart;
let financeChart;


// ===============================
// SAVE
// ===============================

function saveBroiler() {

    localStorage.setItem(
        "broilerRecords",
        JSON.stringify(broilerRecords)
    );

    localStorage.setItem(
        "broilerSales",
        JSON.stringify(broilerSales)
    );

    localStorage.setItem(
        "broilerExpenses",
        JSON.stringify(broilerExpenses)
    );

}


// ===============================
// ADD RECORD
// ===============================

function addRecord() {

    const record = {

        date: getEl("date").value,
        age: Number(getEl("age").value),
        opening: Number(getEl("opening").value),
        feed: Number(getEl("feed").value),
        water: Number(getEl("water").value),
        medication: getEl("medication").value,
        weight: Number(getEl("weight").value),
        mortality: Number(getEl("mortality").value),
        remarks: getEl("remarks").value

    };

    record.closing =
    record.opening - record.mortality;

    broilerRecords.push(record);

    saveBroiler();

    renderBroiler();
}


// ===============================
// RENDER BROILER
// ===============================

function renderBroiler() {

    const tbody =
    document.querySelector("#table tbody");

    tbody.innerHTML = "";

    let totalFeed = 0;
    let totalMort = 0;

    broilerRecords.forEach(record => {

        totalFeed += record.feed;
        totalMort += record.mortality;

        tbody.innerHTML += `
        <tr>
            <td>${record.date}</td>
            <td>${record.age}</td>
            <td>${record.opening}</td>
            <td>${record.feed}</td>
            <td>${record.weight}</td>
            <td>${record.mortality}</td>
            <td>${record.closing}</td>
        </tr>
        `;

    });

    getEl("totalFeed").innerText =
    formatNumber(totalFeed);

    getEl("totalMort").innerText =
    formatNumber(totalMort);

    getEl("finalStock").innerText =
    broilerRecords.length
    ? formatNumber(
        broilerRecords[broilerRecords.length - 1].closing
      )
    : 0;

    getEl("sumFeed").innerText =
    formatNumber(totalFeed);

    getEl("sumMort").innerText =
    formatNumber(totalMort);

    calculateFCR();

    renderFinanceChart();

    generateBroilerAI();
}


// ===============================
// FCR
// ===============================

function calculateFCR() {

    const totalFeed =
    broilerRecords.reduce((a, b) => a + b.feed, 0);

    const last =
    broilerRecords[broilerRecords.length - 1];

    if (!last || !last.weight || !last.closing) {

        getEl("fcr").innerText = "0";

        return;
    }

    const fcr =
    totalFeed / (last.weight * last.closing);

    getEl("fcr").innerText =
    fcr.toFixed(2);

}


// ===============================
// SALES
// ===============================

function addSale() {

    const sale = {

        date: getEl("s_date").value,
        type: getEl("s_type").value,
        desc: getEl("s_desc").value,
        amount: Number(getEl("s_amount").value)

    };

    broilerSales.push(sale);

    saveBroiler();

    renderSales();
}


function renderSales() {

    const tbody =
    document.querySelector("#salesTable tbody");

    tbody.innerHTML = "";

    let total = 0;

    broilerSales.forEach(sale => {

        total += sale.amount;

        tbody.innerHTML += `
        <tr>
            <td>${sale.date}</td>
            <td>${sale.type}</td>
            <td>${sale.desc}</td>
            <td>${formatNumber(sale.amount)}</td>
        </tr>
        `;
    });

    getEl("totalSales").innerText =
    formatNumber(total);

    getEl("sumSales").innerText =
    formatNumber(total);

    calculateProfit();
}


// ===============================
// EXPENSES
// ===============================

function addExpense() {

    const expense = {

        date: getEl("e_date").value,
        desc: getEl("e_desc").value,
        type: getEl("e_type").value,
        amount: Number(getEl("e_amount").value)

    };

    broilerExpenses.push(expense);

    saveBroiler();

    renderExpenses();
}


function renderExpenses() {

    const tbody =
    document.querySelector("#expenseTable tbody");

    tbody.innerHTML = "";

    let total = 0;

    broilerExpenses.forEach(expense => {

        total += expense.amount;

        tbody.innerHTML += `
        <tr>
            <td>${expense.date}</td>
            <td>${expense.desc}</td>
            <td>${expense.type}</td>
            <td>${formatNumber(expense.amount)}</td>
        </tr>
        `;
    });

    getEl("totalExpenses").innerText =
    formatNumber(total);

    getEl("sumExpenses").innerText =
    formatNumber(total);

    calculateProfit();
}


// ===============================
// PROFIT
// ===============================

function calculateProfit() {

    const totalSales =
    broilerSales.reduce((a, b) => a + b.amount, 0);

    const totalExpenses =
    broilerExpenses.reduce((a, b) => a + b.amount, 0);

    const profit =
    totalSales - totalExpenses;

    getEl("profit").innerText =
    formatNumber(profit);

    const last =
    broilerRecords[broilerRecords.length - 1];

    const birds =
    last ? last.closing : 0;

    const costPerBird =
    birds ? totalExpenses / birds : 0;

    getEl("costPerBird").innerText =
    formatNumber(costPerBird);

    generateBusinessAI(profit);

    renderFinanceChart();
}


// ===============================
// AI
// ===============================

function generateBroilerAI() {

    const totalMort =
    broilerRecords.reduce(
        (a, b) => a + b.mortality,
        0
    );

    let advice = "";

    if (totalMort > 10) {
        advice += "⚠️ Mortality is high.<br>";
    } else {
        advice += "✅ Mortality is stable.<br>";
    }

    getEl("ai").innerHTML = advice;
}


function generateBusinessAI(profit) {

    let advice = "";

    if (profit < 0) {
        advice += "❌ Farm is running at a loss.";
    } else {
        advice += "✅ Farm is profitable.";
    }

    getEl("aiBusiness").innerHTML = advice;
}


// ===============================
// CHART
// ===============================

function renderFinanceChart() {

    const canvas =
    document.getElementById("financeChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const totalSales =
    broilerSales.reduce((a, b) => a + b.amount, 0);

    const totalExpenses =
    broilerExpenses.reduce((a, b) => a + b.amount, 0);

    const profit =
    totalSales - totalExpenses;

    if (financeChart) {
        financeChart.destroy();
    }

    financeChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Sales",
                "Expenses",
                "Profit"
            ],

            datasets: [{
                label: "Finance",
                data: [
                    totalSales,
                    totalExpenses,
                    profit
                ]
            }]
        }
    });
}


// ===============================
// RESET
// ===============================

function resetData() {

    if (!confirm("Reset broiler records?")) return;

    broilerRecords = [];

    saveBroiler();

    renderBroiler();
}


function cleanData() {

    if (!confirm("Reset sales?")) return;

    broilerSales = [];

    saveBroiler();

    renderSales();
}


function clearData() {

    if (!confirm("Reset expenses?")) return;

    broilerExpenses = [];

    saveBroiler();

    renderExpenses();
}


// ===============================
// INIT
// ===============================

renderBroiler();
renderSales();
renderExpenses();