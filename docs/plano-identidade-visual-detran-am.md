# Plano de aplicação da identidade visual do DETRAN-AM

## Objetivo

Aplicar ao Manual do Usuário do TEAT uma identidade institucional coerente com as marcas fornecidas em `docs/identidade-visual-detran-AM/`, preservando a legibilidade, a hierarquia editorial e a manutenção automatizada do PDF.

## Diretrizes adotadas

1. **Marca institucional:** usar o logotipo completo na capa e o ícone como grafismo secundário, sem redesenhar ou distorcer os arquivos fornecidos.
2. **Paleta:** adotar azul-marinho e laranja como cores principais; reservar fundos claros e cores semânticas para leitura, tabelas e avisos.
3. **Capa:** dar protagonismo ao DETRAN-AM, manter o TEAT como produto e identificar claramente o tipo do documento.
4. **Miolo:** identificar DETRAN-AM, TEAT e “Manual do Usuário” no cabeçalho; usar a paleta institucional em títulos, linhas, tabelas e rodapé.
5. **Numeração:** usar o sumário de `manual-usuario/index.md` como fonte de verdade para numerar capítulos e subseções no PDF.
6. **Manutenção:** calcular a numeração durante a geração, evitando duplicação manual e divergência entre títulos e sumário.

## Correspondência de seções

- capítulos principais: `1` a `9`;
- fluxos subordinados ao capítulo 4: `4.1` a `4.9`;
- seções internas dos capítulos terminais: acréscimo progressivo por nível, como `2.1`, `4.1.1` e `4.9.2.1`;
- página de abertura do capítulo 4: apenas o título recebe número, evitando colisão com os subfluxos `4.1` a `4.9` definidos no sumário.

## Aplicação técnica

- incorporar as imagens oficiais como dados locais no PDF, sem dependência de rede;
- usar o logotipo completo somente na capa e o ícone em baixa opacidade como apoio gráfico;
- atualizar os estilos de capa, cabeçalho, rodapé, títulos, listas, tabelas e avisos;
- tornar os subfluxos do sumário uma lista ordenada;
- preservar os textos originais dos títulos e os destinos dos links.

## Validação

- executar `npm run check:links`;
- gerar o PDF canônico com `npm run pdf`;
- confirmar visualmente capa, sumário, hierarquia de títulos, cabeçalhos, rodapés e legibilidade das marcas;
- executar `npm run release:check` apenas no fluxo formal de publicação, após atualizar versão, histórico e assinatura das fontes.

## Limitações dos insumos

As marcas recebidas estão em JPEG, com fundo branco e resolução limitada. Elas são adequadas para o tamanho aplicado neste manual, mas uma futura versão em SVG ou PNG transparente dará melhor resultado em impressão e permitirá maior flexibilidade de composição.
