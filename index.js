const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Rota de registro de usuários
app.post('/users/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

// Rota de login
app.post('/users/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Comparação da senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    res.json({ message: 'Login bem-sucedido.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// Rotas existentes para tarefas
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { nome, descricao } = req.body;
  const newTask = await prisma.task.create({
    data: {
      nome,
      descricao,
      isDone: false,
    },
  });
  res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { nome, descricao, isDone } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        nome,
        descricao,
        isDone,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
});

const port = 3000;
app.listen
