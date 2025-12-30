/**
 * Testes para rotas de Categorias de Veículo
 * Endpoints: /api/categoriasVeiculo
 */

const request = require("supertest");
const app = require("../src/app");
const {
    cleanDatabase,
    seedBasicData,
    getAuthToken,
    prisma,
} = require("./testUtils");

describe("Categorias de Veículo - /api/categoriasVeiculo", () => {
    let token;
    let seedData;

    beforeEach(async () => {
        await cleanDatabase();
        seedData = await seedBasicData();
        token = await getAuthToken(app);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/categoriasAtendimento", () => {
        it("deve criar uma nova categoria", async () => {
            const response = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "SUV" });

            expect(response.status).toBe(201);
            expect(response.body.descricao).toBe("SUV");
        });

        it("deve retornar erro 400 ao criar categoria sem descrição", async () => {
            const response = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error");
        });

        it("deve retornar erro 409 ao criar categoria duplicada", async () => {
            // Criar a primeira categoria
            await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste Duplicada" });

            // Tentar criar novamente
            const response = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Teste Duplicada",
                });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty("error");
        });

        it("deve retornar erro 401 sem token de autenticação", async () => {
            const response = await request(app)
                .post("/api/categoriasVeiculo")
                .send({
                    descricao: "Sem Auth",
                });

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/categoriasAtendimento", () => {
        it("deve listar todas as categorias", async () => {
            const response = await request(app)
                .get("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("deve retornar erro 401 sem token de autenticação", async () => {
            const response = await request(app).get("/api/categoriasVeiculo");

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/categoriasVeiculo/:id", () => {
        it("deve buscar uma categoria de veículo por ID", async () => {
            // Criar categoria primeiro
            const createResponse = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste Get ID" });

            const testId = createResponse.body.id;

            const response = await request(app)
                .get(`/api/categoriasVeiculo/${testId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testId);
            expect(response.body).toHaveProperty("descricao");
        });

        it("deve retornar erro 404 para ID inexistente", async () => {
            const response = await request(app)
                .get("/api/categoriasVeiculo/999999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error");
        });

        it("deve retornar erro 401 sem token de autenticação", async () => {
            const response = await request(app).get(`/api/categoriasVeiculo/1`);

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/categoriasVeiculo/descricao/:descricao", () => {
        it("deve buscar uma categoria de veículo por descrição", async () => {
            // Criar categoria primeiro
            await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste Descricao" });

            const response = await request(app)
                .get("/api/categoriasVeiculo/descricao/Teste Descricao")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("descricao", "Teste Descricao");
        });

        it("deve retornar erro 404 para descrição inexistente", async () => {
            const response = await request(app)
                .get("/api/categoriasVeiculo/descricao/Inexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error");
        });

        it("deve retornar erro 401 sem token de autenticação", async () => {
            const response = await request(app).get(
                "/api/categoriasVeiculo/descricao/Teste Dúvida"
            );

            expect(response.status).toBe(401);
        });
    });

    describe("PUT /api/categoriasVeiculo/:id", () => {
        it("deve atualizar uma categoria de veículo", async () => {
            // Criar categoria primeiro
            const createResponse = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste Update" });

            const testId = createResponse.body.id;

            const response = await request(app)
                .put(`/api/categoriasVeiculo/${testId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Teste Update Atualizada",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testId);
            expect(response.body.descricao).toBe("Teste Update Atualizada");
        });

        it("deve retornar erro 404 ao atualizar categoria inexistente", async () => {
            const response = await request(app)
                .put("/api/categoriasVeiculo/999999")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Teste",
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error");
        });

        it("deve retornar erro 409 ao atualizar com descrição duplicada", async () => {
            // Criar primeira categoria
            const createResponse1 = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Primeira Categoria" });

            // Criar segunda categoria
            await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Segunda Categoria",
                });

            // Tentar atualizar a primeira categoria com a descrição da segunda
            const response = await request(app)
                .put(`/api/categoriasVeiculo/${createResponse1.body.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Segunda Categoria",
                });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty("error");
        });

        it("deve retornar erro 401 sem token de autenticação", async () => {
            const response = await request(app)
                .put(`/api/categoriasVeiculo/1`)
                .send({
                    descricao: "Sem Auth",
                });

            expect(response.status).toBe(401);
        });
    });

    describe("DELETE /api/categoriasVeiculo/:id", () => {
        it("deve retornar erro 401 sem token de autenticação", async () => {
            const response = await request(app).delete(
                `/api/categoriasVeiculo/1`
            );

            expect(response.status).toBe(401);
        });

        it("deve retornar erro 404 ao deletar categoria inexistente", async () => {
            const response = await request(app)
                .delete("/api/categoriasVeiculo/999999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error");
        });

        it("deve deletar uma categoria de veículo", async () => {
            // Criar categoria primeiro
            const createResponse = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste Delete" });

            const response = await request(app)
                .delete(`/api/categoriasVeiculo/${createResponse.body.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(204);
        });

        it("deve confirmar que a categoria foi deletada", async () => {
            // Criar e deletar categoria
            const createResponse = await request(app)
                .post("/api/categoriasVeiculo")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste Confirmacao Delete" });

            await request(app)
                .delete(`/api/categoriasVeiculo/${createResponse.body.id}`)
                .set("Authorization", `Bearer ${token}`);

            // Tentar buscar a categoria deletada
            const response = await request(app)
                .get(`/api/categoriasAtendimento/${createResponse.body.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
