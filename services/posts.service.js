const PostRepository = require("../repositories/posts.repository");
const { Posts } = require("../models/index.js");

class PostService {
  //전달받은 postModel, Posts를 이용해서 repository생성
  postRepository = new PostRepository(Posts);

  findAllPost = async () => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const allPost = await this.postRepository.findAllPost();

    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    allPost.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return allPost.map((post) => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  findPostById = async (postId) => {
    const findPost = await this.postRepository.findPostById(postId);

    return {
      postId: findPost.postId,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    };
  };

  createPost = async (nickname, password, title, content) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createPostData = await this.postRepository.createPost(
      nickname,
      password,
      title,
      content
    );

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: createPostData.null,
      nickname: createPostData.nickname,
      title: createPostData.title,
      content: createPostData.content,
      createdAt: createPostData.createdAt,
      updatedAt: createPostData.updatedAt,
    };
  };

  updatePost = async (postId, password, title, content) => {
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new Error("Post doesn't exist");

    await this.postRepository.updatePost(postId, password, title, content);

    const updatePost = await this.postRepository.findPostById(postId);

    return {
      postId: updatePost.null,
      nickname: updatePost.nickname,
      title: updatePost.title,
      content: updatePost.content,
      createdAt: updatePost.createdAt,
      updatedAt: updatePost.updatedAt,
    };
  };

  deletePost = async (postId, password) => {
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new Error("Post doesn't exist");

    await this.postRepository.deletePost(postId, password);

    return {
      postId: findPost.postId,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      createdAt: createPostData.createdAt,
      updatedAt: createPostData.updatedAt,
    };
  };
}

module.exports = PostService;
