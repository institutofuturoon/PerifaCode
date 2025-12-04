# 📘 Guia: Como Usar a Postagem Mock

## 🎯 Passo a Passo Completo

### Método 1: Criar Pelo Dashboard (Recomendado)

#### 1️⃣ Acesse o Dashboard
```
1. Abra o navegador
2. Vá para: http://localhost:5173 (ou seu domínio)
3. Faça login como administrador
4. Clique em "Dashboard" no menu
```

#### 2️⃣ Crie um Novo Artigo
```
1. No Dashboard, procure a seção "Artigos"
2. Clique no botão "+ Novo Artigo" ou "Criar Artigo"
3. Você será redirecionado para o editor de artigos
```

#### 3️⃣ Preencha os Campos Básicos

**Título:**
```
Da Periferia para o Mercado Tech: Como Maria Conquistou sua Primeira Vaga como Dev
```

**Slug (URL amigável):**
```
da-periferia-para-mercado-tech-historia-maria-silva
```

**Resumo/Descrição:**
```
Conheça a inspiradora jornada de Maria Silva, que saiu do Complexo da Coruja e hoje trabalha como desenvolvedora front-end em uma startup de tecnologia. Uma história de superação, dedicação e transformação através da educação.
```

**Categoria:**
```
Histórias
```
*Se não existir, crie a categoria "Histórias"*

**Tags:**
```
sucesso, aluna, front-end, transformação, mercado-tech, periferia
```
*Separe por vírgula*

**Data:**
```
04/12/2024
```
*Ou a data atual*

**Status:**
```
published
```
*Importante: Deve ser "published" para aparecer no blog*

#### 4️⃣ Adicione a Imagem

**Opção A - URL de Imagem:**
```
https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=630&fit=crop
```

**Opção B - Buscar Imagem Grátis:**
1. Acesse: https://unsplash.com
2. Busque: "woman developer" ou "black woman coding"
3. Baixe uma imagem
4. Faça upload no seu sistema
5. Cole a URL

**Opção C - Usar Placeholder:**
```
https://via.placeholder.com/1200x630/8a4add/ffffff?text=Historia+de+Maria
```

#### 5️⃣ Cole o Conteúdo HTML

1. Abra o arquivo `POSTAGEM_MOCK_EXEMPLO.md`
2. Localize a seção "Conteúdo Completo (HTML)"
3. Copie TODO o código HTML (da linha `<div class="article-content">` até `</div>`)
4. Cole no campo "Conteúdo" do editor

**⚠️ IMPORTANTE:** 
- Se o editor tiver modo "Visual" e "HTML", mude para modo "HTML"
- Cole o código exatamente como está
- Não remova as tags HTML

#### 6️⃣ Salve e Publique

```
1. Revise todos os campos
2. Certifique-se que "Status" está como "published"
3. Clique em "Salvar" ou "Publicar"
4. Aguarde a confirmação
```

#### 7️⃣ Verifique no Blog

```
1. Vá para: /blog
2. A postagem deve aparecer como destaque (se for a mais recente)
3. Clique para abrir e ver o resultado
```

---

### Método 2: Criar Diretamente no Firestore

Se preferir criar diretamente no banco de dados:

#### 1️⃣ Acesse o Firebase Console
```
1. Vá para: https://console.firebase.google.com
2. Selecione seu projeto
3. Clique em "Firestore Database" no menu lateral
```

#### 2️⃣ Adicione um Novo Documento

```
1. Navegue até a coleção "articles"
2. Clique em "Adicionar documento"
3. Deixe o ID ser gerado automaticamente (ou crie um personalizado)
```

#### 3️⃣ Preencha os Campos

Cole este JSON (ajuste conforme necessário):

```json
{
  "title": "Da Periferia para o Mercado Tech: Como Maria Conquistou sua Primeira Vaga como Dev",
  "slug": "da-periferia-para-mercado-tech-historia-maria-silva",
  "summary": "Conheça a inspiradora jornada de Maria Silva, que saiu do Complexo da Coruja e hoje trabalha como desenvolvedora front-end em uma startup de tecnologia. Uma história de superação, dedicação e transformação através da educação.",
  "content": "[COLE O HTML AQUI - VER ABAIXO]",
  "imageUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=630&fit=crop",
  "category": "Histórias",
  "tags": ["sucesso", "aluna", "front-end", "transformação", "mercado-tech", "periferia"],
  "status": "published",
  "date": "04/12/2024",
  "authorId": "SEU_USER_ID_AQUI",
  "authorName": "Equipe FuturoOn",
  "claps": 0,
  "readingTime": 6,
  "featured": true,
  "views": 0
}
```

**Para o campo "content":**
1. Abra `POSTAGEM_MOCK_EXEMPLO.md`
2. Copie TODO o HTML da seção "Conteúdo Completo"
3. Cole no campo "content" do JSON
4. Certifique-se de escapar aspas se necessário

#### 4️⃣ Salve o Documento

```
1. Clique em "Salvar"
2. Aguarde a confirmação
3. Recarregue a página do blog
```

---

### Método 3: Importar via Script (Avançado)

Se você tem acesso ao código e quer automatizar:

#### 1️⃣ Crie um Script de Importação

Crie o arquivo `scripts/importMockPost.js`:

