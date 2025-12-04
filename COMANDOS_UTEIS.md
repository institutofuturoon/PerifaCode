# 🛠️ Comandos Úteis - FuturoOn

**Referência rápida de comandos para desenvolvimento e testes**

---

## 🚀 Desenvolvimento

### Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
**Porta:** http://localhost:5173

### Build para Produção
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

### Verificar Erros de TypeScript
```bash
npx tsc --noEmit
```

---

## 🧪 Testes

### Executar Testes (quando configurado)
```bash
npm test
```

### Executar Testes com Cobertura
```bash
npm run test:coverage
```

### Executar Testes E2E (quando configurado)
```bash
npm run test:e2e
```

---

## 🔍 Análise de Código

### Lint
```bash
npm run lint
```

### Lint com Auto-fix
```bash
npm run lint:fix
```

### Formatar Código
```bash
npm run format
```

---

## 📦 Dependências

### Instalar Dependências
```bash
npm install
```

### Atualizar Dependências
```bash
npm update
```

### Verificar Dependências Desatualizadas
```bash
npm outdated
```

### Auditar Segurança
```bash
npm audit
```

### Corrigir Vulnerabilidades
```bash
npm audit fix
```

---

## 🔥 Firebase

### Login no Firebase
```bash
firebase login
```

### Inicializar Projeto
```bash
firebase init
```

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Hosting
```bash
firebase deploy --only hosting
```

### Deploy Completo
```bash
firebase deploy
```

### Emuladores Locais
```bash
firebase emulators:start
```

---

## 🐛 Debug

### Verificar Versão do Node
```bash
node --version
```

### Verificar Versão do NPM
```bash
npm --version
```

### Limpar Cache do NPM
```bash
npm cache clean --force
```

### Remover node_modules e Reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### Verificar Portas em Uso (Windows)
```bash
netstat -ano | findstr :5173
```

### Matar Processo na Porta (Windows)
```bash
taskkill /PID <PID> /F
```

---

## 📊 Análise de Bundle

### Analisar Tamanho do Bundle
```bash
npm run build -- --analyze
```

### Verificar Tamanho dos Arquivos
```bash
npm run build
cd dist
dir /s
```

---

## 🔧 Git

### Status
```bash
git status
```

### Adicionar Todos os Arquivos
```bash
git add .
```

### Commit
```bash
git commit -m "feat: implementa sistema de notificações"
```

### Push
```bash
git push origin main
```

### Criar Branch
```bash
git checkout -b feature/nova-funcionalidade
```

### Ver Histórico
```bash
git log --oneline --graph
```

### Desfazer Último Commit (mantém mudanças)
```bash
git reset --soft HEAD~1
```

---

## 📝 Documentação

### Gerar Documentação de Tipos
```bash
npx typedoc --out docs src
```

### Servir Documentação Localmente
```bash
npx http-server docs
```

---

## 🎨 Storybook (quando configurado)

### Iniciar Storybook
```bash
npm run storybook
```

### Build Storybook
```bash
npm run build-storybook
```

---

## 🔐 Variáveis de Ambiente

### Copiar Template
```bash
copy .env.example .env.local
```

### Verificar Variáveis
```bash
type .env.local
```

---

## 📱 Testes de Responsividade

### Abrir em Diferentes Dispositivos (Chrome DevTools)
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
```

**Dispositivos Recomendados:**
- iPhone SE (375x667)
- iPad (768x1024)
- Desktop (1920x1080)

---

## ⚡ Performance

### Lighthouse Audit
```
Chrome DevTools → Lighthouse → Generate Report
```

### Verificar Core Web Vitals
```
Chrome DevTools → Performance → Record
```

---

## 🗄️ Firestore

### Backup de Dados
```bash
firebase firestore:export gs://[BUCKET_NAME]/[EXPORT_PATH]
```

### Restaurar Dados
```bash
firebase firestore:import gs://[BUCKET_NAME]/[EXPORT_PATH]
```

---

## 🔄 CI/CD (quando configurado)

### Verificar Build Localmente
```bash
npm run build
npm run preview
```

### Simular Deploy
```bash
firebase hosting:channel:deploy preview
```

---

## 📊 Monitoramento

### Ver Logs do Firebase
```bash
firebase functions:log
```

### Ver Uso do Firestore
```
Firebase Console → Firestore → Usage
```

---

## 🎯 Atalhos Úteis

### VSCode
- `Ctrl+P` - Quick Open
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+B` - Toggle Sidebar
- `Ctrl+`` - Toggle Terminal
- `F12` - Go to Definition
- `Alt+Shift+F` - Format Document

### Chrome DevTools
- `F12` - Open DevTools
- `Ctrl+Shift+C` - Inspect Element
- `Ctrl+Shift+M` - Toggle Device Toolbar
- `Ctrl+Shift+J` - Console
- `Ctrl+Shift+I` - DevTools

---

## 🚨 Troubleshooting

### Erro: "Port already in use"
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Ou use outra porta
npm run dev -- --port 3000
```

### Erro: "Module not found"
```bash
npm install
```

### Erro: "Permission denied"
```bash
# Windows (executar como Administrador)
# Ou verificar permissões de pasta
```

### Erro: "Firebase not initialized"
```bash
firebase login
firebase init
```

### Build Falha
```bash
# Limpar e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

---

## 📚 Recursos Úteis

### Documentação
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Vite: https://vitejs.dev
- Firebase: https://firebase.google.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Ferramentas Online
- TypeScript Playground: https://www.typescriptlang.org/play
- Regex Tester: https://regex101.com
- JSON Formatter: https://jsonformatter.org
- Color Picker: https://coolors.co

---

## 🎓 Comandos de Aprendizado

### Ver Estrutura do Projeto
```bash
tree /F /A
```

### Contar Linhas de Código
```bash
# Windows PowerShell
(Get-ChildItem -Recurse -Include *.tsx,*.ts | Get-Content | Measure-Object -Line).Lines
```

### Buscar em Arquivos
```bash
# Windows
findstr /s /i "NotificationCenter" *.tsx
```

---

**Última Atualização:** 03/12/2024  
**Mantenha este arquivo atualizado com novos comandos úteis!**
