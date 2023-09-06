// const clients=[]

exports.handler = async (req, res) => {
  try {
    let test = res.sse(
      (async function* source() {
        for (let i = 0; i < 10; i++) {
          await sleep(2000);

          yield { id: String(i), data: "Some message" };
        }
      })()
    );
    const abortController = new AbortController();

    


    req.socket.on('close', () => abortController.abort());




  } catch (error) {
    res.serverError("500");
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