```javascript
import { db } from '../src/services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const mockPost = {
  title: "Da Periferia para o Mercado Tech: Como Maria Conquistou sua Primeira Vaga como Dev",
  slug: "da-periferia-para-mercado-tech-historia-maria-silva",
  summary: "Conheça a inspiradora jornada de Maria Silva...",
  content: `[COLE O HTML AQUI]`,
  imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=630&fit=crop",
  category: "Histórias",
  tags: ["sucesso", "aluna", "front-end", "transformação", "mercado-tech", "periferia"],
  status: "published",
  date: "04/12/2024",
  authorId: "admin",
  authorName: "Equipe FuturoOn",
  claps: 0,
  readingTime: 6,
  featured: true,
  views: 0
};

async function importPost() {
  try {
    const docRef = await addDoc(collection(db, 'articles'), mockPost);
    console.log('✅ Postagem criada com ID:', docRef.id);
  } catch (error) {
    console.error('❌ Erro ao criar postagem:', error);
  }
}

importPost();
```

#### 2️⃣ Execute o Script

```bash
node scripts/importMockPost.js
```

---

## 🎨 Personalizando a Postagem

### Trocar o Nome e Detalhes

No HTML, faça busca e substituição (Ctrl+H):

**Buscar:** `Maria Silva`  
**Substituir:** `[Nome da Pessoa]`

**Buscar:** `Complexo da Coruja`  
**Substituir:** `[Nome do Bairro]`

**Buscar:** `desenvolvedora front-end`  
**Substituir:** `[Cargo Conquistado]`

### Ajustar Estatísticas

Localize no HTML:

```html
<div class="stats-grid">
  <div class="stat">
    <span class="number">150+</span>
    <span class="label">Alunos Formados</span>
  </div>
  <!-- Ajuste os números conforme seus dados reais -->
</div>
```

### Trocar Imagens

1. Substitua a URL no campo `imageUrl`
2. Certifique-se que a imagem tem dimensões adequadas (1200x630px ideal)
3. Use imagens de alta qualidade

---

## ✅ Checklist de Verificação

Antes de publicar, verifique:

- [ ] Título está correto e atrativo
- [ ] Slug está em formato URL amigável (sem espaços, acentos)
- [ ] Resumo está completo e interessante
- [ ] Categoria está selecionada
- [ ] Tags estão adicionadas (mínimo 3)
- [ ] Imagem está carregando corretamente
- [ ] Conteúdo HTML está completo
- [ ] Status está como "published"
- [ ] Data está correta
- [ ] Autor está definido
- [ ] Testou abrir a postagem no blog

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Postagem não aparece no blog

**Causa:** Status não está como "published"

**Solução:**
1. Edite o artigo
2. Mude status para "published"
3. Salve novamente

---

### Problema 2: HTML aparece como texto

**Causa:** Editor está em modo "texto" ao invés de "HTML"

**Solução:**
1. Procure botão "HTML" ou "Código" no editor
2. Mude para modo HTML
3. Cole o código novamente

---

### Problema 3: Imagem não carrega

**Causa:** URL inválida ou bloqueada

**Solução:**
1. Teste a URL no navegador
2. Use uma imagem hospedada em serviço confiável
3. Ou faça upload da imagem no seu servidor

---

### Problema 4: Formatação quebrada

**Causa:** CSS não está sendo aplicado

**Solução:**
1. Verifique se o ArticleView.tsx renderiza HTML corretamente
2. Adicione o CSS sugerido no arquivo de estilos global
3. Ou use classes Tailwind equivalentes

---

## 🎯 Próximos Passos

Após publicar a postagem mock:

1. **Teste no Mobile** - Veja como fica em diferentes dispositivos
2. **Compartilhe** - Teste os links de compartilhamento social
3. **Monitore** - Acompanhe visualizações e engajamento
4. **Crie Variações** - Use o template para outras histórias
5. **Colete Feedback** - Pergunte aos usuários o que acharam

---

## 📊 Métricas para Acompanhar

Após publicar, monitore:

- **Visualizações:** Quantas pessoas leram
- **Tempo de leitura:** Quanto tempo ficaram na página
- **Claps/Curtidas:** Engajamento direto
- **Compartilhamentos:** Alcance nas redes sociais
- **Comentários:** Feedback e discussões
- **Taxa de conversão:** Quantos se inscreveram após ler

---

## 💡 Dicas Extras

### Para Melhor Engajamento:

1. **Publique em horários estratégicos** (terça a quinta, 10h-14h)
2. **Compartilhe nas redes sociais** logo após publicar
3. **Envie por email** para a lista de contatos
4. **Fixe no topo** do blog por alguns dias
5. **Crie posts relacionados** para manter o tema vivo

### Para SEO:

1. Use palavras-chave no título e resumo
2. Adicione alt text nas imagens
3. Crie links internos para outros artigos
4. Compartilhe em múltiplas plataformas
5. Atualize periodicamente com novos dados

---

## 🆘 Precisa de Ajuda?

Se tiver dúvidas ou problemas:

1. **Revise este guia** - A resposta pode estar aqui
2. **Verifique o console** - Erros aparecem no console do navegador (F12)
3. **Teste em modo incógnito** - Elimina problemas de cache
4. **Consulte a documentação** - Veja `DOCUMENTACAO_API.md`

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Versão:** 1.0
