const express = require("express");
const { MikroORM, RequestContext } = require("@mikro-orm/core");
const { initializeORM } = require("./bootstrap");
const { PostController } = require("./controllers/post.controller");


let port = process.env.PORT || 3000;

(async () => {
    //bootstrap express application.
    const app = express();
    const DI = await initializeORM(MikroORM);


    //parse incoming requests data;
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use((req, res, next) => {
        RequestContext.create(DI.orm.em, next);
        req.di = DI;
    })


    app.use("/api/posts", PostController(DI));

    //default catch-all route that sends a JSON response.
    app.get("*", (req, res) =>
        res
            .status(200)
            .send({ success: true, message: "Hello world!" })
    );
    

    app.listen(port, () => {
        console.log(
            `Introduction to Nodejs with Express + MikroORM + MySQL http://localhost:${port}`
        );
    });
})();
