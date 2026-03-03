# 🔐 Sistema de Autenticação - Calculadora MedGM

Sistema de autenticação por código de acesso integrado com Hubla.

## 🎯 Como Funciona

### Para o Cliente:
1. Compra produto na Hubla
2. Recebe email com código de acesso (6 caracteres, ex: `ABC123`)
3. Acessa a calculadora em seu domínio
4. É redirecionado para `/login`
5. Digita email de compra + código
6. Acesso liberado por 30 dias

### Para Você (Admin):
1. Configura webhook na Hubla apontando para sua API
2. Cliente compra → webhook automático → código gerado
3. Código é salvo no arquivo `data/users.json`
4. (Opcional) Sistema envia email com código

---

## 📋 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local`:

```bash
# Obrigatório - Mude em produção!
JWT_SECRET=seu-secret-super-seguro-aqui-mude-em-producao-123456

# Opcional - Webhook Hubla
HUBLA_WEBHOOK_SECRET=seu-secret-da-hubla

# Opcional - Envio de email (se quiser enviar códigos por email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASS=sua-senha-de-app
```

### 2. Configurar Webhook na Hubla

1. Acesse o painel da Hubla
2. Vá em **Configurações → Webhooks**
3. Adicione novo webhook:
   - **URL:** `https://seu-dominio.com/api/hubla/webhook`
   - **Evento:** `purchase.approved` (ou equivalente)
   - **Método:** POST

4. Teste enviando um evento de compra

### 3. Deploy

```bash
# Build
npm run build

# Deploy no Vercel (recomendado)
vercel --prod

# Ou outro servidor
npm start
```

---

## 🧪 Testar Localmente

### 1. Adicionar usuário manualmente (para testes)

```bash
npx tsx scripts/add-user.ts teste@email.com
```

Output:
```
✅ Usuário adicionado com sucesso!
📧 Email: teste@email.com
🔑 Código: AB12CD
```

### 2. Testar login

1. Acesse: http://localhost:3000
2. Será redirecionado para: http://localhost:3000/login
3. Digite:
   - **Email:** teste@email.com
   - **Código:** AB12CD (o código gerado)
4. Clique em "Acessar Calculadora"

### 3. Testar Webhook (simular compra Hubla)

```bash
curl -X POST http://localhost:3000/api/hubla/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "purchase.approved",
    "customer": {
      "email": "cliente@exemplo.com"
    }
  }'
```

Verifique o log do servidor para ver o código gerado.

---

## 📊 Estrutura de Dados

### Arquivo: `data/users.json`

```json
[
  {
    "email": "cliente@email.com",
    "codigo": "ABC123",
    "dataCriacao": "2026-03-03T18:30:00.000Z",
    "ativo": true,
    "hublaData": {
      "hublaEvent": "purchase.approved",
      "purchaseData": { ... }
    }
  }
]
```

---

## 🔧 Gerenciamento de Usuários

### Listar todos os usuários

```bash
cat data/users.json | jq '.'
```

### Desativar um usuário

Edite `data/users.json` e mude `"ativo": false`

Ou crie um script:
```bash
npx tsx scripts/deactivate-user.ts email@usuario.com
```

---

## 🚀 Próximos Passos (Opcional)

### 1. Enviar Email com Código Automaticamente

Integre com **Resend**, **SendGrid** ou **Mailgun**:

```typescript
// Em app/api/hubla/webhook/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'MedGM <noreply@medgm.com.br>',
  to: user.email,
  subject: 'Seu acesso à Calculadora MedGM',
  html: `
    <h1>Bem-vindo à Calculadora MedGM!</h1>
    <p>Seu código de acesso é: <strong>${user.codigo}</strong></p>
    <p>Acesse: https://calculadora.medgm.com.br</p>
  `,
});
```

### 2. Migrar para Banco de Dados

Substitua `lib/auth/storage.ts` por:
- **Supabase** (PostgreSQL grátis)
- **Firebase Firestore**
- **PlanetScale** (MySQL)
- **MongoDB Atlas**

### 3. Dashboard Admin

Crie uma rota `/admin` para:
- Ver todos os usuários
- Gerar códigos manualmente
- Desativar acessos
- Estatísticas de uso

---

## 🐛 Troubleshooting

### "Email ou código inválido"
- Verifique se o email está correto (case-insensitive)
- Código deve ter exatamente 6 caracteres
- Verifique se usuário está ativo: `"ativo": true`

### Webhook não está funcionando
- Teste manualmente com curl
- Verifique logs do servidor: `tail -f .next/server.log`
- Confirme que a URL do webhook na Hubla está correta
- Verifique se o evento está correto (varie entre plataformas)

### Redirecionamento infinito
- Limpe cookies: DevTools → Application → Cookies → Delete All
- Verifique se o middleware está configurado corretamente
- Confirme que `/login` não está protegido no middleware

---

## 📞 Suporte

- Email: contato@medgm.com.br
- Documentação Hubla: https://docs.hubla.com/webhooks

---

**Desenvolvido para MedGM** 🩺
