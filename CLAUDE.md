# Casa Nunes · Gestão (casanunes.github.io)

Sistema interno das lojas Casa Nunes (móveis, Itapevi/SP): vendas, pedidos, entregas, carnê, caixa, financeiro, estoque, clientes e fornecedores das **duas lojas** (Loja 1 e Loja 2). Quem usa: o dono (Kaiky, perfil Administração), vendedores e quem atende as lojas. Ele não é programador: explique em português simples, sem jargão, e mostre o resultado (o que mudou na tela), não o código.

Este repositório é **público**. Nunca coloque aqui senhas, chaves secretas, CNPJ, faturamento, valores de imposto ou dados de clientes. Dados da empresa vão para o banco (Supabase), que é protegido por login.

## Onde está cada coisa

- **Endereço certo do sistema:** https://casanunes.github.io (GitHub Pages, repositório `casanunes/casanunes.github.io`, branch `main`). Publicar = fazer commit e push no `main`; o GitHub Pages atualiza em cerca de 1 minuto.
- **casanunes.netlify.app é uma cópia VELHA (31/10/2026), sem as correções.** Ela só redireciona para o github.io (snippet no Netlify). Nunca analise, corrija nem publique nada nela. Os créditos do Netlify estão esgotados.
- `index.html` (~330 KB, ~1.900 linhas): o sistema inteiro, HTML + CSS + JS num arquivo só. Usa `supabase-js` 2.45.4 pelo jsDelivr.
- `visual-gestao.js`: camada só de visual (estilo Apple), carregada no fim do `index.html`. Muda aparência, não regra de negócio: cantos, cartão escuro, "Marcar entregue" verde, Troca/Cancelar/Histórico em "Mais opções", barra de 4 abas + "Mais" no celular, letra em rem, modo escuro automático, botão ↻ no topo e atualização automática por ETag. Se mudar a estrutura de uma tela, confira se esta camada continua encaixando.
- `sw.js`: service worker. Sempre busca a versão nova na internet; sem internet abre a última salva.
- `version.json` + `APP_VER` (dentro do `index.html`): **toda publicação precisa subir os dois para o mesmo valor novo** (formato `AAAAMMDDhhmm`, ex.: `202611071225`). É isso que faz o app instalado mostrar "Tem uma atualização nova do sistema". Se esquecer, o app instalado não percebe a versão nova.
- `CasaNunes_Pages.zip`: pacote antigo. Não use como fonte.

## Banco de dados (Supabase)

Projeto `nhnkvszkfpjfcvksacma`. Todas as tabelas têm RLS ligado. Funções de permissão já existentes: `is_admin()`, `logado()`, `ve_lucro()`, `cn_ve_custo()`. Tabela nova: copie o padrão de uma parecida (ex.: dado só do dono → `using (is_admin()) with check (is_admin())`).

Tabelas do Gestão: `vendas` (vendas e orçamentos; `tipo` = `venda` ou `orc`), `parcelas`, `carne_pagamentos`, `clientes`, `produtos`, `produtos_custo`, `fornecedores`, `compras`, `despesas`, `vendedores`, `vendedores_pagto`, `caixa_abertura`, `caixa_sangrias`, `caixa_fechamentos`, `atacado_vendas`, `config`, `profiles`.
Tabelas `loja_*` (`loja_produtos`, `loja_pedidos`, `loja_cidades`, `loja_config`, `loja_eventos`, `loja_admins`) são do **site da loja para clientes** (casanunes-loja.pages.dev, Cloudflare Pages, outro projeto). Não mexa nelas por causa do Gestão.

O Supabase é **produção, com dados reais**. Antes de qualquer mudança de estrutura (criar/alterar tabela, policy) ou de apagar/alterar dados: explique o que vai fazer e espere o "pode" do Kaiky. Leitura (select) pode à vontade.

## Regras de negócio que NÃO podem quebrar

Estas regras já foram pedidas mais de uma vez. Quebrar qualquer uma delas foi o que mais irritou o dono.

