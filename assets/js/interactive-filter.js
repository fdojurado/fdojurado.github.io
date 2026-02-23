document.addEventListener("DOMContentLoaded", () => {

    const publications = document.querySelectorAll(".pub-entry");
    const container = document.getElementById("pub-list-container");

    const filterType = document.getElementById("filter-type");
    const filterLead = document.getElementById("filter-lead");
    const sortBy = document.getElementById("sort-by");

    function applyFilters() {

        const selectedType = filterType.value;
        const selectedLead = filterLead.value;
        const selectedSort = sortBy.value;

        let visible = [];

        publications.forEach(pub => {

            const pubType = pub.dataset.type;
            const pubLead = pub.dataset.lead;

            let show = true;

            if (selectedType !== "all" && pubType !== selectedType) {
                show = false;
            }

            if (selectedLead !== "all" && pubLead !== selectedLead) {
                show = false;
            }

            pub.style.display = show ? "block" : "none";

            if (show) visible.push(pub);
        });

        // Sorting
        visible.sort((a, b) => {
            if (selectedSort === "citations") {
                return Number(b.dataset.citations) - Number(a.dataset.citations);
            }
            return Number(b.dataset.year) - Number(a.dataset.year);
        });

        visible.forEach(pub => container.appendChild(pub));
    }

    filterType.addEventListener("change", applyFilters);
    filterLead.addEventListener("change", applyFilters);
    sortBy.addEventListener("change", applyFilters);

});