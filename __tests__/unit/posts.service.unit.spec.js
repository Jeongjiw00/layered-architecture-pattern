const PostService = require("../../services/posts.service.js");

let mockPostsRepository = {
  findAllPost: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

let postService = new PostService();
// postService의 Repository를 Mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository;

describe("Layered Architecture Pattern Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("Posts Service findAllPost Method", async () => {
    const findAllPostReturnValue = [
      {
        postId: 1,
        nickname: "nickname_1",
        title: "title_1",
        createdAt: new Date("11 October 2022 00:00"),
        updatedAt: new Date("11 October 2022 00:00"),
      },
      {
        postId: 2,
        nickname: "nickname_2",
        title: "title_2",
        createdAt: new Date("12 October 2022 00:00"),
        updatedAt: new Date("12 October 2022 00:00"),
      },
    ];

    mockPostsRepository.findAllPost = jest.fn(() => {
      return findAllPostReturnValue;
    });

    const allPost = await postService.findAllPost();

    // 1. 결과가 sort된 결과를 제대로 가져오는지 검증
    expect(allPost).toEqual(
      findAllPostReturnValue.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );

    // 2. 한 번 호출되는지 검증
    expect(mockPostsRepository.findAllPost).toHaveBeenCalledTimes(1);
  });

  test("Posts Service deletePost Method By Success", async () => {
    const findPostByIdReturnValue = {
      postId: 1,
      nickname: "nickname_1",
      title: "title_1",
      content: "content_1",
      createdAt: new Date("11 October 2022 00:00"),
      updatedAt: new Date("11 October 2022 00:00"),
    };

    mockPostsRepository.findPostById = jest.fn(() => {
      return findPostByIdReturnValue;
    });

    const deletePost = await postService.deletePost(1, "0000");

    // 1. 1번 호출, 입력받는 인자는 postId
    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(1);
    // 2. postId, password, deletePost Method가 호출
    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(1, "0000");
    // 3. return값이 findPostById의 반환된 결과와 일치
    expect(deletePost).toMatchObject({
      postId: findPostByIdReturnValue.postId,
      nickname: findPostByIdReturnValue.nickname,
      title: findPostByIdReturnValue.title,
      content: findPostByIdReturnValue.content,
      createdAt: findPostByIdReturnValue.createdAt,
      updatedAt: findPostByIdReturnValue.updatedAt,
    });
  });

  test("Posts Service deletePost Method By Not Found Post Error", async () => {
    const findPostByIdReturnValue = null;
    mockPostsRepository.findPostById = jest.fn(() => {
      return findPostByIdReturnValue;
    });

    try {
      const deletePost = await postService.deletePost(90, "0000");
    } catch (error) {
      // 1. postId 입력한 findPostById Method 1번 호출
      expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(90);
      // 2. return 된 findPostById의 결과가 존재하지 않을 때 에러발생
      expect(error.message).toEqual("Post doesn't exist");
    }
  });
});
