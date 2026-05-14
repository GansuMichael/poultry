// ===============================
// LAYERS.JS
// ===============================

let layersData =
JSON.parse(localStorage.getItem("layersData")) || [];

let eggChart = null;
let profitChart = null;


// ===============================
// HELPERS
// ===============================

function saveLayers() {

    localStorage.setItem(
        "layersData",
        JSON.stringify(layersData)
    );

}


function getNumber(id) {

    return Number(getEl(id).value) || 0;

}


// ===============================
// ADD PRODUCTION
// ===============================

function addProduction() {

    const date = getEl("pDate").value;

    if (!date) {
        alert("Please select a date");
        return;
    }

    const data = {

        date,

        birds: getNumber("birds"),

        eggs: getNumber("eggs"),

        cracked: getNumber("cracked"),

        mortality: getNumber("layersMortality"),

        feed: getNumber("layersFeed"),

        feedCost: getNumber("layersFeedCost"),

        price: getNumber("price")

    };

    // Calculations
    data.good = data.eggs - data.cracked;

    data.revenue = data.good * data.price;

    data.profit = data.revenue - data.feedCost;

    data.expenses = data.feedCost;

    data.closing =
    data.birds - data.mortality;

    // Save
    layersData.push(data);

    saveLayers();

    renderLayers();
}


// ===============================
// RENDER
// ===============================

function renderLayers(data = layersData) {

    const table = getEl("prodTable");

    let eggs = 0;
    let revenue = 0;
    let profit = 0;
    let mortality = 0;
    let expenses = 0;
    let good = 0;
    let clossing = 0;

    let html = "";

    data.forEach(item => {

        eggs += item.eggs;

        revenue += item.revenue;

        profit += item.profit;

        mortality += item.mortality;

        expenses += item.feedCost;

        good += item.good;

        closing = item.closing;

        html += `
        <tr>
            <td>${item.date}</td>
            <td>${formatNumber(item.eggs)}</td>
            <td>${formatNumber(item.good)}</td>
            <td>${formatNumber(item.revenue)}</td>
            <td>${formatNumber(item.profit)}</td>
            <td>${data.closing}</td>
        </tr>
        `;
    });

    table.innerHTML = html;

    // Dashboard
    getEl("dEggs").innerText =
    formatNumber(eggs);

    getEl("dRevenue").innerText =
    formatNumber(revenue);

    getEl("dProfit").innerText =
    formatNumber(profit);

    getEl("dMortality").innerText =
    formatNumber(mortality);

    getEl("dExpenses").innerText =
    formatNumber(expenses);

    getEl("tProfit").innerText =
    formatNumber(profit);

    getEl("tRevenue").innerText =
    formatNumber(revenue);

    getEl("tEggs").innerText =
    formatNumber(eggs);

    getEl("lFinalStock").innerText =
    data.length
    ? formatNumber(
        data[data.length - 1].closing
      )
    : 0;

    getEl("dAvgEggs").innerText =
    data.length
        ? formatNumber(eggs / data.length)
        : "0.00";

    // Summary
    getEl("sumEggs").innerText =
    formatNumber(eggs);

    getEl("sumRevenue").innerText =
    formatNumber(revenue);

    getEl("sumProfit").innerText =
    formatNumber(profit);

    getEl("sumExpenses").innerText =
    formatNumber(expenses);

    // Average Eggs
    getEl("avgEggs").innerText =
    data.length
        ? formatNumber(eggs / data.length)
        : "0.00";

    getEl("liveBirds").innerText =
    data.length
    ? formatNumber(
        data[data.length - 1].closing
        )
    : 0;

    drawLayersCharts();

    updateAnalytics();
}


// ===============================
// ANALYTICS
// ===============================

function updateAnalytics() {

    let totalBirds = 0;

    let totalEggs = 0;

    let totalFeed = 0;

    let totalCost = 0;

    let totalProfit = 0;

    let totalMort = 0;

    let price = 0;

    layersData.forEach(item => {

        totalBirds += item.birds;

        totalEggs += item.eggs;

        totalFeed += item.feed;

        totalCost += item.feedCost;

        totalProfit += item.profit;

        totalMort += item.mortality;

        price = item.price;

    });

    getEl("eggPercent").innerText =
    formatNumber(
        totalBirds
            ? (totalEggs / totalBirds) * 100
            : 0
    );

    getEl("feedPerBird").innerText =
    formatNumber(
        totalBirds
            ? totalFeed / totalBirds
            : 0
    );

    getEl("costPerEgg").innerText =
    formatNumber(
        totalEggs
            ? totalCost / totalEggs
            : 0
    );

    getEl("profitPerBird").innerText =
    formatNumber(
        totalBirds
            ? totalProfit / totalBirds
            : 0
    );

    getEl("mortRate").innerText =
    formatNumber(
        totalBirds
            ? (totalMort / totalBirds) * 100
            : 0
    );

    getEl("breakEven").innerText =
    totalProfit > 0
        ? formatNumber(totalCost / price)
        : "0";
}


// ===============================
// CHARTS
// ===============================

function drawLayersCharts() {

    const eggCanvas =
    document.getElementById("eggChart");

    const profitCanvas =
    document.getElementById("profitChart");

    if (!eggCanvas || !profitCanvas) return;

    const labels =
    layersData.map(item => item.date);

    // Destroy old charts
    if (eggChart) eggChart.destroy();

    if (profitChart) profitChart.destroy();

    // Egg Chart
    eggChart = new Chart(eggCanvas, {

        type: "line",

        data: {

            labels,

            datasets: [{

                label: "Egg Production",

                data: layersData.map(
                    item => item.eggs
                ),

                tension: 0.3

            }]
        }

    });

    // Profit Chart
    profitChart = new Chart(profitCanvas, {

        type: "bar",

        data: {

            labels,

            datasets: [{

                label: "Profit",

                data: layersData.map(
                    item => item.profit
                )

            }]
        }

    });
}


// ===============================
// RESET
// ===============================

function resetTable() {

    const confirmReset =
    confirm("Reset all layers data?");

    if (!confirmReset) return;

    layersData = [];

    saveLayers();

    renderLayers();
}


// ===============================
// FILTER
// ===============================

function filterData() {

    const start =
    getEl("startDate").value;

    const end =
    getEl("endDate").value;

    const filtered =
    layersData.filter(item => {

        return (
            (!start || item.date >= start) &&
            (!end || item.date <= end)
        );

    });

    renderLayers(filtered);
}


// ===============================
// RESET FILTER
// ===============================

function resetFilter() {

    getEl("startDate").value = "";

    getEl("endDate").value = "";

    renderLayers();
}


// ===============================
// INIT
// ===============================

renderLayers();