// ======================================
// FEEDMILL MANAGEMENT SYSTEM
// ======================================

// ======================================
// STORAGE
// ======================================

let formula =
JSON.parse(localStorage.getItem("formula")) || [];

let inventory =
JSON.parse(localStorage.getItem("inventory")) || [];

let feedSales =
JSON.parse(localStorage.getItem("feedSales")) || [];

let feedExpenses =
JSON.parse(localStorage.getItem("feedExpenses")) || [];


// ======================================
// HELPERS
// ======================================

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function getNumber(id) {
    return Number(document.getElementById(id).value) || 0;
}

function formatNumber(num = 0) {
    return Number(num).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}


// ======================================
// SAVE
// ======================================

function saveFeedmill() {

    localStorage.setItem(
        "formula",
        JSON.stringify(formula)
    );

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

    localStorage.setItem(
        "feedSales",
        JSON.stringify(feedSales)
    );

    localStorage.setItem(
        "feedExpenses",
        JSON.stringify(feedExpenses)
    );
}


// ======================================
// ADD INGREDIENT
// ======================================

function addIngredient() {

    const ingredientName =
    getValue("ingredient");

    const qty =
    getNumber("qty");

    if (!ingredientName || qty <= 0) {

        alert("Enter valid ingredient");

        return;
    }

   // FIND INVENTORY ITEM
    const stockItem =
    inventory.find(item =>
        item.name.toLowerCase() ===
        ingredientName.toLowerCase()
    );

    if (!stockItem) {

        alert("Ingredient not found in inventory");

        return;
    } 

    // CHECK AVAILABLE STOCK
    if (stockItem.qty < qty) {

        alert(
            `Not enough stock.\nAvailable: ${stockItem.qty} kg`
        );

        return;
    }

    // DEDUCT INVENTORY
    stockItem.qty -= qty;

    // FORMULA ENTRY
    const ingredient = {

        name: ingredientName,

        qty: qty,

        protein: getNumber("protein"),

        energy: getNumber("energy"),

        fiber: getNumber("fiber"),

        unitPrice: stockItem.price,

        totalCost: qty * stockItem.price

    };

    formula.push(ingredient);

    saveFeedmill();

    renderFormula();

    renderInventory();

    updateFeedmillDashboard();

    clearIngredientInputs();
}


// ======================================
// CLEAR INPUTS
// ======================================

function clearIngredientInputs() {

    [
        "ingredient",
        "qty",
        "protein",
        "energy",
        "fiber"
    ].forEach(id => {

        document.getElementById(id).value = "";

    });

}


// ======================================
// FORMULA RENDER
// ======================================

function renderFormula() {

    const list =
    document.getElementById("currentFormulaList");

    list.innerHTML = "";

    let totalQty = 0;

    let totalProtein = 0;

    let totalEnergy = 0;

    let totalFiber = 0;

    let totalCost = 0;

    formula.forEach(item => {

        totalQty += item.qty;

        totalProtein +=
        (item.protein / 100) * item.qty;

        totalEnergy +=
        (item.energy / 100) * item.qty;

        totalFiber +=
        (item.fiber / 100) * item.qty;

        totalCost += item.totalCost;

        list.innerHTML += `
        <li>
            ${item.name}
            |
            ${formatNumber(item.qty)} kg
            |
            Cost:
            ${formatNumber(item.totalCost)}
        </li>
        `;

    });

    document.getElementById("formulaCost").innerText =
    formatNumber(totalCost);

    document.getElementById("totalProtein").innerText =
    formatNumber(totalProtein);

    document.getElementById("totalEnergy").innerText =
    formatNumber(totalEnergy);

    document.getElementById("totalFiber").innerText =
    formatNumber(totalFiber);

    calculateCostPerBag(totalCost, totalQty);
}


// ======================================
// COST PER BAG
// ======================================

function calculateCostPerBag(totalCost, totalQty) {

    if (totalQty <= 0) {

        document.getElementById("costPerBag").innerText = 0;

        return;
    }

    const costPerKg =
    totalCost / totalQty;

    const costPerBag =
    costPerKg * 50;

    document.getElementById("costPerBag").innerText =
    formatNumber(costPerBag);

    calculateProfitPerBag(costPerBag);
}


// ======================================
// PROFIT PER BAG
// ======================================

function calculateProfitPerBag(costPerBag) {

    const sellingPrice =
    getNumber("sellingPrice");

    const profit =
    sellingPrice - costPerBag;

    document.getElementById("profitPerBag").innerText =
    formatNumber(profit);

}


// ======================================
// SAVE FORMULA
// ======================================

function saveFormula() {

    saveFeedmill();

    alert("Formula saved successfully");

}


// ======================================
// INVENTORY
// ======================================

