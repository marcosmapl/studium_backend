/**
 * Testes para rotas de bloco de estudo
 * Endpoints: /api/blocoEstudo
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

describe("BlocoEstudo - /api/blocoEstudo", () => {
    let token;
    let blocoEstudoTeste;
    let seedData;
    let disciplinaTeste;

    beforeAll(async () => {
        await cleanDatabase();

        // Criar dados básicos necessários para autenticação
        seedData = await seedBasicData();

        token = await getAuthToken(app);

        // Criar disciplina para os testes
        disciplinaTeste = await prisma.disciplina.create({
            data: {
                titulo: "Disciplina Teste Bloco",
                planoId: seedData.planoEstudo.id,
                horasSemanais: 10.0,
            },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/blocoEstudo", () => {
        it("deve criar um novo bloco de estudo", async () => {
            const blocoData = {
                ordem: 1,
                diaSemana: 1, // Segunda-feira
                totalHorasPlanejadas: 2.5,
                planoEstudoId: seedData.planoEstudo.id,
                disciplinaId: disciplinaTeste.id,
            };

            const response = await request(app)
                .post("/api/blocoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send(blocoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.ordem).toBe(1);
            expect(response.body.diaSemana).toBe(1);
            expect(parseFloat(response.body.totalHorasPlanejadas)).toBe(2.5);
            expect(response.body.planoEstudoId).toBe(seedData.planoEstudo.id);
            expect(response.body.disciplinaId).toBe(disciplinaTeste.id);

            // Salvar o bloco criado para usar nos demais testes
            blocoEstudoTeste = response.body;
        });

        it("deve rejeitar criação de bloco duplicado (mesmo plano, dia e ordem)", async () => {
            const blocoData = {
                ordem: 1,
                diaSemana: 1,
                totalHorasPlanejadas: 3.0,
                planoEstudoId: seedData.planoEstudo.id,
                disciplinaId: disciplinaTeste.id,
            };

            const response = await request(app)
                .post("/api/blocoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send(blocoData);

            expect(response.status).toBe(HttpStatus.CONFLICT);
            expect(response.body.error).toMatch(/já existe/i);
        });

        it("deve permitir criar bloco com mesma ordem em dia diferente", async () => {
            const blocoData = {
                ordem: 1,
                diaSemana: 2, // Terça-feira
                totalHorasPlanejadas: 2.0,
                planoEstudoId: seedData.planoEstudo.id,
                disciplinaId: disciplinaTeste.id,
            };

            const response = await request(app)
                .post("/api/blocoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send(blocoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.diaSemana).toBe(2);
        });

        it("deve validar ausência de campos obrigatórios", async () => {
            const response = await request(app)
                .post("/api/blocoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("deve rejeitar criação com plano inexistente", async () => {
            const blocoData = {
                ordem: 1,
                diaSemana: 0,
                totalHorasPlanejadas: 2.0,
                planoEstudoId: 99999,
                disciplinaId: disciplinaTeste.id,
            };

            const response = await request(app)
                .post("/api/blocoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send(blocoData);

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("deve rejeitar criação com disciplina inexistente", async () => {
            const blocoData = {
                ordem: 2,
                diaSemana: 0,
                totalHorasPlanejadas: 2.0,
                planoEstudoId: seedData.planoEstudo.id,
                disciplinaId: 99999,
            };

            const response = await request(app)
                .post("/api/blocoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send(blocoData);

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe("GET /api/blocoEstudo", () => {
        it("deve listar todos os blocos de estudo", async () => {
            const response = await request(app)
                .get("/api/blocoEstudo")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("deve negar acesso sem token", async () => {
            const response = await request(app).get("/api/blocoEstudo");

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });

    describe("GET /api/blocoEstudo/:id", () => {
        it("deve buscar bloco de estudo por ID", async () => {
            const response = await request(app)
                .get(`/api/blocoEstudo/${blocoEstudoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toBe(blocoEstudoTeste.id);
            expect(response.body.ordem).toBe(1);
        });

        it("deve retornar 404 para bloco inexistente", async () => {
            const response = await request(app)
                .get("/api/blocoEstudo/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/blocoEstudo/plano/:planoEstudoId/disciplina/:disciplinaId", () => {
        it("deve buscar blocos por plano e disciplina", async () => {
            const response = await request(app)
                .get(`/api/blocoEstudo/plano/${seedData.planoEstudo.id}/disciplina/${disciplinaTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].planoEstudoId).toBe(seedData.planoEstudo.id);
            expect(response.body[0].disciplinaId).toBe(disciplinaTeste.id);
        });

        it("deve retornar array vazio quando não houver blocos", async () => {
            // Criar disciplina sem blocos
            const disciplinaSemBlocos = await prisma.disciplina.create({
                data: {
                    titulo: "Disciplina Sem Blocos",
                    planoId: seedData.planoEstudo.id,
                    horasSemanais: 10.0,
                },
            });

            const response = await request(app)
                .get(`/api/blocoEstudo/plano/${seedData.planoEstudo.id}/disciplina/${disciplinaSemBlocos.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/blocoEstudo/plano/:planoEstudoId", () => {
        it("deve buscar todos os blocos de um plano", async () => {
            const response = await request(app)
                .get(`/api/blocoEstudo/plano/${seedData.planoEstudo.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("deve retornar array vazio quando plano não tiver blocos", async () => {
            // Criar plano vazio
            const planoVazio = await prisma.planoEstudo.create({
                data: {
                    titulo: "Plano Vazio Bloco",
                    situacao: "NOVO",
                    usuarioId: seedData.usuario.id,
                },
            });

            const response = await request(app)
                .get(`/api/blocoEstudo/plano/${planoVazio.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("PUT /api/blocoEstudo/:id", () => {
        it("deve atualizar um bloco de estudo", async () => {
            const updateData = {
                totalHorasPlanejadas: 3.5,
                concluido: true,
            };

            const response = await request(app)
                .put(`/api/blocoEstudo/${blocoEstudoTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updateData);

            expect(response.status).toBe(HttpStatus.OK);
            expect(parseFloat(response.body.totalHorasPlanejadas)).toBe(3.5);
            expect(response.body.concluido).toBe(true);
        });

        it("deve retornar 404 ao tentar atualizar bloco inexistente", async () => {
            const response = await request(app)
                .put("/api/blocoEstudo/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ totalHorasPlanejadas: 2.0 });

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("DELETE /api/blocoEstudo/:id", () => {
        it("deve excluir um bloco de estudo", async () => {
            // Criar um bloco para excluir
            const blocoParaExcluir = await prisma.blocoEstudo.create({
                data: {
                    ordem: 5,
                    diaSemana: 5,
                    totalHorasPlanejadas: 1.5,
                    planoEstudoId: seedData.planoEstudo.id,
                    disciplinaId: disciplinaTeste.id,
                },
            });

            const response = await request(app)
                .delete(`/api/blocoEstudo/${blocoParaExcluir.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);

            // Verificar se foi excluído
            const checkResponse = await request(app)
                .get(`/api/blocoEstudo/${blocoParaExcluir.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(checkResponse.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve retornar 404 ao tentar excluir bloco inexistente", async () => {
            const response = await request(app)
                .delete("/api/blocoEstudo/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });
});
