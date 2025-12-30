/**
 * Testes para rotas de Tipos de Direção
 * Endpoints: /api/tiposDirecao
 */

const request = require("supertest");
const app = require("../src/app");
const {
    cleanDatabase,
    seedBasicData,
    getAuthToken,
    prisma,
} = require("./testUtils");

describe("Tipos de Direção - /api/tiposDirecao", () => {
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

    it("deve listar todos os tipos de direção", async () => {
        const response = await request(app)
            .get("/api/tiposDirecao")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve criar um novo tipo de direção", async () => {
        const response = await request(app)
            .post("/api/tiposDirecao")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "HIDRÁULICA" });

        expect(response.status).toBe(201);
        expect(response.body.descricao).toBe("HIDRÁULICA");
    });

    it("deve buscar tipo de direção por ID", async () => {
        const response = await request(app)
            .get(`/api/tiposDirecao/${seedData.tipoDirecao.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(seedData.tipoDirecao.id);
    });

    it("deve atualizar um tipo de direção", async () => {
        const response = await request(app)
            .put(`/api/tiposDirecao/${seedData.tipoDirecao.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "ELÉTRICA PROGRESSIVA" });

        expect(response.status).toBe(200);
        expect(response.body.descricao).toBe("ELÉTRICA PROGRESSIVA");
    });

    it("deve retornar 404 para tipo de direção inexistente", async () => {
        const response = await request(app)
            .get("/api/tiposDirecao/99999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it("deve rejeitar criação com descrição duplicada", async () => {
        await request(app)
            .post("/api/tiposDirecao")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "ELÉTRICA" });

        const response = await request(app)
            .post("/api/tiposDirecao")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "ELÉTRICA" });

        expect(response.status).toBe(409);
        expect(response.body.error).toContain("existe");
    });

    it("deve rejeitar criação sem descrição", async () => {
        const response = await request(app)
            .post("/api/tiposDirecao")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("Campos obrigatórios ausentes");
    });


    it("deve buscar tipo de direção por descrição", async () => {
        const tipo = await prisma.tipoDirecao.create({
            data: { descricao: "MECÂNICA" },
        });

        const response = await request(app)
            .get(`/api/tiposDirecao/descricao/${tipo.descricao}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.descricao).toBe("MECÂNICA");
    });

    it("deve excluir um tipo de direção", async () => {
        const tipo = await prisma.tipoDirecao.create({
            data: { descricao: "ASSISTIDA" },
        });

        const response = await request(app)
            .delete(`/api/tiposDirecao/${tipo.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(204);

        const verificacao = await prisma.tipoDirecao.findUnique({
            where: { id: tipo.id },
        });
        expect(verificacao).toBeNull();
    });

    it("deve rejeitar atualização com descrição duplicada", async () => {
        const tipo1 = await prisma.tipoDirecao.create({
            data: { descricao: "TIPO1" },
        });

        const tipo2 = await prisma.tipoDirecao.create({
            data: { descricao: "TIPO2" },
        });

        const response = await request(app)
            .put(`/api/tiposDirecao/${tipo2.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "TIPO1" });

        expect(response.status).toBe(409);
        expect(response.body.error).toContain("existe");
    });

    it("deve retornar 404 ao tentar atualizar tipo inexistente", async () => {
        const response = await request(app)
            .put("/api/tiposDirecao/99999")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "TESTE" });

        expect(response.status).toBe(404);
    });

    it("deve retornar 404 ao tentar excluir tipo inexistente", async () => {
        const response = await request(app)
            .delete("/api/tiposDirecao/99999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
    });
});
