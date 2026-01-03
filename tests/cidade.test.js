/**
 * Testes para rotas de cidade
 * Endpoints: /api/cidade
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

describe("Cidade - /api/cidade", () => {
    let cidadeTeste;
    let unidadeFederativa;
    let token;

    beforeAll(async () => {
        await cleanDatabase();
        // Criar dados básicos necessários para autenticação
        const seedData = await seedBasicData();
        unidadeFederativa = seedData.unidadeFederativa;
        token = await getAuthToken(app);
    });

    describe("POST /api/cidade", () => {
        it("deve criar uma nova cidade", async () => {
            const cidadeData = {
                descricao: "Nova Cidade Teste",
                unidadeFederativaId: unidadeFederativa.id,
            };

            const response = await request(app)
                .post("/api/cidade")
                .set("Authorization", `Bearer ${token}`)
                .send(cidadeData);

            expect(response.status).toBe(201);
            expect(response.body.descricao).toBe("Nova Cidade Teste");
            expect(response.body.unidadeFederativaId).toBe(unidadeFederativa.id);

            // Salvar a cidade criada para usar nos demais testes
            cidadeTeste = response.body;
        });

        it("deve validar ausência de campos obrigatórios", async () => {
            const response = await request(app)
                .post("/api/cidade")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                });

            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/cidade", () => {
        it("deve listar todas as cidades", async () => {
            const response = await request(app)
                .get("/api/cidade")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/cidade/:id", () => {
        it("deve buscar cidade por ID", async () => {
            const response = await request(app)
                .get(`/api/cidade/${cidadeTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(cidadeTeste.id);
            expect(response.body.descricao).toBe("Nova Cidade Teste");
        });

        it("deve retornar 404 para cidade inexistente", async () => {
            const response = await request(app)
                .get("/api/cidade/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/cidade/descricao/exact/:descricao", () => {
        it("deve buscar cidade por descrição exata", async () => {
            const response = await request(app)
                .get(
                    `/api/cidade/descricao/exact/${encodeURIComponent(cidadeTeste.descricao)}`
                )
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.descricao).toBe(cidadeTeste.descricao);
        });

        it("deve retornar 404 quando nenhuma cidade for encontrada", async () => {
            const response = await request(app)
                .get("/api/cidade/descricao/exact/CidadeInexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/cidade/descricao/search/:descricao", () => {
        it("deve buscar cidades por descrição parcial", async () => {
            const response = await request(app)
                .get(`/api/cidade/descricao/search/${encodeURIComponent("Nova")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.some((c) => c.descricao.includes("Nova"))).toBe(true);
        });

        it("deve retornar 404 quando nenhuma cidade for encontrada", async () => {
            const response = await request(app)
                .get("/api/cidade/descricao/search/XYZInexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/cidade/uf/:unidadeFederativaId", () => {
        it("deve buscar cidades por Unidade Federativa", async () => {
            const response = await request(app)
                .get(`/api/cidade/uf/${unidadeFederativa.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(
                response.body.every(
                    (c) => c.unidadeFederativaId === unidadeFederativa.id
                )
            ).toBe(true);
        });

        it("deve retornar 404 para UF sem cidades", async () => {
            const response = await request(app)
                .get("/api/cidade/uf/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("PUT /api/cidade/:id", () => {
        it("deve atualizar uma cidade existente", async () => {
            const response = await request(app)
                .put(`/api/cidade/${cidadeTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Cidade Teste Atualizada",
                    unidadeFederativaId: unidadeFederativa.id,
                });

            expect(response.status).toBe(200);
            expect(response.body.descricao).toBe("Cidade Teste Atualizada");

            // Atualizar a referência local
            cidadeTeste = response.body;
        });

        it("deve retornar 404 ao atualizar cidade inexistente", async () => {
            const response = await request(app)
                .put("/api/cidade/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Teste",
                    unidadeFederativaId: unidadeFederativa.id,
                });

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /api/cidade/:id", () => {
        it("deve retornar 404 ao excluir cidade inexistente", async () => {
            const response = await request(app)
                .delete("/api/cidade/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it("deve excluir uma cidade existente", async () => {
            const response = await request(app)
                .delete(`/api/cidade/${cidadeTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(204);

            // Verificar que foi realmente deletado
            const verificacao = await prisma.cidade.findUnique({
                where: { id: cidadeTeste.id },
            });
            expect(verificacao).toBeNull();
        });
    });
});
