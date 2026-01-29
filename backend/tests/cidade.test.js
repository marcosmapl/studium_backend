/**
 * Testes para rotas de cidade
 * Endpoints: /api/cidade
 */
const request = require("supertest");
const app = require("../src/app");
const HttpStatus = require("../src/utils/httpStatus");
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
                unidadeFederativa: unidadeFederativa,
            };

            const response = await request(app)
                .post("/api/cidade")
                .set("Authorization", `Bearer ${token}`)
                .send(cidadeData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.descricao).toBe("Nova Cidade Teste");
            expect(response.body.unidadeFederativa).toBe(unidadeFederativa);

            // Salvar a cidade criada para usar nos demais testes
            cidadeTeste = response.body;
        });

        it("deve rejeitar criação de cidade duplicada na mesma UF", async () => {
            const cidadeData = {
                descricao: "Nova Cidade Teste",
                unidadeFederativa: unidadeFederativa,
            };

            const response = await request(app)
                .post("/api/cidade")
                .set("Authorization", `Bearer ${token}`)
                .send(cidadeData);

            expect(response.status).toBe(HttpStatus.CONFLICT);
            expect(response.body.error).toMatch(/já existe/i);
        });

        it("deve permitir criar cidade com mesmo nome em UF diferente", async () => {
            const cidadeData = {
                descricao: "Nova Cidade Teste",
                unidadeFederativa: 'SP',
            };

            const response = await request(app)
                .post("/api/cidade")
                .set("Authorization", `Bearer ${token}`)
                .send(cidadeData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.descricao).toBe("Nova Cidade Teste");
            expect(response.body.unidadeFederativa).toBe('SP');
        });

        it("deve validar ausência de campos obrigatórios", async () => {
            const response = await request(app)
                .post("/api/cidade")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe("GET /api/cidade", () => {
        it("deve listar todas as cidades", async () => {
            const response = await request(app)
                .get("/api/cidade")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/cidade/:id", () => {
        it("deve buscar cidade por ID", async () => {
            const response = await request(app)
                .get(`/api/cidade/${cidadeTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toBe(cidadeTeste.id);
            expect(response.body.descricao).toBe("Nova Cidade Teste");
        });

        it("deve retornar 404 para cidade inexistente", async () => {
            const response = await request(app)
                .get("/api/cidade/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/cidade/descricao/:descricao/uf/:unidadeFederativa", () => {
        it("deve buscar cidade por descrição e UF", async () => {
            const response = await request(app)
                .get(
                    `/api/cidade/descricao/${encodeURIComponent(cidadeTeste.descricao)}/uf/${cidadeTeste.unidadeFederativa}`
                )
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toBeDefined();
            expect(response.body.descricao).toBe(cidadeTeste.descricao);
            expect(response.body.unidadeFederativa).toBe(cidadeTeste.unidadeFederativa);
        });

        it("deve retornar 404 quando nenhuma cidade for encontrada", async () => {
            const response = await request(app)
                .get(`/api/cidade/descricao/CidadeInexistente/uf/${unidadeFederativa}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve permitir cidades com mesmo nome em UFs diferentes", async () => {
            // Criar cidade com mesmo nome da cidadeTeste, mas em outra UF
            const cidadeMesmoNome = await prisma.cidade.create({
                data: {
                    descricao: cidadeTeste.descricao,
                    unidadeFederativa: 'RJ'
                }
            });

            // Buscar a cidade original
            const response1 = await request(app)
                .get(
                    `/api/cidade/descricao/${encodeURIComponent(cidadeTeste.descricao)}/uf/${cidadeTeste.unidadeFederativa}`
                )
                .set("Authorization", `Bearer ${token}`);

            // Buscar a cidade na outra UF
            const response2 = await request(app)
                .get(
                    `/api/cidade/descricao/${encodeURIComponent(cidadeTeste.descricao)}/uf/RJ`
                )
                .set("Authorization", `Bearer ${token}`);

            expect(response1.status).toBe(HttpStatus.OK);
            expect(response2.status).toBe(HttpStatus.OK);
            expect(response1.body.id).toBe(cidadeTeste.id);
            expect(response2.body.id).toBe(cidadeMesmoNome.id);
            expect(response1.body.id).not.toBe(response2.body.id);
        });
    });

    describe("GET /api/cidade/descricao/search/:descricao", () => {
        it("deve buscar cidades por descrição parcial", async () => {
            const response = await request(app)
                .get(`/api/cidade/descricao/search/${encodeURIComponent("Nova")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.some((c) => c.descricao.includes("Nova"))).toBe(true);
        });

        it("deve retornar array vazio quando nenhuma cidade for encontrada", async () => {
            const response = await request(app)
                .get("/api/cidade/descricao/search/XYZInexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/cidade/uf/:unidadeFederativa", () => {
        it("deve buscar cidades por Unidade Federativa", async () => {
            const response = await request(app)
                .get(`/api/cidade/uf/${unidadeFederativa}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(
                response.body.every(
                    (c) => c.unidadeFederativa === unidadeFederativa
                )
            ).toBe(true);
        });

        it("deve retornar array vazio para UF sem cidades", async () => {
            const response = await request(app)
                .get("/api/cidade/uf/DF")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("PUT /api/cidade/:id", () => {
        it("deve atualizar uma cidade existente", async () => {
            const response = await request(app)
                .put(`/api/cidade/${cidadeTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    descricao: "Cidade Teste Atualizada",
                    unidadeFederativa: unidadeFederativa,
                });

            expect(response.status).toBe(HttpStatus.OK);
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
                    unidadeFederativa: unidadeFederativa,
                });

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("DELETE /api/cidade/:id", () => {
        it("deve retornar 404 ao excluir cidade inexistente", async () => {
            const response = await request(app)
                .delete("/api/cidade/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve excluir uma cidade existente", async () => {
            const response = await request(app)
                .delete(`/api/cidade/${cidadeTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NO_CONTENT);

            // Verificar que foi realmente deletado
            const verificacao = await prisma.cidade.findUnique({
                where: { id: cidadeTeste.id },
            });
            expect(verificacao).toBeNull();
        });
    });
});
