document.addEventListener("DOMContentLoaded", function () {
    const headerWrapper = document.getElementById("kc-header-wrapper");
    if (headerWrapper) {
        headerWrapper.style.cursor = "pointer";
        headerWrapper.addEventListener("click", function () {
            globalThis.location.href = "http://localhost:4200"; // Your login page
        });

        const textSpan = document.createElement("span");
        textSpan.textContent = "teamplay";
        textSpan.style.display = "block";
        textSpan.style.textAlign = "center";
        textSpan.style.fontSize = "39px";
        textSpan.style.fontWeight = "bold";
        textSpan.style.color = "#990d0d";
        textSpan.style.marginTop = "50px";
        headerWrapper.appendChild(textSpan);
    }
});