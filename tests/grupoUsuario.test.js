/**
 * Testes para rotas de grupo de usuário
 * Endpoints: /api/grupoUsuario
 */
const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const {
    cleanDatabase,
    getAuthToken,
    seedBasicData,
    prisma,
} = require("./testUtils");

describe("Grupo de Usuário - /api/grupoUsuario", () => {
    let grupoTeste;
    let seedData;
    let token;

    beforeAll(async () => {
        await cleanDatabase();
        // Criar dados básicos necessários para autenticação
        seedData = await seedBasicData();
        token = await getAuthToken(app);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/grupoUsuario", () => {
        it("deve criar um novo grupo de usuário", async () => {
            const grupoData = {
                descricao: "Novo grupo Teste",
            };

            const response = await request(app)
                .post("/api/grupoUsuario")
                .set("Authorization", `Bearer ${token}`)
                .send(grupoData);

            expect(response.status).toBe(201);
            expect(response.body.descricao).toBe("Novo grupo Teste");

            // Salvar o grupo criado para usar nos demais testes
            grupoTeste = response.body;
        });

        it("deve validar ausência de descricao", async () => {
            const response = await request(app)
                .post("/api/grupoUsuario")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                });

            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/grupoUsuario", () => {
        it("deve listar todos os grupos de usuário", async () => {
            const response = await request(app)
                .get("/api/grupoUsuario")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/grupoUsuario/:id", () => {
        it("deve buscar grupo de usuário por ID", async () => {
            const response = await request(app)
                .get(`/api/grupoUsuario/${grupoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(grupoTeste.id);
            expect(response.body.descricao).toBe("Novo grupo Teste");
        });

        it("deve retornar 404 para grupo inexistente", async () => {
            const response = await request(app)
                .get("/api/grupoUsuario/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/grupoUsuario/descricao/exact/:descricao", () => {
        it("deve buscar grupo por descrição exata", async () => {
            const response = await request(app)
                .get(`/api/grupoUsuario/descricao/exact/${encodeURIComponent(grupoTeste.descricao)}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.descricao).toBe(grupoTeste.descricao);
        });

        it("deve retornar 404 quando nenhum grupo for encontrado", async () => {
            const response = await request(app)
                .get("/api/grupoUsuario/descricao/exact/Inexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/grupoUsuario/descricao/search/:descricao", () => {
        it("deve buscar grupos por descrição parcial", async () => {
            const response = await request(app)
                .get(`/api/grupoUsuario/descricao/search/${encodeURIComponent("Novo")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.some(g => g.descricao.includes("Novo"))).toBe(true);
        });

        it("deve retornar 404 quando nenhum grupo for encontrado", async () => {
            const response = await request(app)
                .get("/api/grupoUsuario/descricao/search/XYZInexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("PUT /api/grupoUsuario/:id", () => {
        it("deve atualizar um grupo existente", async () => {
            const response = await request(app)
                .put(`/api/grupoUsuario/${grupoTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "grupo Teste Atualizado",
                });

            expect(response.status).toBe(200);
            expect(response.body.descricao).toBe("grupo Teste Atualizado");

            // Atualizar a referência local
            grupoTeste = response.body;
        });

        it("deve retornar 404 ao atualizar grupo inexistente", async () => {
            const response = await request(app)
                .put("/api/grupoUsuario/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste" });

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /api/grupoUsuario/:id", () => {
        it("deve retornar 404 ao excluir grupo inexistente", async () => {
            const response = await request(app)
                .delete("/api/grupoUsuario/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it("deve excluir um grupo existente", async () => {
            const response = await request(app)
                .delete(`/api/grupoUsuario/${grupoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(204);

            // Verificar que foi realmente deletado
            const verificacao = await prisma.grupoUsuario.findUnique({
                where: { id: grupoTeste.id },
            });
            expect(verificacao).toBeNull();
        });
    });
});
