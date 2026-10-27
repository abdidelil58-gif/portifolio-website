"use strict";

/* =====================================================
   1. HELPER FUNCTIONS
===================================================== */

const select = (selector, parent = document) =>
    parent.querySelector(selector);

const selectAll = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =====================================================
   2. MOBILE NAVIGATION MENU
===================================================== */

const menuToggle = select(".menu-toggle");
const navMenu = select(".nav-menu");
const navLinks = selectAll(".nav-link");

function closeMobileMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = select("i", menuToggle);

    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
}

if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = select("i", menuToggle);

        if (icon) {
            icon.classList.toggle("fa-xmark", isOpen);
            icon.classList.toggle("fa-bars", !isOpen);
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            navMenu.classList.contains("active") &&
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMobileMenu();
        }
    });
}


/* =====================================================
   3. DARK MODE / LIGHT MODE
===================================================== */

const themeToggle = select(".theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");

function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);

    if (themeToggle) {
        const icon = select("i", themeToggle);

        if (icon) {
            icon.classList.toggle("fa-sun", isLight);
            icon.classList.toggle("fa-moon", !isLight);
        }

        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark mode" : "Switch to light mode"
        );

        themeToggle.setAttribute("aria-pressed", String(isLight));
    }
}

applyTheme(savedTheme === "light" ? "light" : "dark");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isCurrentlyLight =
            document.body.classList.contains("light-theme");

        const nextTheme = isCurrentlyLight ? "dark" : "light";

        applyTheme(nextTheme);
        localStorage.setItem("portfolio-theme", nextTheme);
    });
}


/* =====================================================
   4. AUTOMATIC FOOTER YEAR
===================================================== */

const yearElement = select("#year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =====================================================
   5. ACTIVE NAVIGATION LINK ON SCROLL
===================================================== */

const sections = selectAll("main section[id]");

function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 150;

    let currentSection = "";

    sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        const target = link.getAttribute("href");
        const isActive = target === `#${currentSection}`;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
});

window.addEventListener("load", updateActiveNavigation);


/* =====================================================
   6. PROFILE IMAGE FALLBACK
===================================================== */

const profileImage = select(".profile-image");
const profileFallback = select(".profile-fallback");

function showProfileFallback() {
    if (profileImage) {
        profileImage.hidden = true;
    }

    if (profileFallback) {
        profileFallback.style.display = "flex";
    }
}

if (profileImage) {
    profileImage.addEventListener("error", showProfileFallback);

    if (profileImage.complete && profileImage.naturalWidth === 0) {
        showProfileFallback();
    }
}


/* =====================================================
   7. CONTACT FORM VALIDATION
===================================================== */

const contactForm = select(".contact-form");
const formStatus = select(".form-status");

function showFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.style.color =
        type === "success" ? "#22c55e" : "#f87171";

    formStatus.setAttribute("role", "status");
    formStatus.setAttribute("aria-live", "polite");
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = select('[name="name"]', contactForm);
        const emailInput = select('[name="email"]', contactForm);
        const subjectInput = select('[name="subject"]', contactForm);
        const messageInput = select('[name="message"]', contactForm);

        if (!nameInput || !emailInput || !messageInput) {
            showFormStatus(
                "The form fields are not configured correctly.",
                "error"
            );
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput
            ? subjectInput.value.trim()
            : "";
        const message = messageInput.value.trim();

        if (!name || !email || !message) {
            showFormStatus(
                "Please fill in your name, email, and message.",
                "error"
            );
            return;
        }

        if (!emailInput.validity.valid) {
            showFormStatus(
                "Please enter a valid email address.",
                "error"
            );
            emailInput.focus();
            return;
        }

        if (name.length < 2) {
            showFormStatus(
                "Please enter a name with at least 2 characters.",
                "error"
            );
            nameInput.focus();
            return;
        }

        if (message.length < 10) {
            showFormStatus(
                "Please write a message with at least 10 characters.",
                "error"
            );
            messageInput.focus();
            return;
        }

        /*
         * This form currently validates the information only.
         * It does not send an email to you.
         */

        const recipient = "your-email@example.com";

        if (recipient === "your-email@example.com") {
            showFormStatus(
                "Validation successful! Connect an email service to receive messages.",
                "success"
            );
            return;
        }

        const mailtoLink = new URL("mailto:" + recipient);

        mailtoLink.searchParams.set(
            "subject",
            subject || `Portfolio message from ${name}`
        );

        mailtoLink.searchParams.set(
            "body",
            `Name: ${name}\nEmail: ${email}\n\n${message}`
        );

        window.location.href = mailtoLink.href;

        showFormStatus(
            "Your email application should open now.",
            "success"
        );
    });
}


/* =====================================================
   8. COPY EMAIL TO CLIPBOARD
===================================================== */

const copyEmailButton = select(".copy-email");

if (copyEmailButton) {
    copyEmailButton.addEventListener("click", async () => {
        const email =
            copyEmailButton.dataset.email ||
            "your-email@example.com";

        try {
            await navigator.clipboard.writeText(email);

            const originalText = copyEmailButton.innerHTML;

            copyEmailButton.innerHTML =
                '<i class="fa-solid fa-check"></i> Copied!';

            window.setTimeout(() => {
                copyEmailButton.innerHTML = originalText;
            }, 2000);
        } catch (error) {
            window.prompt("Copy this email address:", email);
        }
    });
}


/* =====================================================
   9. BACK TO TOP BUTTON
===================================================== */

const backToTopButton = select(".back-to-top");

if (backToTopButton) {
    backToTopButton.addEventListener("click", (event) => {
        const href = backToTopButton.getAttribute("href");

        if (href === "#home" || href === "#top") {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    });
}


/* =====================================================
   10. SCROLL REVEAL ANIMATIONS
===================================================== */

const revealElements = selectAll(
    ".about-card, .skill-card, .project-card, .contact-info, .contact-form"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");

        revealObserver.observe(element);
    });
}


/* =====================================================
   11. PROJECT LINK CHECK
===================================================== */

const projectLinks = selectAll(
    ".project-card a[href]"
);

projectLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href === "#" || href === "https://github.com/") {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            console.info(
                "Replace this placeholder with your real project URL."
            );
        });
    }
});


/* =====================================================
   12. CURRENT YEAR AND INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    updateActiveNavigation();

    console.log("Portfolio website JavaScript loaded successfully.");
});