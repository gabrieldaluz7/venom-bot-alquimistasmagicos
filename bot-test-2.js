const venom = require('venom-bot');

let client;

// Telefone que o bot está instalado
const phoneBot = "17374435069@c.us";

//Administradores
const usersAdmin = [
    phoneBot, // PhoneBot
    "556784660441@c.us" // Gabriel da Luz
];

// Inicia o Venom
venom.create({ session: 'v1', multidevice: true, headless: false })
    .then(createdClient => { 
        client = createdClient; 
        start(); 
    })
    .catch(erro => console.error('Erro ao iniciar o Venom:', erro));

function start() {
    client.onMessage(async (message) => {
        
        console.log(message); 

        message.to = (message.to === phoneBot) ? message.from : message.to;

        const args = message.content.trim().split(' ') || [];
        const command = args.shift()?.toLowerCase();

        if (command?.startsWith('!')) {
            await executeCommand(message, command, args);
        }
    });
}

// Função para trancar o grupo para apenas admins enviarem mensagens
async function lockGroupToAdmins(groupId) {
    try {
        await client.groupSettingUpdate(groupId, 'announcement'); // Modo "announcement" permite apenas admins enviarem mensagens
        console.log(`O grupo ${groupId} foi trancado apenas para administradores.`);
    } catch (error) {
        console.error(`Erro ao trancar o grupo ${groupId}:`, error);
    }
}

// Exemplo de como usar a função em um comando
async function executeCommand(mensagem, command, args) {
    console.log(mensagem.from + ' executando comando: ' + command + ' ' + args);

    switch (command) {
        case '!trancar': // Novo comando para trancar o grupo
            if (await isUserAdmin(mensagem.sender.id)) { // Verifica se o usuário é admin
                await lockGroupToAdmins(mensagem.from);
            } else {
                await client.sendText(mensagem.from, 'Apenas administradores podem usar este comando.');
            }
            break;
    }
}

// Função para verificar se o usuário é administrador
function isUserAdmin(userId) {
    return usersAdmin.includes(userId);
}