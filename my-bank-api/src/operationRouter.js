import express from 'express';
import { contatModel } from './operationModel.js';

const app = express();

app.get('/contas', async (req, res) => {
  try {
    const contas = await contatModel.find({});
    res.send(contas);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// 4 - a registrar um depósito em uma conta
app.patch('/deposito/', async (req, res) => {
  try {
    console.log('contas');
    const body = req.body;
    const agencia = body.agencia;
    const conta = body.conta;

    const account = {
      agencia,
      conta,
    };
    const contas = await contatModel.findOne(account);
    if (contas) {
      contas.balance += body.valor;
      contas.save();
      res.send('saldo atual: ' + contas.balance);
    } else {
      res.send('Conta nao encontrada.');
    }
    res.send(contas);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// 5 - saque em uma conta
app.patch('/saque', async (req, res) => {
  try {
    console.log('contas');
    const body = req.body;
    const agencia = body.agencia;
    const conta = body.conta;

    const account = {
      agencia,
      conta,
    };
    const contas = await contatModel.findOne(account);
    if (contas) {
      contas.balance -= body.valor + 1;
      if (contas.balance > 0) {
        contas.save();
        res.send('saldo atual: ' + contas.balance);
      } else {
        throw new Error('saldo insuficiente');
      }
    } else {
      throw new Error('Conta nao encontrada.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// 6 - consultar o saldo da conta
app.get('/saldo/', async (req, res) => {
  try {
    const body = req.body;
    const agencia = body.agencia;
    const conta = body.conta;

    const account = {
      agencia,
      conta,
    };
    const contas = await contatModel.findOne(account);
    if (contas) {
      res.send('saldo atual: ' + contas.balance);
    } else {
      res.send('Conta nao encontrada.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// 7 - excluir uma conta
app.delete('/conta', async (req, res) => {
  try {
    const body = req.body;
    const agencia = body.agencia;
    const conta = body.conta;

    const account = {
      agencia,
      conta,
    };
    await contatModel.deleteOne(account);
    const contas = await contatModel.find({ agencia });
    res.send('Documento removido ' + contas.length);
  } catch (error) {
    res.status(500).send(error);
    console.log('erro delete', error);
  }
});

// 8 - transferências entre contas
app.put('/trans', async (req, res) => {
  try {
    const agencia1 = req.body.agencia1;
    const conta1 = req.body.conta1;
    const account = {
      agencia: agencia1,
      conta: conta1,
    };
    const origem = await contatModel.findOne(account);

    const agencia2 = req.body.agencia2;
    const conta2 = req.body.conta2;
    const account2 = {
      agencia: agencia2,
      conta: conta2,
    };
    const destino = await contatModel.findOne(account2);
    if (agencia1 !== agencia2) {
      origem.balance -= 8;
    }

    const valor = req.body.valor;
    destino.balance += valor;
    origem.balance -= valor;
    origem.save();
    destino.save();
    res.send('Saldo conta origem ' + origem.balance);
  } catch (error) {
    res.status(500).send(error);
    console.log('ERROR', error);
  }
});

// 9 - consultar média do saldo dos clientes de 1 agência
app.get('/saldo/:agencia', async (req, res) => {
  try {
    const agencia = req.params.agencia;
    console.log(agencia);
    const data = await contatModel.find().where('agencia').equals(agencia);
    console.log(data);
    let sumContas = 0;
    data.forEach((element) => {
      sumContas += element.balance;
    });
    console.log(sumContas);

    res.send(
      `média do saldo dos clientes de ${agencia} agência: ` +
        sumContas / data.length
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

// 10 -  mostrar qtd de clientes com o menor saldo em conta
app.get('/saldMenor/:qtd', async (req, res) => {
  try {
    const valor = Number(req.params.qtd);
    const data = await contatModel.find({}).limit(valor).sort('balance');
    console.log(data);
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 11 -  mostrar qtd de clientes com o MAIOR saldo em conta
app.get('/salMaior/:qtd', async (req, res) => {
  try {
    const valor = Number(req.params.qtd);
    const data = await contatModel.find({}).limit(valor).sort({ balance: -1 });
    console.log(data);
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 12 -  cliente com maior saldo em conta de cada agência
app.get('/clients', async (req, res) => {
  try {
    let transferToPrivates = await contatModel.aggregate([
      {
        $group: {
          _id: '$agencia',
          balance: { $max: '$balance' },
        },
      },
    ]);
    console.log(transferToPrivates);
    /*if (transferToPrivates.length === 0) {
      throw new Error("nenhuma conta apta para agencia Private");
    }*/
    for (const transferToPrivate of transferToPrivates) {
      const { _id, balance } = transferToPrivate;
      let newAccounts = await contatModel.findOne({
        agencia: _id,
        balance,
      });
      newAccounts.agencia = 99;
      newAccounts.save();
    }
    transferToPrivates = await contatModel.find({
      agencia: 99,
    });
    res.send(transferToPrivates);
  } catch (error) {
    next(error);
  }
});

export { app as opRouter };
