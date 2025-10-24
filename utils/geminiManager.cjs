const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Inicializa o cliente do Gemini com a chave da API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gerarInfoFilme(nome) {
  // Escolhe o modelo. "gemini-1.5-flash" é rápido e excelente para tarefas como esta.
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
    Gere um JSON com as seguintes informações sobre o filme "${nome}":
    {
      "titulo": "",
      "ano": "",
      "diretor": "",
  "genero": "",
      "atores": "",
      "sinopse": "",
      "nota": "",
      "poster_url": "URL direta para um arquivo .jpg ou .png"
    }
    As respostas devem estar em português e **somente** o JSON deve ser retornado.
    O valor de "poster_url" DEVE ser um link direto para uma imagem (terminando em .jpg, .png, ou .webp),
    e NÃO um link para uma página web como IMDb ou Wikipedia.
    Se nenhuma imagem for encontrada, retorne uma string vazia "".
    `;

  try {
    // Faz a chamada para a API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // ✅ Esta é a configuração que força a saída em JSON puro
      generationConfig: {
        response_mime_type: "application/json",
      },
    });

    // Extrai o texto da resposta
    const responseText = result.response.text();
    
    // Converte o texto JSON para um objeto JavaScript e o retorna
    return JSON.parse(responseText);

  } catch (error) {
    console.error("Erro ao gerar informação do filme com Gemini:", error);
    throw error;
  }
}

module.exports = { gerarInfoFilme };