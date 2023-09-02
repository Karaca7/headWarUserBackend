



// const clients=[]

exports.handler=async(req,res)=>{
 let test= res.sse((async function * source () {
     for (let i = 0; i < 10; i++) {
      await sleep(2000);

      yield {id: String(i), data: "Some message"};
    }
})());


console.log(res.sse,"adsada");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}