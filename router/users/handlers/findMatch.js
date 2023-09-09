let clients = [];

const colyseus = require('colyseus.js');
const colyClient = new colyseus.Client('ws://colyseus_server_url'); 


exports.handler = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",  //corsa takılmak hoşuna gitmez ekle kardeşim
    };


    console.log(req.headers['authorization'].split(' ')[1]);
    res.raw.writeHead(200, headers);

    res.raw.write(`data: ${JSON.stringify("first")}\n\n`);

    const clientId = req.id;

    console.log(clientId, "client id");
    const newClient = {
      id: clientId,
      response: res,
      token:req.headers['authorization'].split(' ')[1],
      count:0,
      level:req.user.level,
      
    };

    clients.push(newClient);
    console.log(colyClient);


    while (true) {
      for (const client of clients) {
        client.count+=1;

        // if(user match ) { client.create( )}



        
        if(client.count>=300 ) {
          client.response.raw.write(`data: ${JSON.stringify("bye!")}\n\n`);

          clients=clients.filter(el=>el.id!==client.id)
          // console.log(clients,"new clients list");
          return  await client.response.raw.close()

        }

        console.log(client.count,"client count");
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
        matchingClients.push(otherClient);
      }
    }
  }

  return matchingClients;
}