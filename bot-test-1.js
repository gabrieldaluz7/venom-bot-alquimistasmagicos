const venom = require('venom-bot');

let client; 

// Inicia o Venom
venom.create({ session: 'v1', multidevice: true, headless: false })
    .then(createdClient => { client = createdClient; start(); })
    .catch(erro => log(erro));


function start() {
    client.onMessage(async (message) => {

       

    });

    process.stdin.on('data', (input) => {
        const comando = input.toString().trim();

        if (comando === '!gp') {
            getGroupMembersInfo('120363169826642222@g.us');
        } else {
            console.log("Comando não reconhecido. Tente novamente.");
        }
    });


}

async function getGroupMembersInfo(groupId) {
    try {
        const groupMembers = await client.getGroupMembers(groupId);

        // Obter o número total de membros
        const totalMembers = groupMembers.length;
        console.log(`Total de membros no grupo: ${totalMembers}`);

        // Lista os nomes e telefones dos membros
        groupMembers.forEach(member => {
            console.log(`Nome: ${member.pushname || 'Sem Nome'}, Telefone: ${member.id.user}`);
        });

    } catch (error) {
        console.error('Erro ao obter informações dos membros do grupo:', error);
    }
}

// Exemplo de uso: substituir "120363169826642222@g.us" pelo ID do grupo que você deseja consultar.
