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
  });

  test("Posts Service deletePost Method By Success", async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });

  test("Posts Service deletePost Method By Not Found Post Error", async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });
});
