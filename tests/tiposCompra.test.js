/**
 * Testes para rotas de Tipos de Compra
 * Endpoints: /api/tiposCompra
 */

const request = require("supertest");
const app = require("../src/app");
const {
    cleanDatabase,
    seedBasicData,
    getAuthToken,
    prisma,
} = require("./testUtils");

describe("Tipos de Compra - /api/tiposCompra", () => {
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

    it("deve listar todos os tipos de compra", async () => {
        const response = await request(app)
            .get("/api/tiposCompra")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve criar um novo tipo de compra", async () => {
        const response = await request(app)
            .post("/api/tiposCompra")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "LEILÃO" });

        expect(response.status).toBe(201);
        expect(response.body.descricao).toBe("LEILÃO");
    });

    it("deve buscar tipo de compra por ID", async () => {
        const response = await request(app)
            .get(`/api/tiposCompra/${seedData.tipoCompra.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(seedData.tipoCompra.id);
    });

    it("deve atualizar um tipo de compra", async () => {
        const response = await request(app)
            .put(`/api/tiposCompra/${seedData.tipoCompra.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "COMPRA DIRETA ATUALIZADA" });

        expect(response.status).toBe(200);
        expect(response.body.descricao).toBe("COMPRA DIRETA ATUALIZADA");
    });

    it("deve retornar 404 para tipo de compra inexistente", async () => {
        const response = await request(app)
            .get("/api/tiposCompra/99999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it("deve rejeitar criação com descrição duplicada", async () => {
        await request(app)
            .post("/api/tiposCompra")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "CONSIGNADO" });

        const response = await request(app)
            .post("/api/tiposCompra")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "CONSIGNADO" });

        expect(response.status).toBe(409);
        expect(response.body.error).toContain("existe");
    });

    it("deve rejeitar criação sem descrição", async () => {
        const response = await request(app)
            .post("/api/tiposCompra")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("Campos obrigatórios ausentes");
    });

    it("deve buscar tipo de compra por descrição", async () => {
        const tipo = await prisma.tipoCompra.create({
            data: { descricao: "FINANCIAMENTO" },
        });

        const response = await request(app)
            .get(`/api/tiposCompra/descricao/${tipo.descricao}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.descricao).toBe("FINANCIAMENTO");
    });

    it("deve excluir um tipo de compra", async () => {
        const tipo = await prisma.tipoCompra.create({
            data: { descricao: "PERMUTA" },
        });

        const response = await request(app)
            .delete(`/api/tiposCompra/${tipo.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(204);

        const verificacao = await prisma.tipoCompra.findUnique({
            where: { id: tipo.id },
        });
        expect(verificacao).toBeNull();
    });

    it("deve rejeitar atualização com descrição duplicada", async () => {
        const tipo1 = await prisma.tipoCompra.create({
            data: { descricao: "TIPO1" },
        });

        const tipo2 = await prisma.tipoCompra.create({
            data: { descricao: "TIPO2" },
        });

        const response = await request(app)
            .put(`/api/tiposCompra/${tipo2.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "TIPO1" });

        expect(response.status).toBe(409);
        expect(response.body.error).toContain("existe");
    });

    it("deve retornar 404 ao tentar atualizar tipo inexistente", async () => {
        const response = await request(app)
            .put("/api/tiposCompra/99999")
            .set("Authorization", `Bearer ${token}`)
            .send({ descricao: "TESTE" });

        expect(response.status).toBe(404);
    });

    it("deve retornar 404 ao tentar excluir tipo inexistente", async () => {
        const response = await request(app)
            .delete("/api/tiposCompra/99999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
    });
});
