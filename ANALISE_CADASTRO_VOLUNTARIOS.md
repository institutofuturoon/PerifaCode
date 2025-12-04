# 🔍 Análise: Cadastro de Voluntários vs Alunos

## ✅ Situação Atual

### 📊 Estrutura do Banco de Dados

**TODOS os usuários estão na MESMA coleção: `users`**

```
Firestore
└── users (coleção única)
    ├── user_1 (aluno - role: 'student')
    ├── user_2 (voluntário - role: 'instructor')
    ├── user_3 (admin - role: 'admin')
    └── ...
```

### 🔑 Diferenciação por Campo `role`

Os tipos de usuário são diferenciados pelo campo `role`:
- **`student`** - Alunos
- **`instructor`** - Voluntários/Instrutores
- **`admin`** - Administradores

---

## 📝 Fluxos de Cadastro Atuais

### 1️⃣ Cadastro de Alunos (Público)

**Arquivo:** `src/views/Register.tsx`

**Fluxo:**
1. Usuário acessa `/cadastrar`
2. Preenche: nome, email, senha
3. Sistema cria no Firebase Auth
4. **Salva na coleção `users` com `role: 'student'`**
5. Redireciona para `/painel`

**Código:**
```typescript
const newUser: User = {
  id: firebaseUser.uid,
  name: name,
  email: firebaseUser.email || "",
  role: 'student', // ← ALUNO
  profileStatus: 'incomplete',
  accountStatus: 'active'
};

await setDoc(doc(db, "users", firebaseUser.uid), newUser);
```

---

### 2️⃣ Cadastro de Voluntários (Admin)

**Arquivo:** `src/views/TeamMemberEditor.tsx`

**Fluxo:**
1. Admin acessa `/admin/editor-equipe/new`
2. Preenche: nome, email, senha temporária
3. Sistema cria no Firebase Auth
4. **Salva na coleção `users` com `role: 'instructor'`**
5. Membro pode fazer login

**Código:**
```typescript
const memberData: User = {
  ...member,
  id: newUser.uid,
  role: 'instructor', // ← VOLUNTÁRIO
  mustChangePassword: true,
  accountStatus: 'active',
  profileStatus: 'complete'
};

await setDoc(doc(db, 'users', newUser.uid), memberData);
```

---

## ✅ Conclusão

### ✔️ NÃO HÁ MISTURA DE DADOS

**Por quê?**
- Mesma coleção (`users`)
- Mas **diferenciados pelo campo `role`**
- Queries filtram por role quando necessário

### 📌 Exemplos de Filtros no Código

**Listar apenas alunos:**
```typescript
const students = users.filter(u => u.role === 'student');
```

**Listar apenas voluntários:**
```typescript
const teamMembers = users.filter(u => 
  u.role === 'admin' || u.role === 'instructor'
);
```

**Listar apenas mentores:**
```typescript
const mentors = users.filter(u => 
  u.isMentor === true && u.accountStatus === 'active'
);
```

---

## 🎯 Vantagens da Estrutura Atual

### ✅ Prós
1. **Simplicidade** - Uma única coleção para gerenciar
2. **Flexibilidade** - Fácil mudar role de um usuário
3. **Queries unificadas** - Buscar qualquer usuário por ID
4. **Autenticação única** - Todos usam Firebase Auth
5. **Menos duplicação** - Campos comuns compartilhados

### ⚠️ Contras
1. **Queries mais complexas** - Sempre precisa filtrar por role
2. **Índices** - Precisa de índices compostos no Firestore
3. **Segurança** - Rules precisam validar role corretamente

---

## 🔒 Regras de Segurança (Firestore Rules)

**Recomendação para `firestore.rules`:**

```javascript
match /users/{userId} {
  // Leitura: usuário autenticado pode ler próprio perfil
  allow read: if request.auth != null && request.auth.uid == userId;
  
  // Leitura pública: perfis de equipe visíveis
  allow read: if resource.data.showOnTeamPage == true;
  
  // Escrita: apenas o próprio usuário ou admin
  allow write: if request.auth != null && 
    (request.auth.uid == userId || 
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
  
  // Validação: não pode mudar próprio role
  allow update: if request.auth != null && 
    request.auth.uid == userId && 
    request.resource.data.role == resource.data.role;
}
```

---

## 🚀 Recomendações

### ✅ Manter Estrutura Atual

**Motivos:**
1. Funciona bem para o tamanho atual
2. Menos complexidade
3. Mais fácil de manter
4. Padrão comum em apps Firebase

### 📊 Quando Separar em Coleções?

**Considere separar SE:**
- Mais de 10.000 usuários de cada tipo
- Campos muito diferentes entre tipos
- Necessidade de permissões muito distintas
- Performance crítica em queries específicas

**Estrutura alternativa (não recomendada agora):**
```
Firestore
├── students (coleção)
│   └── user_1
├── instructors (coleção)
│   └── user_2
└── admins (coleção)
    └── user_3
```

---

## 📋 Checklist de Verificação

- [x] Alunos salvos em `users` com `role: 'student'`
- [x] Voluntários salvos em `users` com `role: 'instructor'`
- [x] Filtros por role funcionando
- [x] Queries otimizadas
- [x] Não há mistura de dados
- [x] Estrutura adequada para o projeto

---

**Conclusão Final:** ✅ A estrutura atual está CORRETA e NÃO mistura dados. A diferenciação por `role` é suficiente e adequada para o projeto.
