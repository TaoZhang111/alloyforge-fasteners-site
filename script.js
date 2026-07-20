const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const rfqForm = document.querySelector("[data-rfq-form]");
const formStatus = document.querySelector("[data-form-status]");

const salesEmail = "sales@alloyforge-fasteners.com";

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
});

rfqForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rfqForm);
  const lines = [
    "Hello AlloyForge Fasteners,",
    "",
    "Please quote the following fastener requirement:",
    "",
    `Product Type: ${formData.get("product") || ""}`,
    `Material: ${formData.get("material") || ""}`,
    `Standard / Drawing: ${formData.get("standard") || ""}`,
    `Size Range: ${formData.get("size") || ""}`,
    `Quantity: ${formData.get("quantity") || ""}`,
    `Destination Country: ${formData.get("country") || ""}`,
    "",
    "Notes:",
    formData.get("notes") || "",
    "",
    "Best regards,"
  ];

  const subject = encodeURIComponent(`RFQ - ${formData.get("material") || "Alloy"} ${formData.get("product") || "Fasteners"}`);
  const body = encodeURIComponent(lines.join("\n"));
  const mailtoUrl = `mailto:${salesEmail}?subject=${subject}&body=${body}`;

  formStatus.textContent = "Opening your email client with the RFQ details.";
  window.location.href = mailtoUrl;
});
