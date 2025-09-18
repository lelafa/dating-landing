document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const openBtn = document.getElementById("openPopup");
  const closeBtn = document.getElementById("closePopup");
  const form = document.getElementById("popupForm");
  const thankYou = document.getElementById("popupThankYou");

  openBtn.addEventListener("click", () => {
    popup.classList.add("popup__active");
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.remove("popup__active");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("popup__active")) {
      popup.classList.remove("popup__active");
    }
  });
/*
    const token = localStorage.getItem("authToken");
    if (token) {
        window.location.href = `https://www.dating.com/people/#token=${token}`;
        return;
    }
*/
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.email;
    const passwordInput = form.password;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    document.querySelectorAll(".popup-input__errorText").forEach(el => el.remove());
    emailInput.classList.remove("popup-input__error");
    passwordInput.classList.remove("popup-input__error");

    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error = document.createElement("span");
        error.className = "popup-input__errorText";
        error.textContent = "Please enter a valid e-mail";
        emailInput.insertAdjacentElement("afterend", error);
        emailInput.classList.add("popup-input__error");
        valid = false;
    }

    if (!password || password.length < 8) {
        const error = document.createElement("span");
        error.className = "popup-input__errorText";
        error.textContent = "The password should have at least 8 symbols";
        passwordInput.insertAdjacentElement("afterend", error);
        passwordInput.classList.add("popup-input__error");
        valid = false;
    }

    if (!valid) return;

    try {
        let res = await fetch("https://api.dating.com/identity", {
        method: "GET",
        headers: {
            "Authorization": "Basic " + btoa(`${email}:${password}`)
        }
        });

        if (res.ok) {
        const token = res.headers.get("X-Token");
        if (token) {
            localStorage.setItem("authToken", token);
            window.location.href = `https://www.dating.com/people/#token=${token}`;
            return;
        }
        }

        res = await fetch("https://api.dating.com/identity", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
        throw new Error("Registration failed");
        }

        const token = res.headers.get("X-Token");
        if (token) {
            localStorage.setItem("authToken", token);
            window.location.href = `https://www.dating.com/people/#token=${token}`;
        } else {
            form.classList.add("hidden");
            thankYou.classList.remove("hidden");
        }
    } catch (err) {
        alert(err.message);
    }
    });
});
