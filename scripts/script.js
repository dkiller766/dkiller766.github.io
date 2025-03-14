document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("contactModal");
    const openModalBtn = document.getElementById("addContactBtn");
    const closeModal = document.querySelector(".close");
    const contactForm = document.getElementById("contactForm");
    const contactsContainer = document.getElementById("contactsContainer");

    openModalBtn.addEventListener("click", function() {
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;

        const contactCard = document.createElement("div");
        contactCard.classList.add("col-sm-6", "mb-3");
        contactCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text"><strong>Telefone:</strong> ${phone}</p>
                    <p class="card-text"><strong>Email:</strong> ${email}</p>
                    <p class="card-text"><strong>Endereço:</strong> ${address}</p>
                    <button class="btn btn-danger delete-contact">Excluir</button>
                </div>
            </div>
        `;

        contactsContainer.appendChild(contactCard);
        modal.style.display = "none";
        contactForm.reset();

        contactCard.querySelector(".delete-contact").addEventListener("click", function() {
            contactCard.remove();
        });
    });
});