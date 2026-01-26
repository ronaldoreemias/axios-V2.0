# 🚀 Guia de Deploy e Testes de SEO

## 1. Testar Localmente

### Build e Visualização
```bash
# Gerar build
npm run build

# Verificar se gerou sem erros
# Deveria criar pasta 'dist' com index.html

# Visualizar build localmente (antes de enviar)
npm run preview
# Acesse: http://localhost:4173
```

### Inspeccionar Meta Tags Localmente

1. Abra `npm run preview` no navegador
2. Pressione `Ctrl + Shift + I` (ou `Cmd + Option + I` no Mac)
3. Vá para a aba **Elements/Inspector**
4. Procure por `<head>`
5. Verifique se as meta tags estão lá:
   ```html
   <title>Seu Título | Axios News</title>
   <meta name="description" content="...">
   <meta property="og:image" content="...">
   ```

## 2. Testes Online (Após Deploy)

### 2.1 Google PageSpeed Insights
**URL**: https://pagespeed.web.dev/

```
1. Cole sua URL
2. Verifica:
   - Performance
   - Acessibilidade
   - SEO
   - Boas práticas
3. Objetivo: Score > 90 em SEO
```

Checklist de SEO que aparece:
- ✅ Mobile-friendly
- ✅ Viewport configurado
- ✅ Core Web Vitals
- ✅ Meta tags presentes

### 2.2 Google Mobile-Friendly Test
**URL**: https://search.google.com/test/mobile-friendly

```
1. Cole sua URL
2. Clique em "Testar"
3. Deve aparecer: "Página é compatível com dispositivos móveis"
```

### 2.3 Open Graph Debugger (Facebook)
**URL**: https://developers.facebook.com/tools/debug/

```
1. Cole a URL de uma postagem
2. Clique em "Debug"
3. Verifica como aparecerá no Facebook/WhatsApp:
   - Título
   - Descrição
   - Imagem
4. Deve aparecer correto e não quebrado
```

### 2.4 Twitter Card Validator
**URL**: https://cards-dev.twitter.com/validator

```
1. Cole a URL de uma postagem
2. Verifica como aparecerá no Twitter/X:
   - Card type (summary_large_image)
   - Título
   - Descrição
   - Imagem
```

## 3. Google Search Console (Mais Importante!)

### Registrar seu site

**URL**: https://search.google.com/search-console

```
1. Clique em "Adicionar propriedade"
2. Escolha "URL prefix"
3. Digite sua URL: https://seu-dominio.com
4. Clique em "Continuar"
5. Escolha um método de verificação (DNS, tag HTML, arquivo)
```

### Submeter Sitemap
```
1. No menu esquerdo: "Sitemaps"
2. Cole a URL do seu sitemap: https://seu-dominio.com/sitemap.xml
3. Clique em "Enviar"
4. Volta para ver o status
```

### Monitorar Performance
```
1. Menu: "Desempenho"
2. Ver:
   - Cliques totais
   - Impressões (vezes que apareceu no Google)
   - CTR (Taxa de cliques)
   - Posição média
```

## 4. Estrutura de Pastas para Deploy

Sua estrutura deve ser:
```
axiosnews12/
├── dist/                    # ← Build gerado
│   ├── index.html
│   ├── assets/
│   └── ...
├── public/
├── src/
├── package.json
├── vite.config.ts
└── ...
```

## 5. Deployment Checklist

### Antes do Deploy:
- [ ] `npm run build` sem erros
- [ ] Pasta `dist` criada com sucesso
- [ ] `npm run preview` funciona
- [ ] Testou com `npm run preview` e inspecionou meta tags
- [ ] Verificou se as imagens têm tamanho correto (1200x630px)
- [ ] Todos os títulos < 60 caracteres
- [ ] Todas as descrições 120-160 caracteres

### Após o Deploy (dia 1):
- [ ] Site acessível em produção
- [ ] Testou no PageSpeed Insights
- [ ] Testou no Mobile-Friendly Test
- [ ] Testou Open Graph (Facebook)
- [ ] Testou Twitter Card

