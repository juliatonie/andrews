const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path'); // Importar o módulo path
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Altere com seu usuário
    password: 'pjSq2023@',  // Altere com sua senha
    database: 'cafeteria'  // Altere com o nome do seu banco de dados
});

// Conectar ao banco de dados
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados MySQL bem-sucedida!');
});

// Middleware para processar os dados JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos das pastas 'paginas' e 'scripts'
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'paginas'))); 

// Rota para servir a página inicial (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'index.html'));  // Caminho correto para o arquivo index.html
});

// Rota de registro
app.post('/register', (req, res) => {
    const { name, email, address, password, confirmPassword } = req.body;

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
        console.log('As senhas não coincidem');
        return res.status(400).json({ message: 'As senhas não coincidem.' });
    }

    // Verificar se o e-mail já está cadastrado
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Erro ao verificar e-mail:', err);
            return res.status(500).json({ message: 'Erro ao verificar e-mail.' });
        }

        if (result.length > 0) {
            console.log('E-mail já cadastrado:', email);
            return res.status(400).json({ message: 'E-mail já cadastrado.' });
        }

        // Hash da senha
        /*
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Erro ao criar hash da senha:', err);
                return res.status(500).json({ message: 'Erro ao criar senha.' });
            }*/

            // Inserir no banco de dados
            connection.query('INSERT INTO usuarios (nome_completo, email, endereco, senha) VALUES (?, ?, ?, ?)', [name, email, address, password], (err, result) => {
                if (err) {
                    console.error('Erro ao registrar usuário:', err);
                    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
                }

                console.log('Usuário registrado com sucesso:', email);
                res.status(200).json({ message: 'Usuário registrado com sucesso!' });
            });
        });
    });


// Rota de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verificar se o e-mail existe
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao verificar e-mail.' });

        if (result.length === 0) {
            return res.status(400).json({ message: 'E-mail não encontrado.' });
        }

        // Comparar a senha
        /*
        bcrypt.compare(password, result[0].senha, (err, isMatch) => {
            console.log(result[0].senha);
             console.log(result[0].senha);
            if (err) return res.status(500).json({ message: 'Erro ao verificar a senha.' });

            if (!isMatch) {
                return res.status(400).json({ message: 'Senha incorreta.' });
            }



            res.status(200).json({ message: 'Login bem-sucedido'});
        });
*/      
if (password === result[0].senha) {
    const jwtSecret = process.env.JWT_SECRET || 'secreta'; // Use uma variável de ambiente para maior segurança
    const token = jwt.sign({ id: result[0].id, email: result[0].email }, jwtSecret, { expiresIn: '1h' });
    
    // Enviar token de volta ao frontend
    return res.status(200).json({ message: 'Login bem-sucedido', token });
} else {
    return res.status(400).json({ message: 'Senha incorreta.' });
}
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
