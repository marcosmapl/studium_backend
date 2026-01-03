/**
 * Testes para rotas de gênero de usuário
 * Endpoints: /api/generoUsuario
 */
const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const HttpStatus = require("../src/utils/httpStatus");
const {
    cleanDatabase,
    getAuthToken,
    seedBasicData,
    prisma,
} = require("./testUtils");

describe("Gênero de Usuário - /api/generoUsuario", () => {
    let generoTeste;
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

    describe("POST /api/generoUsuario", () => {
        it("deve criar um novo gênero de usuário", async () => {
            const generoData = {
                descricao: "Novo Gênero Teste",
            };

            const response = await request(app)
                .post("/api/generoUsuario")
                .set("Authorization", `Bearer ${token}`)
                .send(generoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.descricao).toBe("Novo Gênero Teste");

            // Salvar o gênero criado para usar nos demais testes
            generoTeste = response.body;
        });

        it("deve validar ausência de descricao", async () => {
            const response = await request(app)
                .post("/api/generoUsuario")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe("GET /api/generoUsuario", () => {
        it("deve listar todos os gêneros de usuário", async () => {
            const response = await request(app)
                .get("/api/generoUsuario")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/generoUsuario/:id", () => {
        it("deve buscar gênero de usuário por ID", async () => {
            const response = await request(app)
                .get(`/api/generoUsuario/${generoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toBe(generoTeste.id);
            expect(response.body.descricao).toBe("Novo Gênero Teste");
        });

        it("deve retornar 404 para gênero inexistente", async () => {
            const response = await request(app)
                .get("/api/generoUsuario/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/generoUsuario/descricao/exact/:descricao", () => {
        it("deve buscar gênero por descrição exata", async () => {
            const response = await request(app)
                .get(`/api/generoUsuario/descricao/exact/${encodeURIComponent(generoTeste.descricao)}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toBeDefined();
            expect(response.body.descricao).toBe(generoTeste.descricao);
        });

        it("deve retornar 404 quando nenhum gênero for encontrado", async () => {
            const response = await request(app)
                .get("/api/generoUsuario/descricao/exact/Inexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/generoUsuario/descricao/search/:descricao", () => {
        it("deve buscar gêneros por descrição parcial", async () => {
            const response = await request(app)
                .get(`/api/generoUsuario/descricao/search/${encodeURIComponent("Novo")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.some(g => g.descricao.includes("Novo"))).toBe(true);
        });

        it("deve retornar 404 quando nenhum gênero for encontrado", async () => {
            const response = await request(app)
                .get("/api/generoUsuario/descricao/search/XYZInexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("PUT /api/generoUsuario/:id", () => {
        it("deve atualizar um gênero existente", async () => {
            const response = await request(app)
                .put(`/api/generoUsuario/${generoTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Gênero Teste Atualizado",
                });

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.descricao).toBe("Gênero Teste Atualizado");

            // Atualizar a referência local
            generoTeste = response.body;
        });

        it("deve retornar 404 ao atualizar gênero inexistente", async () => {
            const response = await request(app)
                .put("/api/generoUsuario/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ descricao: "Teste" });

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("DELETE /api/generoUsuario/:id", () => {
        it("deve retornar 404 ao excluir gênero inexistente", async () => {
            const response = await request(app)
                .delete("/api/generoUsuario/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve excluir um gênero existente", async () => {
            const response = await request(app)
                .delete(`/api/generoUsuario/${generoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NO_CONTENT);

            // Verificar que foi realmente deletado
            const verificacao = await prisma.generoUsuario.findUnique({
                where: { id: generoTeste.id },
            });
            expect(verificacao).toBeNull();
        });
    });
});
