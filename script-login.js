document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginFormData');
    const registerForm = document.getElementById('registerFormData');
    const loginFormContainer = document.getElementById('loginForm');
    const registerFormContainer = document.getElementById('registerForm');

    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');

    // Alternância entre login e registro
    registerLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    loginLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    });

    // Tratamento do formulário de login
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Evitar o envio padrão do formulário

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Enviar dados para o backend (rota POST /login)
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })  // Dados enviados no corpo da requisição
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => { throw new Error(data.message); });
                }
                return response.json();  // Converte a resposta para JSON se status for ok
            })
            .then(data => {
                if (data.token) {
                    // Se o login for bem-sucedido, armazene o token e redirecione
                    localStorage.setItem('token', data.token);
                    alert(`Login efetuado com sucesso`)
                    window.location.href = '/'; // Redirecionar para a página inicial
                } else {
                    alert('Erro inesperado: token não encontrado.');
                }
            })
            .catch(error => {
                alert('Erro ao fazer login: ' + error.message);  // Exibe mensagem de erro em caso de falha na requisição
            });
    });
    // Tratamento do formulário de registro
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Evitar o envio padrão do formulário

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const address = document.getElementById('registerAddress').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Enviar dados para o backend (rota POST /register)
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, address, password, confirmPassword })  // Dados enviados no corpo da requisição
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => { throw new Error(data.message); });
                }
                return response.json();  // Converte a resposta para JSON se status for ok
            })
            .then(data => {
                alert(data.message); // Exibe mensagem de sucesso
                loginFormContainer.style.display = 'block';
                registerFormContainer.style.display = 'none';
            })
            .catch(error => {
                alert(`Erro ao registrar: ${error.message}`);
            });
    });
});
