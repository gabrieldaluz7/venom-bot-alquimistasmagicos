//geral
const venom = require('venom-bot');

let client; 

const __DEBUG__LOG___ = true;


// telefone que o bot está instalado
const phoneBot = "17374435069@c.us";

// usuarios admins
const usersAdmin = [
    phoneBot, // PhoneBot
    "556784660441@c.us" // Gabriel da Luz Pessoal
];

const groupsBot = [
    "120363169826642222@g.us", // Grupo Alquimistas Mágicos
    "120363330220244715@g.us" // Grupo TESTER
];

// Textos
const pix = require('./includes/pix.js');
const loja = require('./includes/loja.js');
const links = require('./includes/links.js');
const livros = require('./includes/livros.js');
const comandos = require('./includes/comandos.js');
const comandosGrupos = require('./includes/comandosGrupos.js');
const grupoLink = require('./includes/grupoLinks.js');
const beneficios = require('./includes/beneficios.js');
const curiosidades = require('./includes/curiosidades.js');
const regrasGrupos = require('./includes/regrasGrupos.js');
const frasesMotivacionais = require('./includes/frasesMotivacionais.js');

// init Venom
venom.create({ session: 'v1', multidevice: true, headless: false }).then(createdClient => { client = createdClient; start(); }).catch(erro => log(erro));

// Função principal para iniciar o bot
function start() {

    client.onMessage(async (message) => {
        
        console.log('client.onMessage => ', message);


        // caso mensagem.to seja igual do phonebot.
        message.to = (message.to == phoneBot) ? message.from : message.to;

        // ignorar mensagem de resposta do bot para o target.
        if(message.from == phoneBot && message.self == "out") { log("[Bot enviando resposta para: "+message.to); return false; } 


        const args = message.content ? message.content.trim().split(' ') : [];
        const command = args.length > 0 ? args.shift().toLowerCase() : '';

        // Verifica se a mensagem é de um grupo
        if (message.isGroupMsg && groupsBot.includes(message.groupInfo.id)) {

            if (command.startsWith('!')) {
                    
                await executeCommand(message, command, args);
            }

        }

    });

}

async function executeCommand(mensagem, command, args) 
{
    console.log(mensagem.from+' executando comando: '+command+' '+args);   
    switch (command) 
    {
        case '!comandos':
            await exec_comandos(mensagem);
            break;
        case '!grupolink':
            await exec_grupolink(mensagem);
            break;
        case '!regras':
            await exec_regras_grupo(mensagem);
            break;
    }
}

async function exec_comandos(mensagem) 
{ 
    let messages;
    if(mensagem.isGroupMsg) { 
        messages = comandosGrupos;
    } else { 
        messages = comandos;
    }
    await _sendManyMessages(mensagem.to, messages);
}

async function exec_grupolink(mensagem) 
{ 
    const messages = grupoLink;
    await _sendManyMessages(mensagem.to, messages);
}

async function exec_regras_grupo(mensagem) 
{
    if(!mensagem.isGroupMsg) { 
        const messages = [
            "Olá, amigo! 😄",
            "Você ainda não faz parte do nosso grupo Aprendiz de Alquimistas Mágicos.",
            "Junte-se a nós para compartilhar conhecimento e experiências mágicas!",
            "*_Clique no link para participar:_*",
            "https://chat.whatsapp.com/Jbvo0bfMziCH8gNafwyAT8"
          ];
        await _sendManyMessages(mensagem.to, messages);
        return false;
    }
    const messages = regrasGrupos;
    await _sendManyMessages(mensagem.to, messages);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~functions utilizados gerais ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function _sendManyMessages(phoneUs, messages) { for (const message of messages) { await client.sendText(phoneUs, message).then(result => log('Mensagem Enviada  >> '+phoneUs)).catch(erro => error('Error when sending:', erro)); } }
async function _sendManyMessagesGroup(phoneUs, messages) { for (const message of messages) { await client.sendText(phoneUs, message).then(result => log('Mensagem Enviada [Group] >> '+phoneUs)).catch(erro => error('Error when sending:', erro)); } }
async function isUserAdmin(mensagem) { return usersAdmin.includes(mensagem.from); }
function log(log) { if(__DEBUG__LOG___) { console.log(log); } }
function error(log) { if(__DEBUG__LOG___) { console.error(log); } }

