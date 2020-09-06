import express from 'express';
import { promises as fs } from 'fs';

const app = express();
app.use(express.json());

app.post('/create', async (req, res, next) => {
  let obj = null;
  try {
    let grade = await readJson();

    obj = {
      id: grade.nextId,
      student: req.body.student,
      subject: req.body.subject,
      type: req.body.type,
      value: req.body.value,
      timestamp: new Date(Date.now()),
    };
    grade.nextId = grade.nextId + 1;
    grade.grades.push(obj);
    await writeJson(grade);
    res.send(obj);
  } catch (err) {
    next(err);
  }
});

app.post('/update', async (req, res, next) => {
  try {
    let grade = await readJson();
    let posicao = grade.grades.findIndex((e) => e.id === req.body.id);
    if (posicao < 0) {
      res.status(404).send('NAO ACHEI');
    }
    if (req.body.student) grade.grades[posicao].student = req.body.student;
    if (req.body.subject) grade.grades[posicao].subject = req.body.subject;
    if (req.body.type) grade.grades[posicao].type = req.body.type;
    if (req.body.value) grade.grades[posicao].value = req.body.value;
    await writeJson(grade);
  } catch (err) {
    next(err);
  }
  res.end();
});

app.delete('/del', async (req, res, next) => {
  try {
    let grade = await readJson();
    let posicao = grade.grades.findIndex((e) => e.id === req.body.id);
    if (posicao < 0) {
      res.status(404).send('NAO ACHEI');
    }
    grade.grades.splice(posicao, 1);
    await writeJson(grade);
  } catch (err) {
    next(err);
  }
  res.end();
});

app.get('/', async (req, res, next) => {
  let element = null;
  try {
    let grade = await readJson();
    element = grade.grades.find((e) => e.id === req.body.id);
  } catch (err) {
    next(err);
  }
  res.send(element);
});

app.get('/somaNota', async (req, res, next) => {
  const filtro = { student: req.body.student, subject: req.body.subject };
  let elements = null;
  let soma = 0;
  try {
    let grade = await readJson();
    elements = grade.grades.filter((item) => {
      for (var i in filtro) {
        if (item[i] != filtro[i]) {
          return false;
        }
      }
      return true;
    });
    elements.forEach((e) => {
      soma = soma + e.value;
    });
  } catch (err) {
    next(err);
  }
  res.send(soma + ' ');
});

app.get('/media', async (req, res, next) => {
  const filtro = { subject: req.body.subject, type: req.body.type };
  let elements = null;
  let soma = 0;
  try {
    let grade = await readJson();
    elements = grade.grades.filter((item) => {
      for (var i in filtro) {
        if (item[i] != filtro[i]) {
          return false;
        }
      }
      return true;
    });
    elements.forEach((e) => {
      soma = soma + e.value;
    });
  } catch (err) {
    next(err);
  }
  res.send(soma / elements.length + ' ');
});

app.get('/melhores', async (req, res, next) => {
  const filtro = { subject: req.body.subject, type: req.body.type };
  let elements = null;
  try {
    let grade = await readJson();
    elements = grade.grades.filter((item) => {
      for (var i in filtro) {
        if (item[i] != filtro[i]) {
          return false;
        }
      }
      return true;
    });
    elements.sort(function (a, b) {
      return b.value - a.value;
    });
  } catch (err) {
    next(err);
  }
  res.send(elements.slice(0, 3));
});

async function readJson() {
  let data = null;
  try {
    data = JSON.parse(await fs.readFile(`grades.json`));
  } catch (err) {
    console.log(err);
  }
  return data;
}

async function writeJson(contentGrade) {
  try {
    fs.writeFile(`grades.json`, JSON.stringify(contentGrade));
  } catch (err) {
    console.log(err);
  }
}

app.listen(3000, () => {
  console.log('API startou!');
});
