# Guia: Configurar Redirect de Domínio (Hostinger → Vercel)

## Objetivo
Redirecionar `institutofuturoon.org` para `www.institutofuturoon.org`

## Situação Atual
- ✅ `www.institutofuturoon.org` - Funcionando (Valid Configuration)
- ❌ `institutofuturoon.org` - Com erro (Invalid Configuration)

## Solução: Configurar DNS no Hostinger

### Passo 1: Remover Registro Conflitante
No painel da Hostinger (DNS / Nameservers):

1. Procure por um registro **AAAA** apontando para `@` (root domain)
2. O Vercel está pedindo para remover: `2a02:4780:13:904:0:2d84:3e70:2`
3. Delete este registro AAAA

### Passo 2: Adicionar Registro A para o Root Domain
Adicione um novo registro DNS:

```
Type: A
Name: @ (ou deixe vazio para root domain)
Value: 76.76.21.21
TTL: Automático (ou 3600)
```

**Nota:** O IP `76.76.21.21` é o antigo. Use o novo IP que o Vercel está mostrando: `216.198.79.1`

### Passo 3: Verificar Registros Atuais
Certifique-se de ter estes registros no Hostinger:

```
Type: A
Name: @
Value: 216.198.79.1

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Passo 4: Configurar Redirect no Vercel (Opcional)
Se você quiser que o domínio sem www redirecione automaticamente para www:

1. No Vercel, vá em **Project Settings** → **Domains**
2. Clique em **Edit** no domínio `institutofuturoon.org`
3. Marque a opção **Redirect to www.institutofuturoon.org**

## Alternativa: Usar vercel.json

Se preferir controlar o redirect via código, adicione no `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "institutofuturoon.org"
        }
      ],
      "destination": "https://www.institutofuturoon.org/:path*",
      "permanent": true
    }
  ]
}
```

## Tempo de Propagação
- DNS pode levar de 15 minutos a 24 horas para propagar
- Normalmente leva cerca de 1-2 horas

## Verificar Configuração
Após configurar, teste com:

```bash
# Verificar DNS
nslookup institutofuturoon.org

# Testar redirect
curl -I http://institutofuturoon.org
```

## Troubleshooting

### Erro "Invalid Configuration" persiste
1. Aguarde a propagação do DNS (até 24h)
2. Clique em **Refresh** no Vercel
3. Verifique se não há registros A ou AAAA conflitantes no Hostinger

### Domínio não redireciona
1. Certifique-se de que ambos os domínios estão adicionados no Vercel
2. Configure o redirect nas configurações do domínio no Vercel
3. Ou use a configuração no `vercel.json`

## Checklist Final
- [ ] Remover registro AAAA conflitante no Hostinger
- [ ] Adicionar registro A (@) apontando para 216.198.79.1
- [ ] Manter registro CNAME (www) apontando para cname.vercel-dns.com
- [ ] Aguardar propagação DNS (1-24h)
- [ ] Clicar em Refresh no Vercel
- [ ] Testar acesso em ambos os domínios
