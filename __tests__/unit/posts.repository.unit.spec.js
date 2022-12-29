// __tests__/unit/posts.repository.unit.spec.js

const PostRepository = require("../../repositories/posts.repository");

//mocking을 할 떄 사용하는 객체
// posts.repository.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostsModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

let postRepository = new PostRepository(mockPostsModel);

//테스트 코드생성
describe("Layered Architecture Pattern Posts Repository Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("Posts Repository findAllPost Method", async () => {
    mockPostsModel.findAll = jest.fn(() => {
      return "findAll Result"; //findAllPost 메소드가 실행되면 return
    });

    const posts = await postRepository.findAllPost();

    // postsModel에 있는 findAll Method는 한 번만 실행된다.
    expect(mockPostsModel.findAll).toHaveBeenCalledTimes(1);

    // postsModel에 있는 findAll Method의 결과값이 바로 return 되어야 한다.
    expect(posts).toEqual("findAll Result");
  });

  test("Posts Repository createPost Method", async () => {
    mockPostsModel.create = jest.fn(() => {
      return "create Result";
    });

    const createPostParams = {
      nickname: "createPostNickname",
      password: "createPostPassword",
      title: "createPostTitle",
      content: "createPostContent",
    };

    const createPostData = await postRepository.createPost(
      createPostParams.nickname,
      createPostParams.password,
      createPostParams.title,
      createPostParams.content
    );

    //1. 할당이 제대로 됐는지 => postsModel.create Method의 결과가 createPostData와 일치
    expect(createPostData).toEqual("create Result");
    //2. 한 번 호출
    expect(mockPostsModel.create).toHaveBeenCalledTimes(1);
    //3. 어떤 방식으로 어떤 값이 호출되는지 검증=> {nickname, password, title, content}
    expect(mockPostsModel.create).toHaveBeenCalledWith({
      nickname: createPostParams.nickname,
      password: createPostParams.password,
      title: createPostParams.title,
      content: createPostParams.content,
    });
  });
});
