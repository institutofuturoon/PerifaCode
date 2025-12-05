# 💰 Guia: Valores Formatados em Reais

## Problema Resolvido

Antes, o campo de valor não aceitava formatação brasileira (R$ 15.000,00). Agora aceita múltiplos formatos!

## Formatos Aceitos

### ✅ Formato 1: Apenas números
```
15000
```

### ✅ Formato 2: Com ponto de milhar
```
15.000
```

### ✅ Formato 3: Com ponto e vírgula (padrão BR)
```
15.000,00
```

### ✅ Formato 4: Com vírgula decimal
```
15000,50
```

### ✅ Formato 5: Misto
```
1.500,75
```

## Como Usar

### Adicionar Novo Apoio

1. No campo **"Valor (R$)"**, digite o valor em qualquer formato:
   - `15000` → R$ 15.000,00
   - `15.000` → R$ 15.000,00
   - `15.000,00` → R$ 15.000,00
   - `1500,50` → R$ 1.500,50

2. O sistema converte automaticamente para número

3. Clique em **"➕ Adicionar Apoio"**

### Editar Apoio Existente

1. Clique em **✏️** no apoio
2. No campo **"Valor (R$)"**, edite o valor
3. Use qualquer formato aceito
4. Clique em **✓ Salvar**

## Exemplos Práticos

### Exemplo 1: Doação de R$ 15.000,00
```
Tipo: Doação Financeira
Valor: 15.000,00
Descrição: Doação para reforma do laboratório
```

### Exemplo 2: Doação de R$ 250,50
```
Tipo: Doação de Alimentos
Valor: 250,50
Descrição: Compra de lanches para os alunos
```

### Exemplo 3: Doação de R$ 1.500
```
Tipo: Doação de Equipamentos
Valor: 1500
Descrição: Notebooks para os alunos
```

## Conversão Automática

O sistema faz a conversão automaticamente:

| Você digita | Sistema salva | Exibe como |
|-------------|---------------|------------|
| 15000 | 15000.00 | R$ 15.000,00 |
| 15.000 | 15000.00 | R$ 15.000,00 |
| 15.000,00 | 15000.00 | R$ 15.000,00 |
| 1.500,50 | 1500.50 | R$ 1.500,50 |
| 250,75 | 250.75 | R$ 250,75 |

## Validação

### ✅ Valores Válidos
- `15000`
- `15.000`
- `15.000,00`
- `1500,50`
- `250`
- `0,50`

### ❌ Valores Inválidos
- `R$ 15.000` (remove o R$)
- `15 mil` (apenas números)
- `abc` (não é número)

Se digitar valor inválido, aparece alerta:
```
"Valor inválido. Use formato: 15000 ou 15.000,00"
```

## Dica de Uso

### Copiar e Colar
Você pode copiar valores de planilhas:
```
Excel/Sheets: 15.000,00
Cole no campo: 15.000,00
Sistema aceita: ✓
```

### Calculadora
```
Calculadora: 15000
Cole no campo: 15000
Sistema aceita: ✓
```

## Total Doado

O **Total Doado** é calculado automaticamente:

```
Apoio 1: R$ 15.000,00
Apoio 2: R$ 1.500,50
Apoio 3: R$ 250,00
─────────────────────
Total:   R$ 16.750,50
```

## Exibição

### No Editor
- Campo aceita: `15.000,00`
- Salva como: `15000.00`

### Na Lista de Apoios
- Exibe: `R$ 15.000,00`

### Na Página Pública
- Exibe: `R$ 15.000,00`

### No Dashboard
- Exibe: `R$ 15.000,00`

## Observações

### Ponto vs Vírgula
- **Ponto (.)** = Separador de milhar
- **Vírgula (,)** = Separador decimal

Exemplos:
- `1.500` = Mil e quinhentos reais
- `1500,50` = Mil quinhentos reais e cinquenta centavos
- `1.500,50` = Mil quinhentos reais e cinquenta centavos

### Valores Grandes
```
100.000 = Cem mil
1.000.000 = Um milhão
15.750,50 = Quinze mil setecentos e cinquenta reais e cinquenta centavos
```

### Valores Pequenos
```
50 = Cinquenta reais
0,50 = Cinquenta centavos
10,25 = Dez reais e vinte e cinco centavos
```

## Troubleshooting

### Problema: "Valor inválido"
**Solução:** Remova letras e símbolos, use apenas números, ponto e vírgula

### Problema: Valor não aparece correto
**Solução:** Verifique se usou ponto para milhar e vírgula para decimal

### Problema: Total errado
**Solução:** Edite os apoios e corrija os valores, o total recalcula automaticamente

---

**Agora você pode usar valores formatados em reais!** 💰
