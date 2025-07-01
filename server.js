// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';   // ⬅️ mede tempo

const app  = express();
const PORT = process.env.PORT || 3000;

// __dirname em ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// static /public
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Algoritmos ---------- */
function hanoi(n, from='A', to='C', aux='B', moves=[]) {
  if (n === 1) { moves.push(`Mova disco 1 de ${from} → ${to}`); return moves; }
  hanoi(n-1, from, aux, to, moves);
  moves.push(`Mova disco ${n} de ${from} → ${to}`);
  hanoi(n-1, aux, to, from, moves);
  return moves;
}
function hanoiCPU(n, from='A', to='C', aux='B') {   // só CPU, sem array
  if (n === 1) return;
  hanoiCPU(n-1, from, aux, to);
  hanoiCPU(n-1, aux, to, from);
}
/* ---------- Rotas ---------- */
// Telinha já funciona porque /public/index.html é estático

// 1. Lista de movimentos (para poucos discos)
app.get('/hanoi', (req, res) => {
  const n = Number(req.query.n ?? 3);
  if (!Number.isInteger(n) || n < 1 || n > 15)
    return res.status(400).json({ error: 'n 1-15 aqui, p/ mais use /hanoi/cpu' });

  const moves = hanoi(n);
  res.json({ discos: n, total: moves.length, movimentos: moves });
});

// 2. Stress de CPU (n até 30) — não guarda nada
app.get('/hanoi/cpu', (req, res) => {
  const n     = Number(req.query.n   ?? 24);   // default 24 discos
  const loops = Number(req.query.loop?? 1);    // repete p/ prolongar

  if (!Number.isInteger(n)     || n < 1 || n > 30 ||
      !Number.isInteger(loops) || loops < 1 || loops > 100)
    return res.status(400).json({ error: 'params invalidos' });

  const t0 = performance.now();
  for (let i = 0; i < loops; i++) hanoiCPU(n);
  const ms = (performance.now() - t0).toFixed(1);

  res.json({ discos: n, loops, exec_ms: ms, movimentos: 2**n - 1 });
});

// 3. Stress de RAM (n até 22) — guarda todos movimentos
app.get('/hanoi/memory', (req, res) => {
  const n = Number(req.query.n ?? 22);
  if (!Number.isInteger(n) || n < 1 || n > 22)
    return res.status(400).json({ error: 'n 1-22 (acima disso estoura RAM)' });

  const moves = hanoi(n);
  res.json({ discos: n, total: moves.length });
});

app.listen(PORT, () => console.log(` http://localhost:${PORT}`));
