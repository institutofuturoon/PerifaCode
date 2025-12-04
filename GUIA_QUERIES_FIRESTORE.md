# 🔍 Guia: Queries no Firestore (SELECT)

## 📋 Métodos Disponíveis

### 1️⃣ Firebase Console (Interface Gráfica)

**Acesso:** https://console.firebase.google.com

**Como usar:**
1. Selecione seu projeto
2. Vá em "Firestore Database"
3. Navegue pelas coleções
4. Visualize e edite documentos

**Prós:**
- ✅ Interface visual
- ✅ Fácil de usar
- ✅ Edição inline

**Contras:**
- ❌ Sem queries complexas
- ❌ Navegação manual
- ❌ Não tem SQL

---

### 2️⃣ Script Node.js Interativo (Recomendado)

**Arquivo:** `scripts/query-firestore.js`

#### Instalação

```bash
# Instalar dependências
npm install firebase-admin dotenv

# Configurar credenciais no .env.local
FIREBASE_CLIENT_EMAIL=seu-email@projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### Uso

```bash
node scripts/query-firestore.js
```

#### Queries Disponíveis

**1. Todos os alunos**
```sql
SELECT * FROM users WHERE role = "student"
```

**2. Voluntários e admins**
```sql
SELECT * FROM users WHERE role IN ("instructor", "admin")
```

**3. Usuários inativos**
```sql
SELECT * FROM users WHERE accountStatus = "inactive"
```

**4. Apenas mentores**
```sql
SELECT * FROM users WHERE isMentor = true
```

**5. Alunos com mais de 1000 XP**
```sql
SELECT * FROM users WHERE xp > 1000 ORDER BY xp DESC
```

**6. Primeiros 10 usuários**
```sql
SELECT name, email FROM users ORDER BY name LIMIT 10
```

**7. Contar por role**
```sql
SELECT COUNT(*) FROM users GROUP BY role
```

**8. Emails Gmail**
```sql
SELECT * FROM users WHERE email LIKE "%@gmail.com"
```

**9. Todos os cursos**
```sql
SELECT * FROM courses
```

**10. Artigos publicados**
```sql
SELECT * FROM articles WHERE status = "published"
```

**11. Query customizada**
- Digite sua própria query interativamente

---

### 3️⃣ Script Direto (Busca Rápida)

**Arquivo:** `scripts/buscar-firestore.js`

```bash
# Listar voluntários
node scripts/buscar-firestore.js voluntarios

# Listar alunos
node scripts/buscar-firestore.js alunos

# Buscar por email
node scripts/buscar-firestore.js email joao@exemplo.com

# Ver estatísticas
node scripts/buscar-firestore.js todos
```

---

## 📊 Exemplos de Saída

### Query: Todos os alunos

```
📊 Resultados:

name                 | email                | accountStatus        | xp                  
-------------------------------------------------------------------------------------
João Silva           | joao@gmail.com       | active               | 1500                
Maria Santos         | maria@gmail.com      | active               | 850                 
Pedro Costa          | pedro@gmail.com      | inactive             | 200                 

✅ Total: 3 registros
```

### Query: Contar por role

```
📊 Contagem por Role:

   student         : 140
   instructor      : 8
   admin           : 2
```

---

## 🔧 Operadores Disponíveis

### Comparação
- `==` - Igual
- `!=` - Diferente
- `>` - Maior que
- `>=` - Maior ou igual
- `<` - Menor que
- `<=` - Menor ou igual

### Arrays
- `in` - Está em (array de valores)
- `not-in` - Não está em
- `array-contains` - Array contém valor
- `array-contains-any` - Array contém qualquer valor

### Exemplos

```javascript
// Igual
.where('role', '==', 'student')

// Maior que
.where('xp', '>', 1000)

// In (múltiplos valores)
.where('role', 'in', ['instructor', 'admin'])

// Array contém
.where('completedLessonIds', 'array-contains', 'lesson_123')
```

---

## 🎯 Queries Úteis para Seu Projeto

### 1. Listar todos os voluntários ativos

```javascript
const snapshot = await db.collection('users')
  .where('role', 'in', ['instructor', 'admin'])
  .where('accountStatus', '==', 'active')
  .get();
