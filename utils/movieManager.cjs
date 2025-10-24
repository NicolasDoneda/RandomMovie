const fs = require('fs');
const path = require('path');
const removeAccents = require('remove-accents');

const filePath = path.join(__dirname, '../filmes.json');

// Garante que o arquivo existe
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// Lê os filmes
function getFilmes() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Salva os filmes
function saveFilmes(filmes) {
  fs.writeFileSync(filePath, JSON.stringify(filmes, null, 2));
}

// Adiciona filme, validei duplicidade e maiuscula
function addFilme(novoFilme, usuario) {
  const filmes = getFilmes();
  const normalizedNew = removeAccents(novoFilme.toLowerCase().trim());

  const exists = filmes.some(
    (f) => removeAccents(f.nome.toLowerCase()) === normalizedNew
  );

  if (exists) return false;

  filmes.push({ nome: novoFilme, usuario });
  saveFilmes(filmes);
  return true;
}

// Sorteia e remove filme da lista
function sortearFilme() {
  const filmes = getFilmes();
  if (filmes.length === 0) return null;

  const index = Math.floor(Math.random() * filmes.length);
  const filmeEscolhido = filmes.splice(index, 1)[0];

  saveFilmes(filmes);

  return `${filmeEscolhido.nome} (adicionado por ${filmeEscolhido.usuario})`;
}

// Remove filme manualmente
function removeFilme(nomeFilme) {
  const filmes = getFilmes();
  const normalized = removeAccents(nomeFilme.toLowerCase().trim());

  const index = filmes.findIndex(
    (f) => removeAccents(f.nome.toLowerCase()) === normalized
  );

  if (index === -1) return false;

  filmes.splice(index, 1);
  saveFilmes(filmes);
  return true;
}

module.exports = {
  getFilmes,
  addFilme,
  sortearFilme,
  removeFilme,
  saveFilmes, 
};
