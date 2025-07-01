const btnRun   = document.getElementById('btnRun');
const inputN   = document.getElementById('inputN');
const saida    = document.getElementById('saida');
const totalLbl = document.getElementById('total');
const alertDiv = document.getElementById('alertErro');

btnRun.addEventListener('click', async () => {
  const n = parseInt(inputN.value, 10);

  alertDiv.classList.add('d-none');
  saida.textContent = '... carregando ...';
  totalLbl.textContent = '0';

  try {
    const res = await fetch(`/hanoi?n=${n}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    saida.textContent = data.movimentos.join('\n');
    totalLbl.textContent = data.total;
  } catch (err) {
    saida.textContent = '';
    alertDiv.textContent = err.message || 'Erro inesperado';
    alertDiv.classList.remove('d-none');
  }
});
