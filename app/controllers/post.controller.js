const { Router } = require("express");
const { Post } = require("../entities/Post");
const router = Router();

const PostController = (DI) => {
  router.post("/", async (req, res) => {
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

 return router;
}

module.exports = { PostController };
