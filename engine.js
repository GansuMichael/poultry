// ===============================
// ENGINE.JS
// ===============================

function showModule(moduleId) {

    // Hide all modules
    document.querySelectorAll(".module").forEach(module => {
        module.classList.add("hidden");
    });

    // Show selected module
    const activeModule = document.getElementById(moduleId);

    if (activeModule) {
        activeModule.classList.remove("hidden");
    }

    // Auto open first subpage
    const firstSubpage = activeModule.querySelector(".subpage");

    if (firstSubpage) {

        activeModule.querySelectorAll(".subpage").forEach(sub => {
            sub.classList.add("hidden");
        });

        firstSubpage.classList.remove("hidden");
    }
}


// ===============================
// SHOW SUB PAGE
// ===============================

function showSub(module, sub) {

    const parent = document.getElementById(module);

    parent.querySelectorAll(".subpage").forEach(page => {
        page.classList.add("hidden");
    });

    const target = document.getElementById(`${module}-${sub}`);

    if (target) {
        target.classList.remove("hidden");
    }
}


// ===============================
// FORMAT NUMBER
// ===============================

function formatNumber(num = 0) {

    return Number(num).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

}


// ===============================
// SAFE ELEMENT
// ===============================

function getEl(id) {
    return document.getElementById(id);
}