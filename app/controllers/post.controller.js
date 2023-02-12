const { Router } = require("express");
const { Post } = require("../entities/Post");
const router = Router();


// CRUD
// POST - http://localhost:3000/api/posts/ (GOOD)
// GET - http://localhost:3000/api/posts/ (GOOD)


// GET - http://localhost:3000/api/posts/:id/ (GOOD)
// PATCH - http://localhost:3000/api/posts/:id (GOOD)
// POST - http://localhost:3000/api/posts/:id/ (GOOD)
// DELETE - http://localhost:3000/api/posts/:id/ (GOOD)

const PostController = (DI) => {
    router.post("/", async (req, res) => {
        console.log('POST - Create a new post')
        const { title, author, content } = req.body;
        if (!title || !author || !content) {
            return res.status(400).send({
                success: false,
                message: "One of `title, author`  or `content` is missing",
            });
        }
        try {
            const post = new Post(title, author, content);
            await DI.postRepository.persistAndFlush(post);
            res
                .status(200)
                .send({ success: true, message: "post successfully created", post });
        } catch (e) {
            return res.status(400).send({ success: false, message: e.message });
        }
    });

    router.get("/", async (req, res) => {
        console.log('GET - Fetch all posts')
        try {
            const posts = await DI.postRepository.findAll()

            if (!posts) {
                res.status(400).send({
                    success: false,
                    message: "Cannot find the resources!"
                })
            }

            res.status(200).send({
                success: true,
                message: "Here you go!",
                posts
            })

        } catch (error) {
            return res.status(400).send({ success: false, message: e.message });
        }
    })

    router.patch("/:id", async (req, res) => {
        console.log('PATCH - Update a specific post')

        try {
            const id = req.params.id
            const { title, author, content } = req.body;
            if (!title || !author || !content) {
                return res.status(400).send({
                    success: false,
                    message: "One of `title, author`  or `content` is missing",
                });
            }
            const post = await DI.postRepository.findOne(id)

            post.title = title || post.title 
            post.author = author || post.author
            post.content = content || post.content

            await DI.postRepository.flush()

            return res.status(200).send({
                success: true,
                message: "Updated!",
                post
            })
        } catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    })

    router.delete("/:id", async (req, res) => {
        console.log('DELETE - Delete a specific post')

        try {
            const id = req.params.id

            const post = await DI.postRepository.findOne(id)

            if (!post) {
                res.status(400).send({
                    success: false,
                    message: "Cannot find the resources!"
                })
            }

            await DI.postRepository.removeAndFlush(post)


            return res.status(200).send({
                success: true,
                message: "Successfully deleted!",
                post
            })
        } catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    })

    router.get("/:id", async (req, res) => {
        console.log('GET - Fetch a specific post')

        const id = req.params.id

        try {
            const post = await DI.postRepository.findOne(id)

            if (!post) {
                res.status(400).send({
                    success: false,
                    message: "Cannot find the resources!"
                })
            }

            res.status(200).send({
                success: true,
                message: "Cool here you go!",
                post
            })
        } catch (error) {
            return res.status(400).send({ success: false, message: error.message });
        }
    })

    return router;
}

module.exports = { PostController };
