const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
app.use(express.json());

const prisma = new PrismaClient();

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
      isDone: false
    }
  });
  res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { nome, descricao, isDone } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        nome,
        descricao,
        isDone
      }
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
        id: taskId
      }
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});