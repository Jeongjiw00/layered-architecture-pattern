// __tests__/integration/posts.integration.spec.js
const supertest = require("supertest");
const app = require("../../app.js");
const { sequelize } = require("../../models/index.js");

// 통합 테스트(Integration Test)를 진행하기에 앞서 Sequelize에 연결된 모든 테이블의 데이터를 삭제합니다.
//  단, NODE_ENV가 test 환경으로 설정되어있는 경우에만 데이터를 삭제합니다.
beforeAll(async () => {
  if (process.env.NODE_ENV === "test") await sequelize.sync(); //생성
  else throw new Error("NODE_ENV가 test 환경으로 설정되어 있지 않습니다.");
});

describe("Layered Architecture Pattern, Posts Domain Integration Test", () => {
  test("GET /api/posts API (getPosts) Integration Test Success Case, Not Found Posts Data", async () => {
    const response = await supertest(app).get(`/api/posts`); // API의 HTTP Method & URL
    // .query({}) // Request Query String
    // .send({}); // Request Body

    // 1. API의 status가 200
    expect(response.status).toEqual(200);
    // 2. API의 res 데이터는 { data : []}
    expect(response.body).toEqual({ data: [] });
  });

  test("POST /api/posts API (createPost) Integration Test Success Case", async () => {
    const createPostBodyParams = {
      nickname: "Nickname_Success",
      password: "Password_Success",
      title: "Title_Success",
      content: "Content_Success",
    };

    const response = await supertest(app)
      .post(`/api/posts`) // API의 HTTP Method & URL
      .send(createPostBodyParams); // Request Body

    // 1. API의 status가 201
    expect(response.status).toEqual(201);
    // 2. API의 res 데이터는 { postId, nickname, title, content, createdAt, updatedAt }
    expect(response.body).toMatchObject({
      data: {
        postId: 1,
        nickname: createPostBodyParams.nickname,
        title: createPostBodyParams.title,
        content: createPostBodyParams.content,
        createdAt: expect.anything(), //null, undefined만 아니면 된다. => 존재하기만 하면 된다.
        updatedAt: expect.anything(),
      },
    });
  });

  test("POST /api/posts API (createPost) Integration Test Error Case, Invalid Params Error", async () => {
    const response = await supertest(app)
      .post(`/api/posts`) // API의 HTTP Method & URL
      .send(); // Request Body

    // 1. API의 status가 400
    expect(response.status).toEqual(400);
    // 2. API의 res 데이터는 { errorMessage: error.message }
    expect(response.body).toEqual({ errorMessage: "InvalidParamsError" });
  });

  test("GET /api/posts API (getPosts) Integration Test Success Case, is Exist Posts Data", async () => {
    const response = await supertest(app).get(`/api/posts`); // API의 HTTP Method & URL

    // 1. API의 status가 200
    expect(response.status).toEqual(200);
    // 2. API의 res 데이터는 { data: [ { postId, nickname, title, createdAt, updatedAt }] }
    expect(response.body).toEqual({ errorMessage: "InvalidParamsError" });
  });
});

afterAll(async () => {
  // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화합니다.
  if (process.env.NODE_ENV === "test")
    await sequelize.sync({ force: true }); //초기화&생성
  else throw new Error("NODE_ENV가 test 환경으로 설정되어 있지 않습니다.");
});
