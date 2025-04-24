// Script para criar um usuário no banco de dados
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Criando usuário de teste...');
    
    // Gera um hash da senha usando bcryptjs
    const hashedPassword = await bcryptjs.hash('senha123', 10);
    
    // Cria o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@example.com',
        password: hashedPassword,
      },
    });
    
    console.log('Usuário criado com sucesso:');
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    
    console.log('\nVocê pode fazer login com:');
    console.log('Email: teste@example.com');
    console.log('Senha: senha123');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    // Verifica se o erro é de usuário duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      console.log('\nO email já está em uso. Um usuário com este email já existe no banco de dados.');
      console.log('Você pode fazer login com:');
      console.log('Email: teste@example.com');
      console.log('Senha: senha123');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main(); 