```

### 2. Mentores disponíveis

```javascript
const snapshot = await db.collection('users')
  .where('isMentor', '==', true)
  .where('accountStatus', '==', 'active')
  .get();
```

### 3. Alunos que completaram aulas

```javascript
const snapshot = await db.collection('users')
  .where('role', '==', 'student')
  .where('completedLessonIds', '!=', [])
  .get();
```

### 4. Top 10 alunos por XP

```javascript
const snapshot = await db.collection('users')
  .where('role', '==', 'student')
  .orderBy('xp', 'desc')
  .limit(10)
  .get();
```

### 5. Cursos de um track específico

```javascript
const snapshot = await db.collection('courses')
  .where('track', '==', 'Frontend')
  .where('status', '==', 'published')
  .get();
```

### 6. Artigos de um autor

```javascript
const snapshot = await db.collection('articles')
  .where('authorId', '==', 'USER_ID')
  .orderBy('publishedAt', 'desc')
  .get();
```

---

## ⚠️ Limitações do Firestore

### 1. Não suporta OR complexo

**❌ Não funciona:**
```javascript
// Não pode fazer: role == 'student' OR role == 'instructor'
```

**✅ Solução:**
```javascript
// Use 'in'
.where('role', 'in', ['student', 'instructor'])
```

### 2. Apenas um campo de range por query

**❌ Não funciona:**
```javascript
.where('xp', '>', 100)
.where('age', '<', 30) // Erro!
```

**✅ Solução:**
```javascript
// Filtre um no código
const snapshot = await db.collection('users')
  .where('xp', '>', 100)
  .get();

const filtered = snapshot.docs.filter(doc => doc.data().age < 30);
```

### 3. LIKE não existe

**❌ Não funciona:**
```sql
WHERE email LIKE '%@gmail.com'
```

**✅ Solução:**
```javascript
// Busque todos e filtre no código
const snapshot = await db.collection('users').get();
const gmailUsers = snapshot.docs.filter(doc => 
  doc.data().email?.endsWith('@gmail.com')
);
```

### 4. JOIN não existe

**❌ Não funciona:**
```sql
SELECT * FROM users JOIN courses ON ...
```

**✅ Solução:**
```javascript
// Faça queries separadas
const user = await db.collection('users').doc(userId).get();
const courses = await db.collection('courses')
  .where('instructorId', '==', userId)
  .get();
```

---

## 🚀 Queries Avançadas

### Paginação

```javascript
// Primeira página
const first = await db.collection('users')
  .orderBy('name')
  .limit(10)
  .get();

// Próxima página
const lastDoc = first.docs[first.docs.length - 1];
const next = await db.collection('users')
  .orderBy('name')
  .startAfter(lastDoc)
  .limit(10)
  .get();
```

### Agregação (Count)

```javascript
// Firestore não tem COUNT direto
const snapshot = await db.collection('users')
  .where('role', '==', 'student')
  .get();

const count = snapshot.size;
```

### Subcoleções

```javascript
// Buscar em subcoleção
const snapshot = await db.collection('users')
  .doc(userId)
  .collection('notes')
  .where('lessonId', '==', 'lesson_123')
  .get();
```

---

## 📚 Recursos Adicionais

### Firebase Admin SDK Docs
https://firebase.google.com/docs/firestore/query-data/queries

### Firestore Query Cheat Sheet
- `get()` - Busca uma vez
- `onSnapshot()` - Escuta mudanças em tempo real
- `where()` - Filtro
- `orderBy()` - Ordenação
- `limit()` - Limitar resultados
- `startAt()` / `endAt()` - Paginação

---

## 🆘 Troubleshooting

### Erro: "The query requires an index"

**Causa:** Query complexa precisa de índice

**Solução:**
1. Copie o link do erro
2. Abra no navegador
3. Firebase cria o índice automaticamente
4. Aguarde 1-2 minutos
5. Tente novamente

### Erro: "Missing or insufficient permissions"

**Causa:** Regras do Firestore bloqueando

**Solução:**
- Use Firebase Admin SDK (ignora regras)
- Ou ajuste `firestore.rules`

### Erro: "Cannot have inequality filters on multiple properties"

**Causa:** Firestore limita range queries

**Solução:**
- Use apenas um campo com `>`, `<`, etc
- Filtre outros campos no código

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Versão:** 1.0
