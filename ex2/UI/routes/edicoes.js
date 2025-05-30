const express = require('express');
const axios = require('axios');
const router = express.Router();
const API_BASE_URL = 'http://localhost:25000';

// Função para gerar ID consistente
function gerarIdEdicao(anoEdicao) {
    return `ed${anoEdicao}`;
}

/* Página Principal - Lista de edições */
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/edicoes`);
        const edicoes = response.data;
        
        const edicoesProcessadas = edicoes.map(edicao => {
            const id = gerarIdEdicao(edicao.anoEdição);
            return {
                id: id,
                anoEdicao: edicao.anoEdição,
                organizacao: edicao.organizacao,
                vencedor: edicao.vencedor
            };
        });
        
        res.render('index', {
            title: "Eurovisão - Todas as Edições",
            edicoes: edicoesProcessadas
        });
        
    } catch (error) {
        console.error('Erro ao obter edições:', error);
        res.status(500).render('error', {
            message: "Erro ao obter a lista de edições",
            error: error.message
        });
    }
});

/* Página de detalhes da edição */
router.get('/:id', async (req, res) => {
  try {
      const anoEdicao = req.params.id.replace('ed', '');
      const response = await axios.get(`${API_BASE_URL}/edicoes/${req.params.id}`);
      const edicao = response.data;
      
      if (!edicao) {
          return res.status(404).render('error', {
              message: `Edição ${req.params.id} não encontrada`
          });
      }
      
      // Garantir que o campo musicas existe
      edicao.musicas = edicao.musicas || [];
      
      res.render('edicao', {
          title: `Edição ${edicao.id} (${edicao.anoEdição})`,
          edicao: edicao
      });
      
  } catch (error) {
      console.error('Erro ao obter detalhes:', error.message);
      res.status(500).render('error', {
          message: "Erro ao obter detalhes da edição"
      });
  }
});

/* Página do país */
router.get('/paises/:pais', async (req, res) => {
  try {
      const pais = decodeURIComponent(req.params.pais);
      
      // Obter todas as edições
      const response = await axios.get(`${API_BASE_URL}/edicoes`);
      const todasEdicoes = response.data;
      
      // Filtrar participações
      const participacoes = [];
      todasEdicoes.forEach(edicao => {
          // Verificar se o país participou (tem música nesta edição)
          const musicaDoPais = edicao.musicas?.find(m => m.país === pais);
          if (musicaDoPais) {
              participacoes.push({
                  id: gerarIdEdicao(edicao.anoEdição),
                  ano: edicao.anoEdição,
                  musica: musicaDoPais.título,
                  interprete: musicaDoPais.intérprete,
                  venceu: edicao.vencedor === pais,
                  organizou: edicao.organizacao === pais
              });
          }
      });
      
      // Obter edições organizadas (alternativa mais confiável)
      const organizacoes = todasEdicoes
          .filter(edicao => edicao.organizacao === pais)
          .map(edicao => ({
              id: gerarIdEdicao(edicao.anoEdição),
              ano: edicao.anoEdição
          }));
      
      res.render('pais', {
          title: `País: ${pais}`,
          pais: pais,
          participacoes: participacoes,
          organizacoes: organizacoes,
          participou: participacoes.length > 0,
          organizou: organizacoes.length > 0
      });
      
  } catch (error) {
      console.error('Erro ao obter informações do país:', error);
      res.status(500).render('error', {
          message: "Erro ao obter informações do país",
          error: error.message
      });
  }
});

module.exports = router;