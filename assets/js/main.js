
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#mobileMenu");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            const open = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!open));
            nav.classList.toggle("is-open", !open);
            document.body.classList.toggle("menu-open", !open);
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menuButton.setAttribute("aria-expanded", "false");
                nav.classList.remove("is-open");
                document.body.classList.remove("menu-open");
            });
        });
    }

    document.querySelectorAll("[data-current-year]").forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    /* -----------------------------------------------------
       Cinematic hero: three real video slots with graceful fallback.
    ----------------------------------------------------- */
    const slides = [...document.querySelectorAll(".hero-slide")];
    const dots = [...document.querySelectorAll(".hero-dot")];

    if (slides.length) {
        let current = 0;
        let timer;

        const activate = index => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => {
                slide.classList.toggle("is-active", i === current);
                const video = slide.querySelector("video");
                if (!video) return;
                if (i === current) {
                    video.currentTime = 0;
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
            dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
        };

        slides.forEach(slide => {
            const video = slide.querySelector("video");
            if (!video) return;
            video.addEventListener("error", () => slide.classList.add("media-fallback"));
        });

        const restart = () => {
            clearInterval(timer);
            timer = setInterval(() => activate(current + 1), 9000);
        };

        dots.forEach((dot, i) => dot.addEventListener("click", () => {
            activate(i);
            restart();
        }));

        activate(0);
        restart();
    }

    /* Planner: send the visitor to contact with the selected values. */
    const planner = document.querySelector("#visualPlanner");

    if (planner) {
        planner.addEventListener("submit", event => {
            event.preventDefault();

            const destination = planner.querySelector("[name=destination]")?.value || "";
            const experience = planner.querySelector("[name=experience]")?.value || "";
            const travelDate = planner.querySelector("[name=date]")?.value || "";

            const params = new URLSearchParams({
                destination,
                experience,
                date: travelDate
            });

            window.location.href = `contact.html?${params.toString()}#enquiry`;
        });
    }
    /* Prefill the enquiry form from the visual planner query string. */
    const params = new URLSearchParams(window.location.search);
    const destinationField = document.querySelector("#enquiry-destination");
    const dateField = document.querySelector("#enquiry-date");
    const typeField = document.querySelector("#enquiry-type");
    const messageField = document.querySelector("#enquiry-message");

    if (destinationField && params.get("destination")) destinationField.value = params.get("destination");
    if (dateField && params.get("date")) dateField.value = params.get("date");
    if (typeField && params.get("experience")) {
        const wanted = params.get("experience").toLowerCase();
        const match = [...typeField.options].find(o => o.text.toLowerCase().includes(wanted) || wanted.includes(o.text.toLowerCase()));
        if (match) typeField.value = match.value;
    }
    if (messageField && (params.get("destination") || params.get("experience"))) {
        const lines = [];
        if (params.get("destination")) lines.push(`Destination: ${params.get("destination")}`);
        if (params.get("experience")) lines.push(`Experience: ${params.get("experience")}`);
        if (params.get("date")) lines.push(`Preferred date: ${params.get("date")}`);
        messageField.value = lines.join("\n") + "\n\nPlease tell us anything else about your trip.";
    }

});
