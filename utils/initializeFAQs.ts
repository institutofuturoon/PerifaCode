/**
 * Inicializar FAQs de exemplo para os cursos
 * Execute uma única vez para popular o banco com dados de teste
 */

import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { FAQ } from '../types';

type FAQInput = Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>;

export const EXAMPLE_FAQS: FAQInput[] = [
  // ===== TÉCNICAS (Desenvolvimento) =====
  {
    courseId: 'python-101' as const,
    category: 'tecnico' as const,
    keywords: ['python', 'comparação', '==', 'is', 'diferença'],
    question: 'Qual é a diferença entre == e is em Python?',
    answer: `Em Python existem duas formas de comparar valores:

**== (comparação de valor)**
- Compara o VALOR das variáveis
- Exemplo: '5 == 5.0' retorna True (mesmos valores)

**is (comparação de identidade)**
- Compara se são o MESMO OBJETO em memória
- Exemplo: '[1,2,3] is [1,2,3]' retorna False (objetos diferentes)

💡 **Dica**: Use '==' para comparar valores normalmente. Use 'is' apenas para None, True, False.

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True (mesmo conteúdo)
print(a is b)  # False (objetos diferentes)
\`\`\``,
    effectiveness: 85,
    usageCount: 0,
  },

  {
    courseId: 'python-101',
    category: 'tecnico',
    question: 'Como debugar um erro TypeError em Python?',
    answer: `TypeError é quando você tenta usar um tipo de dado de forma incorreta.

**Passo 1: Leia a mensagem de erro**
A mensagem diz exatamente o que está errado. Ex: "unsupported operand type(s) for +: 'int' and 'str'"

**Passo 2: Identifique a linha**
Python mostra qual linha causou o erro (última linha do traceback)

**Passo 3: Verifique os tipos**
Use \`print(type(variavel))\` para ver o tipo de cada variável

**Exemplo:**
\`\`\`python
# ERRO
numero = "5"
resultado = numero + 10  # TypeError!

# SOLUÇÃO
numero = 5  # ou numero = int("5")
resultado = numero + 10  # Funciona!
\`\`\`

💡 Dica: Se vem de input(), converta com int() ou float()`,
    keywords: ['erro', 'TypeError', 'debug', 'python', 'tipo'],
    effectiveness: 80,
    usageCount: 0,
  },

  {
    courseId: 'javascript-basics',
    category: 'tecnico',
    question: 'Qual a diferença entre var, let e const em JavaScript?',
    answer: `Em JavaScript existem 3 formas de declarar variáveis com comportamentos diferentes:

**var** (Legado - evitar usar)
- Escopo global ou de função
- Pode ser redeclarada
- Hoisting: sim, mas com valor undefined

**let** (Moderno - use isso!)
- Escopo de bloco {}
- NÃO pode ser redeclarada
- Hoisting: sim, mas com erro se acessada antes

**const** (Recomendado por padrão!)
- Escopo de bloco {}
- NÃO pode ser redeclarada
- NÃO pode ser reatribuída (protege contra mudanças acidentais)

**Tabela de comparação:**
| | var | let | const |
|------|-----|-----|-------|
| Escopo | global/função | bloco | bloco |
| Redeclaração | ✅ sim | ❌ não | ❌ não |
| Reatribuição | ✅ sim | ✅ sim | ❌ não |

💡 **Padrão**: Use \`const\` por padrão, \`let\` quando precisa mudar valor, evite \`var\``,
    keywords: ['javascript', 'var', 'let', 'const', 'diferença', 'variáveis'],
    effectiveness: 90,
    usageCount: 0,
  },

  // ===== ADMINISTRATIVAS =====
  {
    courseId: 'python-101',
    category: 'administrativo',
    question: 'Qual é o prazo para completar o curso?',
    answer: `Bom pergunta! Não há prazo rígido para completar este curso. 

**Recomendações:**
- **Tempo sugerido**: 4-6 semanas (estudando 5-7 horas/semana)
- **Mínimo**: Você pode andar no seu ritmo
- **Máximo**: Recomendamos completar em até 3 meses

**Dicas para manter consistência:**
✅ Estude em horários fixos (ex: segunda à sexta 19h-20h)
✅ Faça uma aula por dia
✅ Deixe os finais de semana para revisar
✅ Use o mentorado se ficar preso

Seu mentor está aqui para ajudar! 👤`,
    keywords: ['prazo', 'tempo', 'quanto leva', 'duração', 'completar'],
    effectiveness: 75,
    usageCount: 0,
  },

  {
    courseId: 'python-101',
    category: 'administrativo',
    question: 'O curso é totalmente online ou presencial?',
    answer: `Este curso é **totalmente online** e foi projetado para ser flexível! 🌐

**Como funciona:**
✅ Acesse de qualquer lugar com internet
✅ Assista às aulas no seu ritmo
✅ Faça os exercícios quando quiser
✅ Chat 24/7 com o Tutor IA
✅ Mentor disponível para dúvidas

**Requisitos:**
- Internet estável (não precisa ser rápida)
- Computador, tablet ou smartphone
- 1-2 horas por dia para estudar

Oferecemos também sessões presenciais OPCIONAIS em certos períodos para:
- Networking com outros alunos
- Ajuda prática de um instrutor
- Projetos em grupo

Pergunta? [Fale com mentor] 👤`,
    keywords: ['online', 'presencial', 'híbrido', 'lugar', 'modalidade'],
    effectiveness: 85,
    usageCount: 0,
  },

  // ===== MOTIVACIONAIS =====
  {
    courseId: 'python-101',
    category: 'motivacional',
    question: 'Será que consigo completar este curso? Tô achando muito difícil...',
    answer: `Você está nos pensamentos certos agora! Vou ser honesto:

**Você CONSEGUE! Aqui está o porquê:**

1️⃣ **Você já começou** - Essa é a parte mais difícil! 🎯

2️⃣ **A dificuldade que você sente = aprendizado real**
   - Seu cérebro está fazendo novas conexões
   - Isso é sinal de que você está crescendo!

3️⃣ **Alunos como você (iniciantes) completam com sucesso todos os dias**
   - Muitos começaram do zero como você
   - Agora trabalham como programadores

4️⃣ **Você não está sozinho**
   - Mentor disponível 24/7
   - Chat com IA responde dúvidas AGORA
   - Comunidade de alunos como você

**Próximos passos:**
✅ Tire 1 dia de pausa se precisar (está ok!)
✅ Faça apenas UMA aula/dia (sem pressão)
✅ Escreva seus objetivos: por que você quer aprender isso?
✅ Convide um colega para estudar junto (mais legal!)

**Você vai conseguir! 💪**

Quer conversar mais? [Chat com seu mentor]`,
    keywords: ['difícil', 'consigo', 'desanimar', 'desistir', 'motivação', 'medo'],
    effectiveness: 95,
    usageCount: 0,
  },

  // ===== JAVASCRIPT =====
  {
    courseId: 'javascript-basics',
    category: 'tecnico',
    question: 'Como fazer uma requisição HTTP em JavaScript?',
    answer: `Para fazer requisições HTTP em JavaScript, use \`fetch()\`:

**GET (ler dados):**
\`\`\`javascript
fetch('https://api.exemplo.com/dados')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));
\`\`\`

**POST (enviar dados):**
\`\`\`javascript
fetch('https://api.exemplo.com/dados', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Maria', idade: 25 })
})
  .then(response => response.json())
  .then(data => console.log('Sucesso!', data));
\`\`\`

**Com async/await (mais moderno):**
\`\`\`javascript
async function buscarDados() {
  try {
    const response = await fetch('https://api.exemplo.com/dados');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Erro:', error);
  }
}
\`\`\`

💡 Dica: Sempre trate erros com .catch() ou try/catch!`,
    keywords: ['fetch', 'http', 'requisição', 'api', 'dados', 'javascript'],
    effectiveness: 88,
    usageCount: 0,
  },

  {
    courseId: 'javascript-basics',
    category: 'motivacional',
    question: 'JavaScript é fácil de aprender?',
    answer: `Sim! JavaScript é uma das linguagens **mais fáceis de começar**:

**Por que é fácil:**
✅ Roda no navegador (vê resultado AGORA)
✅ Sintaxe amigável (bem legível)
✅ Comunidade ENORME (muita ajuda online)
✅ Uso imediato (website, apps)

**Mas verdade importante:**
- FÁCIL começar ≠ FÁCIL dominar
- Os primeiros 30% levam 10% do tempo
- Depois fica mais profundo, mas você já terá impulso!

**Sua jornada típica:**
Semana 1-2: "Isso é mágica!" ✨ (variáveis, funções)
Semana 3-4: "Hmm, ficou complexo" 🤔 (callbacks, promises)
Semana 5+: "Entendi! Agora consigo!" 🎯 (padrões fazem sentido)

**Você está exatamente aonde deveria estar agora!**

Continue! Cada exercício = 1 passo mais perto de dominar JS 🚀`,
    keywords: ['javascript', 'fácil', 'difícil', 'aprender', 'conseguir'],
    effectiveness: 92,
    usageCount: 0,
  },
];

/**
 * Inicializar FAQs no Firestore
 * CUIDADO: Executa uma única vez!
 */
export async function initializeFAQsIfNeeded(): Promise<void> {
  try {
    const faqsSnap = await getDocs(collection(db, 'faqBase'));

    // Se já existem FAQs, não faz nada
    if (faqsSnap.size > 0) {
      console.log('✅ FAQs já foram inicializadas. Total:', faqsSnap.size);
      return;
    }

    console.log('📝 Inicializando FAQs de exemplo...');

    let count = 0;
    for (const faq of EXAMPLE_FAQS) {
      await addDoc(collection(db, 'faqBase'), {
        ...faq,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
    }

    console.log(`✅ ${count} FAQs criadas com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao inicializar FAQs:', error);
  }
}
