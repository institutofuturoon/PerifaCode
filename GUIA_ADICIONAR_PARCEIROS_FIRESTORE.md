# Guia: Adicionar Parceiros no Firestore

## Problema Identificado
A página `/apoiador/partner-001` não está funcionando porque o parceiro com ID `partner-001` não existe na coleção `partners` do Firestore.

## Solução: Adicionar Parceiros Manualmente no Firestore

### Passo 1: Acessar o Firebase Console
1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: **perifacode-fc132**
3. No menu lateral, clique em **Firestore Database**

### Passo 2: Criar a Coleção (se não existir)
1. Se a coleção `partners` não existir, clique em **"Start collection"**
2. Nome da coleção: `partners`
3. Clique em **Next**

### Passo 3: Adicionar Documento do Hostinger
Clique em **"Add document"** e preencha:

**Document ID:** `partner-001` (ou deixe auto-gerar)

**Campos:**
```
id: "partner-001"
name: "Hostinger"
description: "Parceiro estratégico em hospedagem web, fornecendo infraestrutura de alta performance para nossa plataforma e capacitando jovens em desenvolvimento web."
sector: "Tecnologia"
logoUrl: "https://logo.clearbit.com/hostinger.com.br"
websiteUrl: "https://www.hostinger.com.br"
since: "2024"
featured: true
impactDescription: "Graças ao apoio da Hostinger, conseguimos hospedar nossa plataforma com 100% de uptime, capacitar mais de 50 jovens em desenvolvimento web e criar oportunidades reais para quem mais precisa."
```

### Passo 4: Adicionar Outros Parceiros (Opcional)

#### SENAC
```
id: "partner-002"
name: "SENAC"
description: "Instituição de ensino profissionalizante que oferece cursos técnicos e de qualificação profissional."
sector: "Educação"
logoUrl: "https://logo.clearbit.com/senac.br"
websiteUrl: "https://www.senac.br"
since: "2023"
featured: false
```

#### SENAI
```
id: "partner-003"
name: "SENAI"
description: "Serviço Nacional de Aprendizagem Industrial, referência em educação profissional e tecnológica."
sector: "Educação"
logoUrl: "https://logo.clearbit.com/senai.br"
websiteUrl: "https://www.senai.br"
since: "2023"
featured: false
```

### Passo 5: Verificar
1. Após adicionar os documentos, volte para o site
2. Acesse: http://localhost:5173/apoiadores
3. Clique no card do Hostinger
4. Deve abrir a página de detalhes: `/apoiador/partner-001`

## Estrutura do Documento Partner

```typescript
interface Partner {
  id: string;                    // ID único do parceiro
  name: string;                  // Nome do parceiro
  description: string;           // Descrição breve
  sector: string;                // Setor (Tecnologia, Educação, etc)
  logoUrl: string;               // URL do logo
  websiteUrl: string;            // Site oficial
  since?: string;                // Ano de parceria
  featured?: boolean;            // Destacar na página
  impactDescription?: string;    // Descrição do impacto (opcional)
}
```

## Alternativa: Usar o Console do Navegador

Se preferir adicionar via código, você pode usar o console do navegador:

```javascript
// Abra o console (F12) e execute:
import { collection, addDoc } from 'firebase/firestore';
import { db } from './services/firebaseConfig';

const hostinger = {
  id: "partner-001",
  name: "Hostinger",
  description: "Parceiro estratégico em hospedagem web...",
  sector: "Tecnologia",
  logoUrl: "https://logo.clearbit.com/hostinger.com.br",
  websiteUrl: "https://www.hostinger.com.br",
  since: "2024",
  featured: true,
  impactDescription: "Graças ao apoio da Hostinger..."
};

await addDoc(collection(db, "partners"), hostinger);
```

## Dica: Importar em Massa

Se você tiver muitos parceiros, pode criar um script para importar:

1. Crie um arquivo `scripts/import-partners.js`
2. Use o Firebase Admin SDK
3. Importe de um arquivo JSON

## Verificar Parceiros Existentes

Para ver quais parceiros já existem:

1. Vá no Firestore Database
2. Abra a coleção `partners`
3. Veja todos os documentos listados

## Troubleshooting

### Erro "Parceiro não encontrado"
- Verifique se o ID do parceiro está correto
- Confirme que o documento existe no Firestore
- Verifique se o campo `id` dentro do documento corresponde ao Document ID

### Logo não aparece
- Verifique se a URL do logo está acessível
- Teste a URL diretamente no navegador
- Use serviços como Clearbit ou Brandfetch para logos

### Página em branco
- Abra o console do navegador (F12)
- Veja se há erros de permissão do Firestore
- Verifique as regras do Firestore

## Regras do Firestore

Certifique-se de que as regras permitem leitura pública:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /partners/{partnerId} {
      allow read: if true;  // Leitura pública
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Links Úteis

- **Firebase Console:** https://console.firebase.google.com/
- **Firestore Documentation:** https://firebase.google.com/docs/firestore
- **Clearbit Logo API:** https://clearbit.com/logo
