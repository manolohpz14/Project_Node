const request = require("supertest");
const app = require("../app.cjs");

test("Jest funciona correctamente", () => {
  expect(2 + 2).toBe(4);
});

describe("GET /", () => {
  it("devuelve 200 y HTML", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });
});

describe("GET /inicio/get_all_messages sin token", () => {
  it("devuelve 401 o 403", async () => {
    const res = await request(app).get("/inicio/get_all_messages");
    expect([401, 403]).toContain(res.statusCode);
  });
});
