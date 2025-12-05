# 🎁 Sistema de Gerenciamento de Apoiadores

## Visão Geral

Sistema completo para cadastrar apoiadores, registrar contribuições e criar páginas de agradecimento personalizadas.

## Funcionalidades

### ✅ Para Administradores

1. **Cadastrar Apoiadores**
   - Nome, categoria, logo, site
   - Mensagem de agradecimento personalizada
   - Marcar como destaque

2. **Registrar Apoios**
   - Tipo de apoio (ex: Doação de Alimentos, Doação Financeira)
   - Descrição detalhada
   - Valor (opcional)
   - Data do apoio

3. **Gerenciar Histórico**
   - Ver todos os apoios de um apoiador
   - Total contribuído automaticamente calculado
   - Editar ou remover apoios

### ✅ Para Visitantes

1. **Página de Agradecimento**
   - Logo e informações do apoiador
   - Mensagem especial de agradecimento
   - Histórico completo de apoios
   - Total contribuído

## Como Usar

### 1. Cadastrar um Novo Apoiador

1. Acesse o painel admin: `/admin`
2. Procure pela seção de Apoiadores
3. Clique em **"Novo Apoiador"** ou acesse: `/admin/editor-apoiador/new`
4. Preencha os dados:
   - **Nome:** Ex: Batata Crac
   - **Categoria:** Doador Individual, Empresa, Instituição ou Voluntário
   - **Mensagem de Agradecimento:** Texto especial de gratidão
   - **Logo:** URL da imagem (opcional)
   - **Site:** Link para site ou rede social (opcional)
   - **Apoiador desde:** Ano de início
   - **Destacar:** Marque para aparecer em destaque

### 2. Registrar um Apoio

Na mesma tela de edição do apoiador:

1. Role até **"Registro de Apoios"**
2. Preencha:
   - **Tipo de Apoio:** Ex: "Doação de Alimentos"
   - **Descrição:** Ex: "Doação de 50 pacotes de biscoitos para os lanches dos alunos durante o mês de dezembro"
   - **Valor (R$):** Opcional - preencha se for doação financeira
   - **Data:** Data do apoio
3. Clique em **"➕ Adicionar Apoio"**
4. Repita para adicionar mais apoios
5. Clique em **"Salvar Apoiador"**

### 3. Ver Página de Agradecimento

Após salvar, a página estará disponível em:
```
/apoio/{id-do-apoiador}
```

Exemplo: `/apoio/supporter_1234567890`

### 4. Compartilhar com o Apoiador

Copie o link da página e envie para o apoiador como forma de agradecimento!

## Exemplos de Uso

### Exemplo 1: Doação de Alimentos

```
Nome: Batata Crac
Categoria: Empresa
Mensagem: "A Batata Crac acredita no poder transformador da educação. É uma honra contribuir com lanches nutritivos para que os alunos possam se concentrar no aprendizado sem preocupações."

Apoio 1:
- Tipo: Doação de Alimentos
- Descrição: Doação de 50 pacotes de biscoitos para os lanches dos alunos durante o mês de dezembro
- Valor: R$ 250,00
- Data: 01/12/2024

Apoio 2:
- Tipo: Doação de Alimentos
- Descrição: Doação de 100 pacotes de biscoitos e 50 sucos para o evento de formatura
- Valor: R$ 450,00
- Data: 15/12/2024
```

### Exemplo 2: Doação Financeira

```
Nome: João Silva
Categoria: Doador Individual
Mensagem: "Acredito que todo jovem merece uma oportunidade de crescer através da tecnologia. Feliz em poder contribuir!"

Apoio 1:
- Tipo: Doação Financeira
- Descrição: Doação mensal via PIX para apoiar as atividades do instituto
- Valor: R$ 100,00
- Data: 01/11/2024

Apoio 2:
- Tipo: Doação Financeira
- Descrição: Doação mensal via PIX para apoiar as atividades do instituto
- Valor: R$ 100,00
- Data: 01/12/2024
```

### Exemplo 3: Apoio Voluntário

