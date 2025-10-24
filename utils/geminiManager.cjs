const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function buscarPosterOMDB(nomeFilme) {
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: process.env.OMDB_API_KEY,
        t: nomeFilme,
        type: 'movie'
      }
    });

    if (response.data.Response === "True" && response.data.Poster !== "N/A") {
      return response.data.Poster;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar poster no OMDB:", error.message);
    return null;
  }
}

async function gerarInfoFilme(nome) {
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
      "onde_assistir": ""
    }
    Nao invente filmes. Se o filme nao existir, deixe todos os campos em branco.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json",
      },
    });

    const responseText = result.response.text();
    const filmeInfo = JSON.parse(responseText);
    
    // Busca o poster no OMDB
    const posterUrl = await buscarPosterOMDB(filmeInfo.titulo || nome);
    filmeInfo.poster_url = posterUrl;

    return filmeInfo;

  } catch (error) {
    console.error("Erro ao gerar informação do filme com Gemini:", error);
    throw error;
  }
}

module.exports = { gerarInfoFilme };