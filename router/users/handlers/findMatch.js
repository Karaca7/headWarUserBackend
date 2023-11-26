let clients = [];


const Colyseus = require('colyseus.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const endpoint = 'ws://localhost:2567'; // Colyseus sunucusunun WebSocket adresi /envye alınacak

// Colyseus istemci bağlantısını oluşturun
const client = new Colyseus.Client(endpoint);


exports.handler = async (req, res) => {
  try {



    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    };

    console.log(req.headers["authorization"].split(" ")[1]);
    res.raw.writeHead(200, headers);

    res.raw.write(`data: ${JSON.stringify("first")}\n\n`);


    const clientId = req.id;

    console.log(clientId, "client id");
    const newClient = {
      id: clientId,
      response: res,
      token: req.headers["authorization"].split(" ")[1],
      count: 0,
      level: req.user.level,
    };

    clients.push(newClient);
    // console.log(colyClient);

    while (true) {
      for (const client of clients) {
        client.count += 1;

        let matchedList = getMatchingClients(client);

        console.log(matchedList);

        if (matchedList.length > 1) {
       

          let newRoom= await createRoom()
          console.log(newRoom.id,"rtesda");
          client.response.raw.write(
            `data: ${JSON.stringify(`{roomID:${newRoom.id}}`)}\n\n`
          );

          for (let cc of matchedList) {
            console.log("flagg: ");
            clients = clients.filter((el) => el.id !== el.id);
            client.response.raw.write(`data: ${JSON.stringify("matched")}\n\n`);

          }
        }

        if (client.count >= 300) {
          client.response.raw.write(`data: ${JSON.stringify("connection time finshed!")}\n\n`);

          clients = clients.filter((el) => el.id !== client.id);
          // console.log(clients,"new clients list");
        }

        // console.log(client.count,"client count");
        client.response.raw.write(`data: ${JSON.stringify(client.token)}\n\n`);

        await sleep(1000);
      }

      // console.log(clients);
      // clients = clients.filter((client) => client.id !== clientId);
    }

    req.raw.on("close", () => {
      console.log(`${clientId} connection closed`);
      clients = clients.filter((client) => client.id !== clientId);
    });
  } catch (error) {

    console.log("eeror"
    ,error);
    res.serverError("500");
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMatchingClients(client) {
  const matchingClients = [];

  for (const otherClient of clients) {
    if (otherClient.id !== client.id) {
      const levelDiff = Math.abs(otherClient.level - client.level);

      if (levelDiff <= 5) {
        matchingClients.push(otherClient, client);
      }
    }
  }

  return matchingClients;
}



async function createRoom() {
  try {
    // Sunucu tarafında tanımlanmış bir oda adıyla oda oluşturun
    const room = await client.create('my_room');

    return room
    console.log('Oda oluşturuldu. Oda ID:', room.id);

    
  }

catch(e){

  console.log(e);
}}