# Exemplos

Projetos de referência que mostram **como fica um kickoff preenchido** nos três pilares
(Negócio, Técnico, Time) + Entrega.

| Exemplo | Descrição |
| --- | --- |
| [`diadema-entregas/`](diadema-entregas/) | Marketplace local de delivery — MVP em andamento, time de 4 pessoas, sprint ativa |

## Como usar

**Só consultar:** abra os arquivos em `diadema-entregas/docs/` como referência de conteúdo e estrutura.

**Rodar no gerenciador:** copie `config/` e `docs/` do exemplo para a raiz do kickoff (faça backup do seu projeto antes), ou clone o template num diretório novo e substitua:

```bash
cp -r examples/diadema-entregas/config ./
cp -r examples/diadema-entregas/docs ./
cd gerenciador-projetos && npm run dev
```

**Validar o exemplo** (sem copiar):

```bash
cd gerenciador-projetos
KICKOFF_DOCS=../examples/diadema-entregas/docs npm run lint:docs
```