### Após o Deploy (semana 1):
- [ ] Registrou no Google Search Console
- [ ] Enviou sitemap.xml
- [ ] Verificou relatório de cobertura
- [ ] Verificou Core Web Vitals
- [ ] Checou se Google está indexando

### Após o Deploy (mês 1):
- [ ] Acompanhando métricas no Search Console
- [ ] Verificando posições das buscas
- [ ] Monitorando tráfego com Google Analytics
- [ ] Otimizando posts com melhor performance

## 6. Vercel Deploy (Se estiver usando)

### Fazer Deploy no Vercel
```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Faça login
vercel login

# 3. Deploy
vercel

# 4. Escolha as opções:
#    - Project name: axiosnews12
#    - Link existing: No
#    - Root directory: ./
#    - Build command: npm run build
#    - Output directory: dist
#    - Environment variables: None (pode deixar em branco)
```

### Após Deploy no Vercel
```
1. Você receberá uma URL: https://seu-projeto.vercel.app
2. Copie essa URL
3. Registre no Google Search Console
4. Teste em PageSpeed Insights
5. Teste Open Graph e Twitter Card
```

## 7. Seu Domínio Customizado

Se tiver um domínio (ex: axiosnews.com.br):

```
1. No dashboard Vercel
2. Vá para "Settings"
3. Clique em "Domains"
4. Adicione seu domínio
5. Siga as instruções de DNS
6. Aguarde propagação (até 24h)
```

## 8. Monitoração Contínua

### Google Search Console
```
Frequência ideal:
- Todos os dias: Verificar cliques/impressões
- 1x por semana: Revisar posições
- 1x por mês: Analisar tendências
```

### Métricas Importantes
```
✅ CTR (Click-Through Rate)
   - Ideal: > 3% no desktop, > 2% no mobile
   - Se baixo: Melhorar título/descrição

✅ Posição Média
   - Ideal: Top 10 (primeira página)
   - Se > 20: Precisa otimizar mais

✅ Impressões
   - Monitore o crescimento
   - Deve aumentar com o tempo
```

## 9. Problemas Comuns e Soluções

### Problema: "Meta tag não aparece"
```bash
✅ Solução:
1. npm run build
2. npm run preview
3. Ctrl+Shift+I > Elements
4. Procure em <head>
```

### Problema: "Google não está indexando"
```bash
✅ Solução:
1. Registre no Search Console
2. Envie sitemap.xml
3. Use "Inspecionar URL" no Search Console
4. Aguarde 7-14 dias para indexação
```

### Problema: "Imagem não aparece em compartilhamento"
```bash
✅ Solução:
1. Verifique og:image está com URL completa (http/https)
2. Verifique imagem tem 1200x630px mínimo
3. Use Open Graph Debugger para debugar
4. Pode tomar 24h para atualizar cache
```

### Problema: "Build falha com erro de tipos"
```bash
✅ Solução:
npm install --save-dev @types/react-helmet
npm run build
```

## 10. Checklist Final

```bash
# Executar todos em ordem
npm run build
npm run preview
# Teste manual no navegador

# Depois de fazer deploy:
# Teste em: https://pagespeed.web.dev/
# Teste em: https://search.google.com/test/mobile-friendly
# Teste em: https://developers.facebook.com/tools/debug/
# Teste em: https://cards-dev.twitter.com/validator

# Registre em:
# https://search.google.com/search-console
```

## 📊 Exemplo de Teste Real

### Testando PostagemDetalhes
```
1. Abra: https://seu-site.com/postagensgeral/123
2. Ctrl+Shift+I > Elements
3. Procure em <head> por:
   - <title> deve ter nome da postagem
   - <meta name="description"> deve ter descrição
   - <meta property="og:image"> deve ter imagem
   - <link rel="canonical"> deve estar lá
4. Se tudo correto, ✅ SEO está configurado!
```

## 🎯 Próximos Passos

1. **Hoje**: Teste com `npm run preview`
2. **Esta semana**: Deploy em produção
3. **Semana 1**: Registre no Google Search Console
4. **Mês 1**: Monitore métricas e otimize

---

**Dúvidas?** Todos os testes acima têm suporte oficial e documentação em seus sites!

Boa sorte com seu SEO! 🚀
