import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

export interface AuthorizedUser {
  email: string;
  codigo: string;
  dataCriacao: string;
  dataExpiracao?: string;
  ativo: boolean;
  hublaData?: any; // Dados adicionais do webhook da Hubla
}

// Garante que o arquivo existe
function ensureDataFile() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Lê todos os usuários
export function getUsers(): AuthorizedUser[] {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Salva usuários
function saveUsers(users: AuthorizedUser[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// Busca usuário por email
export function getUserByEmail(email: string): AuthorizedUser | null {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Busca usuário por código
export function getUserByCode(codigo: string): AuthorizedUser | null {
  const users = getUsers();
  return users.find(u => u.codigo === codigo && u.ativo) || null;
}

// Gera código único de 6 caracteres (ex: ABC123)
function generateCode(): string {
  return nanoid(6).toUpperCase();
}

// Adiciona novo usuário autorizado
export function addAuthorizedUser(email: string, hublaData?: any): AuthorizedUser {
  const users = getUsers();

  // Verifica se já existe
  const existing = getUserByEmail(email);
  if (existing) {
    return existing; // Retorna o existente
  }

  const newUser: AuthorizedUser = {
    email: email.toLowerCase(),
    codigo: generateCode(),
    dataCriacao: new Date().toISOString(),
    ativo: true,
    hublaData,
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
}

// Valida acesso (email + código)
export function validateAccess(email: string, codigo: string): boolean {
  const user = getUserByEmail(email);
  if (!user) return false;
  if (!user.ativo) return false;
  if (user.codigo !== codigo.toUpperCase()) return false;

  // Verifica expiração se houver
  if (user.dataExpiracao) {
    const expiracao = new Date(user.dataExpiracao);
    if (expiracao < new Date()) {
      return false;
    }
  }

  return true;
}

// Desativa usuário
export function deactivateUser(email: string): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (index === -1) return false;

  users[index].ativo = false;
  saveUsers(users);

  return true;
}
