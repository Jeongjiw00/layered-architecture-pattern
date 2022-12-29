// const { Posts } = require("../models");
// postsModel 생성자를 만들어서 모델대신 사용

class PostRepository {
  constructor(postsModel) {
    this.postsModel = postsModel;
  }

  findAllPost = async () => {
    // ORM인 Sequelize에서 Posts 모델의 findAll 메소드를 사용해 데이터를 요청합니다.
    const posts = await this.postsModel.findAll();

    return posts;
  };

  findPostById = async (postId) => {
    const post = await this.postsModel.findByPk(postId);

    return post;
  };

  createPost = async (nickname, password, title, content) => {
    // ORM인 Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
    const createPostData = await this.postsModel.create({
      nickname,
      password,
      title,
      content,
    });

    return createPostData;
  };

  updatePost = async (postId, password, title, content) => {
    const updatePostData = await this.postsModel.update(
      {
        title,
        content,
      },
      { where: { postId, password } }
    );

    return updatePostData;
  };

  deletePost = async (postId, password) => {
    const deletePostData = await this.postsModel.destroy({
      where: { postId, password },
    });

    return deletePostData;
  };
}

module.exports = PostRepository;