```
Nome: Maria Santos
Categoria: Voluntário
Mensagem: "Ensinar é minha paixão! Fico feliz em compartilhar meu conhecimento com jovens que querem mudar suas vidas através da tecnologia."

Apoio 1:
- Tipo: Aula Voluntária
- Descrição: Ministrou workshop de 4 horas sobre desenvolvimento web para turma de iniciantes
- Data: 10/11/2024

Apoio 2:
- Tipo: Mentoria
- Descrição: Sessões de mentoria individual com 5 alunos durante o mês
- Data: 30/11/2024
```

## Estrutura de Dados

### Supporter (Apoiador)
```typescript
{
  id: string;
  name: string;
  description: string; // Mensagem de agradecimento
  category: 'Doador Individual' | 'Empresa' | 'Instituição' | 'Voluntário';
  logoUrl?: string;
  websiteUrl?: string;
  since: string; // Ano
  featured?: boolean;
  contributions: SupporterContribution[];
  totalDonated: number; // Calculado automaticamente
}
```

### SupporterContribution (Apoio)
```typescript
{
  id: string;
  type: string; // Ex: "Doação de Alimentos"
  description: string;
  value?: number; // Valor em R$ (opcional)
  date: string; // YYYY-MM-DD
}
```

## Rotas

### Admin
- `/admin/editor-apoiador/new` - Criar novo apoiador
- `/admin/editor-apoiador/:supporterId` - Editar apoiador existente

### Público
- `/apoio/:supporterId` - Página de agradecimento do apoiador

## Firestore

### Coleção: `supporters`

Cada documento representa um apoiador com todos os seus apoios.

**Exemplo de documento:**
```json
{
  "id": "supporter_1733445678901",
  "name": "Batata Crac",
  "description": "A Batata Crac acredita no poder transformador da educação...",
  "category": "Empresa",
  "logoUrl": "https://example.com/logo.png",
  "websiteUrl": "https://batatacraque.com.br",
  "since": "2024",
  "featured": true,
  "totalDonated": 700,
  "contributions": [
    {
      "id": "contrib_1733445678902",
      "type": "Doação de Alimentos",
      "description": "Doação de 50 pacotes de biscoitos...",
      "value": 250,
      "date": "2024-12-01"
    },
    {
      "id": "contrib_1733445678903",
      "type": "Doação de Alimentos",
      "description": "Doação de 100 pacotes de biscoitos...",
      "value": 450,
      "date": "2024-12-15"
    }
  ]
}
```

## Dicas

### 📸 Logos
- Use logos em fundo transparente (PNG)
- Tamanho recomendado: 400x400px
- Serviços úteis:
  - https://clearbit.com/logo
  - https://brandfetch.com/

### 💬 Mensagens de Agradecimento
- Seja genuíno e específico
- Mencione o impacto do apoio
- Use tom caloroso e pessoal
- Exemplo: "Graças ao seu apoio, conseguimos..."

### 📊 Registro de Apoios
- Seja detalhado nas descrições
- Inclua quantidades quando possível
- Registre apoios não-financeiros também
- Mantenha o histórico atualizado

### 🎨 Categorias
- **Doador Individual:** Pessoas físicas
- **Empresa:** Empresas e negócios
- **Instituição:** ONGs, escolas, governo
- **Voluntário:** Pessoas que doam tempo/conhecimento

## Benefícios

### Para o Instituto
- ✅ Transparência nas doações
- ✅ Histórico organizado
- ✅ Facilita prestação de contas
- ✅ Reconhecimento público dos apoiadores

### Para os Apoiadores
- ✅ Página personalizada de agradecimento
- ✅ Visibilidade do impacto gerado
- ✅ Link compartilhável
- ✅ Reconhecimento público

## Próximos Passos

1. **Cadastre seus apoiadores atuais**
2. **Registre o histórico de apoios**
3. **Compartilhe as páginas com os apoiadores**
4. **Mantenha atualizado mensalmente**

## Suporte

Dúvidas? Entre em contato com a equipe de desenvolvimento.
