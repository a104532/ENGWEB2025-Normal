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
        const paisParam = decodeURIComponent(req.params.pais);
        
        // Obter todas as edições
        const response = await axios.get(`${API_BASE_URL}/edicoes`);
        const todasEdicoes = response.data;
        
        // Função de normalização
        const normalize = (str) => {
            if (!str) return '';
            return str.toString()
                .toLowerCase()
                .replace(/_/g, ' ')
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .trim();
        };
        
        const paisNormalizado = normalize(paisParam);
        const participacoes = [];
        const organizacoes = [];

        for (const edicao of todasEdicoes) {
            const ano = edicao.anoEdição || edicao.ano;
            const edicaoId = edicao.id || `ed${ano}`;
            
            // Obter dados completos da edição
            let dadosEdicao;
            try {
                const response = await axios.get(`${API_BASE_URL}/edicoes/${edicaoId}`);
                dadosEdicao = response.data;
            } catch (error) {
                continue;
            }

            // Verificar organização
            const orgNormalizado = normalize(dadosEdicao.organizacao || dadosEdicao.organizador);
            if (orgNormalizado === paisNormalizado) {
                organizacoes.push({
                    id: edicaoId,
                    ano: ano
                });
            }

            // Verificar participações
            if (dadosEdicao.musicas && Array.isArray(dadosEdicao.musicas)) {
                for (const musica of dadosEdicao.musicas) {
                    const paisMusica = musica.país;
                    if (!paisMusica) continue;

                    const musicaPaisNormalizado = normalize(paisMusica);
                    if (musicaPaisNormalizado === paisNormalizado) {
                        participacoes.push({
                            id: edicaoId,
                            ano: ano,
                            musica: musica.título || musica.titulo,
                            interprete: musica.intérprete || musica.interprete,
                            venceu: normalize(dadosEdicao.vencedor) === paisNormalizado,
                            organizou: orgNormalizado === paisNormalizado
                        });
                    }
                }
            }
        }

        res.render('pais', {
            title: `Eurovisão - ${paisParam}`,
            pais: paisParam,
            participacoes: participacoes,
            organizacoes: organizacoes,
            participou: participacoes.length > 0,
            organizou: organizacoes.length > 0
        });

    } catch (error) {
        res.status(500).render('error', {
            message: "Erro ao obter informações do país",
            error: error.message
        });
    }
});

module.exports = router;