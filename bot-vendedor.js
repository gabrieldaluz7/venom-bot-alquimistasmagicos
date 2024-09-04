const venom = require('venom-bot');

let client; 

const __DEBUG__LOG___ = true;

// Telefone que o bot está instalado
const phoneBot = "17374435069@c.us";

// Usuários admins
const usersAdmin = [
    phoneBot // PhoneBot
//    "556784660441@c.us" // Gabriel da Luz Pessoal
];

// Textos
const texts = {
    pix: require('./includes/pix.js'),
    loja: require('./includes/loja.js'),
    comandos: require('./includes/comandos.js')
};

// Inicia o Venom
venom.create({ session: 'v2', multidevice: true, headless: false })
    .then(createdClient => { client = createdClient; start(); })
    .catch(erro => log(erro));

// Função principal para iniciar o bot
function start() {
    client.onMessage(async (message) => {

        if(message.isGroupMsg) { return false; }
    
        message.to = (message.to == phoneBot) ? message.from : message.to;

        const args = message.content?.trim().split(' ') || [];
        const command = args.shift()?.toLowerCase();

        if (message.from === phoneBot && message.self === "out") {
            log(`[Bot enviando resposta para: ${message.to}]`);
            return;
        }

        if (command?.startsWith('!')) {
            await executeCommand(message, command, args);
        }

    });
}

async function executeCommand(message, command, args) {
    log(`${message.from} executando comando: ${command} ${args}`);

    const commands = {
        '!comandos': exec_comandos
       
      
    };

    const commandFunc = commands[command];
    if (commandFunc) {
        await commandFunc(message);
    } else {
        log(`Comando não reconhecido: ${command}`);
    }
}

async function exec_comandos(message) {
    const messages = texts.comandos;
    await sendManyMessages(message.to, messages);
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~ Funções Gerais ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function sendManyMessages(phoneUs, messages) {
    for (const message of messages) {
        try {
            await client.sendText(phoneUs, message);
            log(`Mensagem Enviada  >> ${phoneUs}`);
        } catch (erro) {
            error(`Erro ao enviar mensagem: ${erro}`);
        }
    }
}

function isUserAdmin(userId) {
    return usersAdmin.includes(userId);
}

function log(msg) {
    if (__DEBUG__LOG___) console.log(msg);
}

function error(msg) {
    if (__DEBUG__LOG___) console.error(msg);
}
