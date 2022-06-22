const autocannon = require("autocannon");
const MongoAccess = require("../MongoUtilities/mongoAccess");

const config = require("config");

autoCannonRequests();

async function autoCannonRequests() {
  const queryOptions = config.get("QueryOptions");
  console.log("Starting query simulator with options:");
  console.log(queryOptions);
  console.log("----------------------");
  console.log("");

  let mongoAccess = new MongoAccess();
  let elections = await mongoAccess.getElections();

  let apiHost = queryOptions.apiHost;
  let apiPort = queryOptions.apiPort;
  let baseUrl = "http://" + apiHost + ":" + apiPort;

  let offset = queryOptions.voterPageOffset;
  let batchSize = queryOptions.batchSize;
  let timeout = queryOptions.timeout;
  let routes = queryOptions.routes;
  let byTimeout = queryOptions.byTimeout;


  for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    let currentUrl = baseUrl + "/" + route.root;

    if(route.electionId){
      currentUrl += "/" + getRandomElection(elections).id + "/";
    }
    let endpoints = route.endpoints;
    for (let j = 0; j < endpoints.length; j++) {
      let endpoint = endpoints[j];
      let body = {};

      if(endpoint.params){
        if(endpoint.params.voterCI){
          let voter = (await mongoAccess.getVoterInformation(offset,1))[0];
          body.voterCI = voter.ci;
          if(endpoint.params.electionId){
            body.electionId = voter.electionId;
          }
        }
      }
      if(!byTimeout){
        sendAutoCannonRequestByAmount(currentUrl + endpoint.endpoint, endpoint.method, batchSize, body, timeout);
      }else{
        sendAutoCannonRequestByTimeout(currentUrl + endpoint.endpoint, endpoint.method, batchSize, body, timeout);
      }
    }
  }
}

async function sendAutoCannonRequestByAmount(url, method, count, body, timeout) {
  console.log(`Starting ${count} requests to: ${method} ${url}`);
  autocannon(
    {
      url: url,
      method: method.toUpperCase(),
      amount: count,
      connections: count,
      duration: timeout,
      timeout: timeout,
      setupClient: (client) => {
        client.setHeadersAndBody(
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          JSON.stringify(body)
        );
      },
    },
    console.log
  );
}

async function sendAutoCannonRequestByTimeout(url, method, count, body, timeout) {
  console.log(`Starting ${count} requests to: ${method} ${url}`);
  autocannon(
    {
      url: url,
      method: method.toUpperCase(),
      connections: count,
      duration: timeout,
      setupClient: (client) => {
        client.setHeadersAndBody(
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          JSON.stringify(body)
        );
      },
    },
    console.log
  );
}

function getRandomElection(elections) {
  let randomIndex = Math.floor(Math.random() * elections.length);
  return elections[randomIndex];
}
