
    (function () {
        const toggle = document.querySelector('.toggle-password');
        const pwd = document.getElementById('password');
        if (toggle && pwd) {
            toggle.addEventListener('click', function () {
                const reveal = pwd.type === 'password';
                pwd.type = reveal ? 'text' : 'password';
                toggle.classList.toggle('revealed', reveal);
                pwd.focus({ preventScroll: true });
            });
        }
    })();

    async function goToPage() {
        //consigo los datos
        const role = document.querySelector('input[name="role"]:checked')?.value;
        const correo = document.getElementById('correo').value;
        const password = document.getElementById('password').value;

        //hago un fetch a php
        const res = await fetch("../php/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password, role }),
            credentials: "same-origin" // para enviar cookies de la sesion
        });

        const data = await res.json();

        if (!data.success) {
            alert("Datos incorrectos, por favor verifique los campos.");
            return;
        }

        console.log(data);
        window.location.href = data.redirect;
    }
