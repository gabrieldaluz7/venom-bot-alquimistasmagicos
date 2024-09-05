const venom = require('venom-bot');

let client; 

const __DEBUG__LOG___ = true;

// Telefone que o bot está instalado
const phoneBot = "17374435069@c.us";

// Usuários admins
const usersAdmin = [
    phoneBot, // PhoneBot
    "556784660441@c.us" // Gabriel da Luz Pessoal
];

const groupsBot = [
    "120363169826642222@g.us", // Grupo Alquimistas Mágicos
    "120363330220244715@g.us" // Grupo TESTER
];

// Textos
const texts = {
    pix: require('./includes/pix.js'),
    loja: require('./includes/loja.js'),
    links: require('./includes/links.js'),
    livros: require('./includes/livros.js'),
    comandos: require('./includes/comandos.js'),
    comandosGrupos: require('./includes/comandosGrupos.js'),
    grupoLink: require('./includes/grupoLinks.js'),
    beneficios: require('./includes/beneficios.js'),
    curiosidades: require('./includes/curiosidades.js'),
    regrasGrupos: require('./includes/regrasGrupos.js'),
    frasesMotivacionais: require('./includes/frasesMotivacionais.js')
};

// Inicia o Venom
venom.create({ session: 'v1', multidevice: true })
    .then(createdClient => { client = createdClient; start(); })
    .catch(erro => log(erro));

// Função principal para iniciar o bot
function start() {
    client.onMessage(async (message) => {

        if(!message.isGroupMsg) { return false; }

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
        '!comandos': exec_comandos,
        '!grupolink': exec_grupolink,
        '!regras': exec_regras_grupo
    };

    const commandFunc = commands[command];
    if (commandFunc) {
        await commandFunc(message);
    } else {
        log(`Comando não reconhecido: ${command}`);
    }
}

async function exec_comandos(message) {
    const messages = texts.comandosGrupos;
    await sendManyMessages(message.to, messages);
}

async function exec_grupolink(message) {
    await sendManyMessages(message.to, texts.grupoLink);
}

async function exec_regras_grupo(message) {
    const messages = texts.regrasGrupos;
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
