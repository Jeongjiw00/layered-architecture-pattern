const PostsController = require("../../controllers/posts.controller.js");

// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostService = {
  findAllPost: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

//req.body
let mockRequest = {
  body: jest.fn(),
};

//res.status.json
let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

let postsController = new PostsController();
// postsController의 Service를 Mock Service로 변경합니다.
postsController.postService = mockPostService;

describe("Layered Architecture Pattern Posts Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    // status가 없을 때도 에러가 나지 않고 res 자기자신을 반환하기 위해
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test("Posts Controller getPosts Method by Success", async () => {
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

    mockPostService.findAllPost = jest.fn(() => {
      return findAllPostReturnValue;
    });

    //controller부분은 return값이 없어서 `const post = ` 이런식으로 할당안함.
    await postsController.getPosts(mockRequest, mockResponse);

    // 1. findAllPost Method가 1번 호출?
    expect(mockPostService.findAllPost).toHaveBeenCalledTimes(1);
    // 2. res.status가 200으로 정상 전달되었는가?
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    // 3. res.json이 {data:posts}의 형태로 정상 전달되었는가?
    expect(mockResponse.json).toHaveBeenCalledWith({
      //실제로 호출이 된 것이라서 toMatchObject사용못함
      data: findAllPostReturnValue,
    });
  });

  test("Posts Controller createPost Method by Success", async () => {
    const createPostBodyParams = {
      nickname: "Nickname_Success",
      password: "Password_Success",
      title: "Title_Success",
      content: "Content_Success",
    };

    mockRequest.body = createPostBodyParams;

    const createPostReturnValue = {
      postId: 1,
      nickname: "Nickname_1",
      title: "Title_1",
      content: "Content_1",
      createdAt: new Date().toString,
      updatedAt: new Date().toString,
    };

    mockPostService.createPost = jest.fn(() => {
      return createPostReturnValue;
    });

    await postsController.createPost(mockRequest, mockResponse);

    // 1. req.body의 데이터가 createPost에 정상적으로 전달되었는가?
    expect(mockPostService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.createPost).toHaveBeenCalledWith(
      createPostBodyParams.nickname,
      createPostBodyParams.password,
      createPostBodyParams.title,
      createPostBodyParams.content
    );
    // 2. res.json을 1번 호출, createPost의 return값과 동일한가?
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: createPostReturnValue,
    });

    // 3. res.status가 201이 맞는가?
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  test("Posts Controller createPost Method by Invalid Params Error", async () => {
    mockRequest.body = {};

    await postsController.createPost(mockRequest, mockResponse);

    // controller부분에서 이미 에러핸들링이 되어 있기 때문에 try/catch안해줘도 됨.
    // 1. res.status가 400
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    // 2. res.json이 {errorMessage: "InvalidParamsError"}
    expect(mockResponse.json).toHaveBeenCalledWith({
      errorMessage: "InvalidParamsError",
    });
  });
});
