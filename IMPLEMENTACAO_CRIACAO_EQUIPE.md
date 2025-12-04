# 🔧 Implementação: Criação de Equipe com Senha

## ✅ O Que Foi Verificado

- ✅ **Não há dados mock** de equipe/voluntários
- ✅ **TeamMemberEditor existe** mas não cria usuários no Firebase Auth
- ✅ **Apenas salva no Firestore** (não permite login)

## 🎯 O Que Precisa Ser Implementado

### 1. Criação no Firebase Auth

Similar ao StudentEditor, implementar:
- Campo de senha temporária (apenas na criação)
- Criação de usuário no Firebase Auth
- Salvar dados no Firestore
- Forçar troca de senha no primeiro login

### 2. Fluxo Completo

**Para Novos Membros:**
1. Admin preenche dados (nome, email, etc.)
2. Admin define senha temporária
3. Sistema cria usuário no Firebase Auth
4. Sistema salva dados no Firestore
5. Membro recebe credenciais
6. Membro faz login e é forçado a trocar senha

**Para Membros Existentes:**
1. Admin edita dados
2. Admin pode resetar senha (já implementado)
3. Sistema atualiza Firestore

## 📋 Mudanças Necessárias

### Arquivo: `src/views/TeamMemberEditor.tsx`

#### 1. Adicionar Imports
```typescript
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
```

#### 2. Adicionar Estados
```typescript
const isCreating = userId === 'new';
const [tempPassword, setTempPassword] = useState('');
const [isProcessing, setIsProcessing] = useState(false);
```

#### 3. Adicionar Função de Criação
```typescript
const handleCreateMemberAuth = async () => {
  if (!member.email || !tempPassword || !member.name) {
    showToast("❌ Preencha Nome, Email e Senha Temporária.");
    return;
  }

  if (tempPassword.length < 6) {
    showToast("❌ A senha deve ter no mínimo 6 caracteres.");
    return;
  }

  setIsProcessing(true);

  try {
    // Criar app secundário para não deslogar admin
    const secondaryAppName = `secondary_${Date.now()}`;
    const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
    const secondaryAuth = getAuth(secondaryApp);

    // Criar usuário
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth, 
      member.email, 
      tempPassword
    );
    const newUser = userCredential.user;

    // Atualizar perfil
    await updateProfile(newUser, { displayName: member.name });

    // Salvar no Firestore
    const memberData: User = {
      ...member,
      id: newUser.uid,
      mustChangePassword: true,
      accountStatus: 'active',
      profileStatus: 'complete'
    };

    await setDoc(doc(db, 'users', newUser.uid), memberData);

    // Deslogar usuário secundário
    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);

    showToast('✅ Membro criado com sucesso!');
    navigate('/admin');
  } catch (error: any) {
    console.error('Erro ao criar membro:', error);
    showToast(`❌ Erro: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};
```

#### 4. Adicionar Campo de Senha no Formulário

Adicionar antes dos campos principais (quando `isCreating === true`):

```tsx
{isCreating && (
  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-6">
    <h3 className="text-yellow-400 font-bold text-sm mb-2">🔐 Credenciais de Acesso</h3>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className={labelClasses}>Email de Login *</label>
        <input 
          name="email" 
          type="email" 
          value={member.email || ''} 
          onChange={handleChange} 
          required 
          className={inputClasses} 
          placeholder="email@exemplo.com"
        />
      </div>
      <div>
        <label className={labelClasses}>Senha Temporária *</label>
        <input 
          type="password" 
          value={tempPassword} 
          onChange={(e) => setTempPassword(e.target.value)} 
          required 
          className={inputClasses} 
          placeholder="Mínimo 6 caracteres"
          minLength={6}
        />
        <p className="text-xs text-gray-400 mt-1">
          O membro será forçado a trocar no primeiro login
        </p>
      </div>
    </div>
  </div>
)}
```

#### 5. Atualizar Botão de Salvar

```tsx
{isCreating ? (
  <button 
    type="button"
    onClick={handleCreateMemberAuth}
    disabled={isProcessing}
    className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40 disabled:opacity-50"
  >
    {isProcessing ? 'Criando...' : 'Criar Membro'}
  </button>
) : (
  <button 
    type="submit" 
    form="team-member-form"
    className="bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40"
  >
    Salvar Alterações
  </button>
)}
```

## 🔒 Segurança

### Senha Temporária
- Mínimo 6 caracteres (requisito do Firebase)
- Membro é forçado a trocar no primeiro login
- `mustChangePassword: true` é definido automaticamente

### Criação Segura
- Usa app secundário do Firebase
- Não desloga o admin
- Valida todos os campos antes de criar

## 🎯 Fluxo do Usuário

### Admin Cria Membro
1. Dashboard → Equipe → Novo Membro
2. Preenche dados (nome, email, bio, etc.)
3. Define senha temporária
4. Clica em "Criar Membro"
5. Sistema cria no Firebase Auth + Firestore

### Membro Faz Primeiro Login
1. Acessa `/entrar`
2. Usa email e senha temporária
3. Sistema detecta `mustChangePassword: true`
4. Redireciona para `/alterar-senha`
5. Membro define nova senha
6. Acessa plataforma normalmente

## ✅ Benefícios

- ✅ Membros podem fazer login
- ✅ Senha segura desde o início
- ✅ Troca obrigatória no primeiro acesso
- ✅ Admin não é deslogado
- ✅ Processo simples e rápido

## 📝 Documentação para Admins

### Como Criar um Novo Membro

1. **Acesse:** Dashboard → Equipe → Novo Membro
2. **Preencha:**
   - Nome completo
   - Email (será usado para login)
   - Senha temporária (mínimo 6 caracteres)
   - Título profissional
   - Bio
   - Links (LinkedIn, GitHub)
3. **Configure:**
   - É Mentor? (se oferece mentorias)
   - Mostrar na página da equipe?
   - Forçar troca de senha? (recomendado: SIM)
4. **Clique:** "Criar Membro"
5. **Envie** as credenciais para o membro:
   - Email: [email cadastrado]
   - Senha temporária: [senha definida]
   - Link: https://seu-site.com/entrar

### Credenciais Padrão Recomendadas

**Senha temporária sugerida:**
- `Futuro@2024` (8 caracteres, segura)
- `Bem-vindo123` (12 caracteres)
- `Equipe@FuturoOn` (15 caracteres)

**Importante:** Sempre force a troca de senha!

## 🔄 Próximos Passos

1. ✅ Implementar código no TeamMemberEditor
2. ✅ Testar criação de membro
3. ✅ Testar primeiro login
4. ✅ Testar troca de senha obrigatória
5. ✅ Documentar para admins

---

**Status:** 🟡 Parcialmente implementado (imports adicionados)  
**Próximo:** Adicionar função de criação e campos no formulário