function addInventory() {

    const itemName =
    getValue("invName");

    const qty =
    getNumber("invQty");

    const price =
    getNumber("invPrice");

    if (!itemName || qty <= 0 || price <= 0) {

        alert("Enter valid inventory");

        return;
    }

    // CHECK EXISTING ITEM
    const existing =
    inventory.find(item =>
        item.name.toLowerCase() ===
        itemName.toLowerCase()
    );

    if (existing) {

        // ADD TO EXISTING STOCK
        existing.qty += qty;

        existing.price = price;

    } else {

        inventory.push({

            date: getValue("invDate"),

            name: itemName,

            qty: qty,

            price: price

        });

    }

    saveFeedmill();

    renderInventory();

    updateFeedmillDashboard();

}


// ======================================
// INVENTORY RENDER
// ======================================

function renderInventory() {

    const list =
    document.getElementById("inventoryList");

    list.innerHTML = "";

    let stockValue = 0;

    inventory.forEach(item => {

        const value =
        item.qty * item.price;

        stockValue += value;

        list.innerHTML += `
        <li>
            ${item.name}
            |
            Qty:
            ${formatNumber(item.qty)} kg
            |
            Unit:
            ${formatNumber(item.price)}
            |
            Value:
            ${formatNumber(value)}
        </li>
        `;

    });

    document.getElementById("stockValue").innerText =
    formatNumber(stockValue);

}


// ======================================
// SALES
// ======================================

function addFeedSale() {

    const item =
    getValue("saleItem");

    const qty =
    getNumber("saleQty");

    const price =
    getNumber("salePrice");

    if (!item || qty <= 0 || price <= 0) {

        alert("Enter valid sale");

        return;
    }

    feedSales.push({

        item,
        qty,
        price

    });

    saveFeedmill();

    renderFeedSales();

    updateFeedmillDashboard();

}


// ======================================
// SALES RENDER
// ======================================

function renderFeedSales() {

    const list =
    document.getElementById("feedSalesList");

    list.innerHTML = "";

    let totalSales = 0;

    feedSales.forEach(sale => {

        const amount =
        sale.qty * sale.price;

        totalSales += amount;

        list.innerHTML += `
        <li>
            ${sale.item}
            |
            ${sale.qty} Bags
            |
            ${formatNumber(amount)}
        </li>
        `;

    });

    document.getElementById("feedSales").innerText =
    formatNumber(totalSales);

}


// ======================================
// EXPENSES
// ======================================

function addFeedExpense() {

    const desc =
    getValue("expDesc");

    const amount =
    getNumber("expAmount");

    if (!desc || amount <= 0) {

        alert("Enter valid expense");

        return;
    }

    feedExpenses.push({

        desc,
        amount

    });

    saveFeedmill();

    renderFeedExpenses();

    updateFeedmillDashboard();

}


// ======================================
// EXPENSES RENDER
// ======================================

function renderFeedExpenses() {

    const list =
    document.getElementById("feedExpenseList");

    list.innerHTML = "";

    let totalExpenses = 0;

    feedExpenses.forEach(expense => {

        totalExpenses += expense.amount;

        list.innerHTML += `
        <li>
            ${expense.desc}
            |
            ${formatNumber(expense.amount)}
        </li>
        `;

    });

    document.getElementById("feedmillCost").innerText =
    formatNumber(totalExpenses);

}


// ======================================
// DASHBOARD
// ======================================

function updateFeedmillDashboard() {

    const totalSales =
    feedSales.reduce((sum, sale) => {

        return sum + (sale.qty * sale.price);

    }, 0);

    const totalExpenses =
    feedExpenses.reduce((sum, expense) => {

        return sum + expense.amount;

    }, 0);

    const stockValue =
    inventory.reduce((sum, item) => {

        return sum + (item.qty * item.price);

    }, 0);

    const profit =
    totalSales - totalExpenses;

    document.getElementById("feedSales").innerText =
    formatNumber(totalSales);

    document.getElementById("feedmillCost").innerText =
    formatNumber(totalExpenses);

    document.getElementById("feedProfit").innerText =
    formatNumber(profit);

    document.getElementById("stockValue").innerText =
    formatNumber(stockValue);

}


// ======================================
// RESETS
// ======================================

function resetInventory() {

    if (!confirm("Reset inventory?")) return;

    inventory = [];

    saveFeedmill();

    renderInventory();

    updateFeedmillDashboard();

}


function resetSales() {

    if (!confirm("Reset sales?")) return;

    feedSales = [];

    saveFeedmill();

    renderFeedSales();

    updateFeedmillDashboard();

}


function resetExpenses() {

    if (!confirm("Reset expenses?")) return;

    feedExpenses = [];

    saveFeedmill();

    renderFeedExpenses();

    updateFeedmillDashboard();

}


function resetAllFeedmill() {

    if (!confirm("Reset complete feedmill system?")) return;

    formula = [];

    inventory = [];

    feedSales = [];

    feedExpenses = [];

    saveFeedmill();

    renderFormula();

    renderInventory();

    renderFeedSales();

    renderFeedExpenses();

    updateFeedmillDashboard();

}


// ======================================
// PRINT
// ======================================

function printDashboard() {
    window.print();
}

function printFormulas() {
    window.print();
}

function printInventory() {
    window.print();
}


// ======================================
// INIT
// ======================================

renderFormula();

renderInventory();

renderFeedSales();

renderFeedExpenses();

updateFeedmillDashboard();