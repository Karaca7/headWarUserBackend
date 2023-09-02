

const handlers=require('./handlers/index')

module.exports=function(app,opt,done){


console.log("tes1");


    app.route({
        path:'/find',
        method:'GET',
        config:{private:false},
        handler:handlers.findMatch.handler

    })


    done()
}