// Script para adicionar usuário manualmente (para testes)
// Execute com: npx tsx scripts/add-user.ts email@exemplo.com

import { addAuthorizedUser } from '../lib/auth/storage';

const email = process.argv[2];

if (!email) {
  console.error('❌ Forneça um email: npx tsx scripts/add-user.ts email@exemplo.com');
  process.exit(1);
}

try {
  const user = addAuthorizedUser(email);
  console.log('✅ Usuário adicionado com sucesso!');
  console.log('📧 Email:', user.email);
  console.log('🔑 Código:', user.codigo);
  console.log('\nEnvie este código para o usuário acessar a calculadora.');
} catch (error) {
  console.error('❌ Erro ao adicionar usuário:', error);
  process.exit(1);
}
