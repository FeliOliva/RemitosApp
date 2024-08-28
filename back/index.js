const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://felitooliva2:felipe123@remitos.95qt8.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

const clienteSchema = new mongoose.Schema({
  nombre: String,
  remitos: [
    {
      fecha: Date,
      importe: Number,
    },
  ],
  pagos: [
    {
      fecha: Date,
      importe: Number,
    },
  ],
});

const Cliente = mongoose.model("Cliente", clienteSchema);

app.post("/clientes", async (req, res) => {
  const cliente = new Cliente(req.body);
  await cliente.save();
  res.status(201).send(cliente);
});

app.get("/clientes", async (req, res) => {
  const clientes = await Cliente.find();
  res.send(clientes);
});

app.post("/clientes/:id/remitos", async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  cliente.remitos.push(req.body);
  await cliente.save();
  res.send(cliente);
});

app.post("/clientes/:id/pagos", async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  cliente.pagos.push(req.body);
  await cliente.save();
  res.send(cliente);
});

app.get("/clientes/:id/saldo", async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  const totalRemitos = cliente.remitos.reduce(
    (acc, remito) => acc + remito.importe,
    0
  );
  const totalPagos = cliente.pagos.reduce((acc, pago) => acc + pago.importe, 0);
  const saldo = totalRemitos - totalPagos;
  res.send({ saldo });
});
app.listen(3000, () => console.log("Server running on port 3000"));
