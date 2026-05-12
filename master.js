// ===============================
// MASTER DASHBOARD
// ===============================

function refreshMasterDashboard() {

    const broiler =
    JSON.parse(localStorage.getItem("broilerRecords")) || [];

    const layers =
    JSON.parse(localStorage.getItem("layersData")) || [];

    const sales =
    JSON.parse(localStorage.getItem("broilerSales")) || [];

    const expenses =
    JSON.parse(localStorage.getItem("broilerExpenses")) || [];


    // TOTALS

    const totalBirds =
    broiler.reduce((a, b) => a + b.closing, 0);

    const totalEggs =
    layers.reduce((a, b) => a + b.eggs, 0);

    const totalFeed =
    broiler.reduce((a, b) => a + b.feed, 0) +
    layers.reduce((a, b) => a + b.feed, 0);

    const totalMortality =
    broiler.reduce((a, b) => a + b.mortality, 0) +
    layers.reduce((a, b) => a + b.mortality, 0);

    const totalRevenue =
    sales.reduce((a, b) => a + b.amount, 0) +
    layers.reduce((a, b) => a + b.revenue, 0);

    const totalExpenses =
    expenses.reduce((a, b) => a + b.amount, 0);

    const profit =
    totalRevenue - totalExpenses;


    // DISPLAY

    getEl("mTotalBirds").innerText =
    formatNumber(totalBirds);

    getEl("mTotalEggs").innerText =
    formatNumber(totalEggs);

    getEl("mTotalFeed").innerText =
    formatNumber(totalFeed);

    getEl("mTotalMortality").innerText =
    formatNumber(totalMortality);

    getEl("mRevenue").innerText =
    formatNumber(totalRevenue);

    getEl("mExpenses").innerText =
    formatNumber(totalExpenses);

    getEl("mProfit").innerText =
    formatNumber(profit);


    // ALERT

    let alert = "";

    if (profit < 0) {
        alert += "❌ Business is running at loss.<br>";
    } else {
        alert += "✅ Business is profitable.<br>";
    }

    if (totalMortality > 20) {
        alert += "⚠️ Mortality is high.";
    }

    getEl("masterAlerts").innerHTML = alert;
}


// ===============================
// EXPORT
// ===============================

function exportMasterReport() {

    window.print();
}


// ===============================
// RESET
// ===============================

function resetMasterDashboard() {

    if (!confirm("Reset entire dashboard?")) return;

    localStorage.clear();

    location.reload();
}


// ===============================
// INIT
// ===============================

refreshMasterDashboard();