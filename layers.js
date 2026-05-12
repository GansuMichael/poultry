// ===============================
// LAYERS.JS
// ===============================

let layersData =
JSON.parse(localStorage.getItem("layersData")) || [];

let eggChart;
let profitChart;


// ===============================
// SAVE
// ===============================

function saveLayers() {

    localStorage.setItem(
        "layersData",
        JSON.stringify(layersData)
    );

}


// ===============================
// ADD PRODUCTION
// ===============================

function addProduction() {

    const data = {

        date: getEl("pDate").value,
        birds: Number(getEl("birds").value),
        eggs: Number(getEl("eggs").value),
        cracked: Number(getEl("cracked").value),
        mortality: Number(getEl("layersMortality").value),
        feed: Number(getEl("layersFeed").value),
        feedCost: Number(getEl("layersFeedCost").value),
        price: Number(getEl("price").value)

    };

    data.good =
    data.eggs - data.cracked;

    data.revenue =
    data.good * data.price;

    data.profit =
    data.revenue - data.feedCost;

    layersData.push(data);

    saveLayers();

    renderLayers();
}


// ===============================
// RENDER
// ===============================

function renderLayers() {

    const table =
    getEl("prodTable");

    table.innerHTML = "";

    let eggs = 0;
    let revenue = 0;
    let profit = 0;
    let mortality = 0;

    layersData.forEach(data => {

        eggs += data.eggs;
        revenue += data.revenue;
        profit += data.profit;
        mortality += data.mortality;

        table.innerHTML += `
        <tr>
            <td>${data.date}</td>
            <td>${data.eggs}</td>
            <td>${data.good}</td>
            <td>${formatNumber(data.revenue)}</td>
            <td>${formatNumber(data.profit)}</td>
        </tr>
        `;
    });

    getEl("dEggs").innerText =
    formatNumber(eggs);

    getEl("dRevenue").innerText =
    formatNumber(revenue);

    getEl("dProfit").innerText =
    formatNumber(profit);

    getEl("dMortality").innerText =
    formatNumber(mortality);

    getEl("sumEggs").innerText =
    formatNumber(eggs);

    getEl("sumRevenue").innerText =
    formatNumber(revenue);

    getEl("sumProfit").innerText =
    formatNumber(profit);

    drawLayersCharts();
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

    if (eggChart) eggChart.destroy();
    if (profitChart) profitChart.destroy();

    eggChart = new Chart(
        eggCanvas,
        {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Egg Production",
                    data: layersData.map(
                        item => item.eggs
                    )
                }]
            }
        }
    );

    profitChart = new Chart(
        profitCanvas,
        {
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
        }
    );
}


// ===============================
// RESET
// ===============================

function resetTable() {

    if (!confirm("Reset layers data?")) return;

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

    renderFiltered(filtered);
}


function renderFiltered(data) {

    const table =
    getEl("prodTable");

    table.innerHTML = "";

    data.forEach(item => {

        table.innerHTML += `
        <tr>
            <td>${item.date}</td>
            <td>${item.eggs}</td>
            <td>${item.good}</td>
            <td>${item.revenue}</td>
            <td>${item.profit}</td>
        </tr>
        `;
    });
}


function resetFilter() {

    getEl("startDate").value = "";
    getEl("endDate").value = "";

    renderLayers();
}


// ===============================
// INIT
// ===============================

renderLayers();