1. **Carnê conta só o que entrou de verdade.** Na venda entra só a **entrada** (`entrada`/`entr`); depois, cada parcela entra no mês em que é paga. O valor total do carnê nunca entra no faturamento, no caixa nem na Visão geral. No código: `vEnt(s)` (carnê → entrada, senão `s.v`) e `recSale(s,k,fx)`. "A receber dos carnês" é mostrado separado.
2. **Cartão de crédito conta o valor cheio na venda.** Parcelado no cartão só aparece mês a mês no **Fluxo de caixa** (só administrador, `cartaoParcelas`).
3. **"Marcar entregue" tem que gravar no banco** e continuar entregue depois de recarregar.
4. **Não duplicar vendas.** Já aconteceu de vendas aparecerem duplicadas na aba de administrador. O salvamento compara com uma "foto" do estado (`snapAll`/`SNAP`, com cópia profunda `snapc`); se mexer em salvamento/sincronização, teste salvar, recarregar e conferir que não duplicou.
5. **Duas lojas:** Loja 1 e Loja 2 separadas; Administração vê as duas.

Antes de publicar qualquer mudança, confira de verdade (abra o sistema e veja a tela; para conta de dinheiro, compare com o banco). Não diga "pronto" sem ter conferido.

## Como trabalhar aqui

- Mudanças pequenas e uma de cada vez. Mostre antes e depois.
- O dono prefere trabalho **por partes** (para não gastar limite) e quer saber o que mudou, em linguagem simples.
- Visual: siga o estilo atual (fonte Plus Jakarta Sans, cartões claros, um acento por tela). Sem degradê, sem listras, sem emoji no lugar de ícone, sem travessão longo (U+2014) em texto da tela.
- Ao terminar: commit claro em português, subir `APP_VER` e `version.json`, push no `main`, esperar o Pages publicar e conferir no ar.

## Próxima tarefa: controle do DAS (Simples Nacional)

O dono quer o próprio controle do imposto DAS dentro do Gestão, só para Administração.

Fatos da empresa (vindos do PGDAS-D; os números ficam no banco, não aqui):
- Optante pelo **Simples Nacional**, regime de **competência**, **Anexo I** (comércio: revenda de mercadorias sem substituição tributária).
- Matriz e filial em Itapevi/SP, na mesma declaração. Sem folha de salários (Fator r não se aplica).
- DAS vence no **dia 20 do mês seguinte** à competência (se cair em fim de semana/feriado, a Receita adia para o dia útil seguinte; confira).

Dados: o arquivo `das-setup.sql` (o dono vai te mandar, **não comite**) cria a tabela `das_competencias` (só admin) e já traz o faturamento declarado de 01/2025 a 09/2026 e a apuração completa de 09/2026. Rode só depois do "pode" dele. Se ele mandar mais PDFs do PGDAS-D, importe da mesma forma (`origem = 'pgdas'`).

Cálculo (Anexo I, LC 123/2006; confira se continua valendo, a reforma tributária pode mudar a partir de 2027):
- `RBT12` = soma da receita bruta dos 12 meses anteriores à competência.
- Alíquota efetiva = `(RBT12 × alíquota nominal − parcela a deduzir) / RBT12`.
- DAS estimado = receita do mês × alíquota efetiva.
- Faixas do Anexo I (RBT12 → nominal / dedução): até 180.000 → 4% / 0 · até 360.000 → 7,3% / 5.940 · até 720.000 → 9,5% / 13.860 · até 1.800.000 → 10,7% / 22.500 · até 3.600.000 → 14,3% / 87.300 · até 4.800.000 → 19% / 378.000.
- Teste obrigatório: com o RBT12 e a receita de 09/2026 que estão no banco, o cálculo tem que dar exatamente o valor da guia de 09/2026 (alíquota efetiva ≈ 7,13%). Se não bater, o cálculo está errado.

O que a tela deve ter (proposta; confirme com o dono antes de construir, uma pergunta por vez):
- Lista mês a mês: faturamento declarado, DAS, vencimento, pago ou não (com botão para marcar pago e o valor).
- **DAS estimado do mês atual**, calculado com o faturamento que o próprio Gestão registra (respeitando a regra do carnê? pergunte ao dono qual receita usar: a declarada à contabilidade é por competência) e o RBT12.
- Aviso de vencimento perto (ex.: 5 dias antes) e de guia atrasada.
- Comparação "faturamento no Gestão × faturamento declarado" por mês, para ele conferir com a contabilidade.
- Alerta se o RBT12 estiver chegando perto de mudar de faixa (a alíquota sobe).
- Entrada fácil dos meses novos: digitar os números ou mandar o PDF do PGDAS-D.
