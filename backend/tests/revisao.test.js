/**
 * Testes para rotas de revisão
 * Endpoints: /api/revisao
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

describe("Revisao - /api/revisao", () => {
    let token;
    let revisaoTeste;
    let seedData;
    let disciplinaTeste;
    let topicoTeste;

    beforeAll(async () => {
        await cleanDatabase();

        // Criar dados básicos necessários para autenticação
        seedData = await seedBasicData();

        token = await getAuthToken(app);

        // Criar disciplina para os testes
        disciplinaTeste = await prisma.disciplina.create({
            data: {
                titulo: "Disciplina Teste Revisão",
                planoId: seedData.planoEstudo.id,
            },
        });

        // Criar tópico para os testes
        topicoTeste = await prisma.topico.create({
            data: {
                titulo: "Tópico Teste Revisão",
                ordem: 1,
                disciplinaId: disciplinaTeste.id,
            },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/revisao", () => {
        it("deve criar uma nova revisão", async () => {
            const revisaoData = {
                numero: 1,
                dataProgramada: new Date("2026-02-01T10:00:00.000Z"),
                planoEstudoId: seedData.planoEstudo.id,
                disciplinaId: disciplinaTeste.id,
                topicoId: topicoTeste.id,
                situacaoRevisao: "AGENDADA",
            };

            const response = await request(app)
                .post("/api/revisao")
                .set("Authorization", `Bearer ${token}`)
                .send(revisaoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.numero).toBe(1);
            expect(response.body.planoEstudoId).toBe(seedData.planoEstudo.id);
            expect(response.body.disciplinaId).toBe(disciplinaTeste.id);
            expect(response.body.topicoId).toBe(topicoTeste.id);
            expect(response.body.situacaoRevisao).toBe("AGENDADA");

            // Salvar a revisão criada para usar nos demais testes
            revisaoTeste = response.body;
        });

        it("deve rejeitar criação de revisão duplicada (mesmo número e tópico)", async () => {
            const revisaoData = {
                numero: 1,
                dataProgramada: new Date("2026-02-01T10:00:00.000Z"),
                planoEstudoId: seedData.planoEstudo.id,
                disciplinaId: disciplinaTeste.id,
                topicoId: topicoTeste.id,
            };

            const response = await request(app)
                .post("/api/revisao")
                .set("Authorization", `Bearer ${token}`)
                .send(revisaoData);

            expect(response.status).toBe(HttpStatus.CONFLICT);
            expect(response.body.error).toMatch(/já existe/i);
        });

        it("deve permitir criar revisão com mesmo número em tópico diferente", async () => {
            // Criar outro tópico
            const outroTopico = await prisma.topico.create({
                data: {
                    titulo: "Outro Tópico",
                    ordem: 2,
                    disciplinaId: disciplinaTeste.id,
                },
            });

            const revisaoData = {
                numero: 1,
                dataProgramada: new Date("2026-02-01T10:00:00.000Z"),
                planoEstudoId: seedData.planoEstudo.id,
                disciplinaId: disciplinaTeste.id,
                topicoId: outroTopico.id,
            };

            const response = await request(app)
                .post("/api/revisao")
                .set("Authorization", `Bearer ${token}`)
                .send(revisaoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.topicoId).toBe(outroTopico.id);
        });

        it("deve validar ausência de campos obrigatórios", async () => {
            const response = await request(app)
                .post("/api/revisao")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("deve rejeitar criação com plano inexistente", async () => {
            const revisaoData = {
                numero: 2,
                dataProgramada: new Date("2026-02-01T10:00:00.000Z"),
                planoEstudoId: 99999,
                disciplinaId: disciplinaTeste.id,
                topicoId: topicoTeste.id,
            };

            const response = await request(app)
                .post("/api/revisao")
                .set("Authorization", `Bearer ${token}`)
                .send(revisaoData);

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe("GET /api/revisao", () => {
        it("deve listar todas as revisões", async () => {
            const response = await request(app)
                .get("/api/revisao")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("deve negar acesso sem token", async () => {
            const response = await request(app).get("/api/revisao");

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });

    describe("GET /api/revisao/:id", () => {
        it("deve buscar revisão por ID", async () => {
            const response = await request(app)
                .get(`/api/revisao/${revisaoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toBe(revisaoTeste.id);
            expect(response.body.numero).toBe(1);
        });

        it("deve retornar 404 para revisão inexistente", async () => {
            const response = await request(app)
                .get("/api/revisao/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/revisao/planoEstudo/:planoEstudoId", () => {
        it("deve buscar revisões por plano de estudo", async () => {
            const response = await request(app)
                .get(`/api/revisao/planoEstudo/${seedData.planoEstudo.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].planoEstudoId).toBe(seedData.planoEstudo.id);
        });

        it("deve retornar 404 quando não houver revisões no plano", async () => {
            // Criar plano vazio
            const planoVazio = await prisma.planoEstudo.create({
                data: {
                    titulo: "Plano Vazio Revisão",
                    situacao: "NOVO",
                    usuarioId: seedData.usuario.id,
                },
            });

            const response = await request(app)
                .get(`/api/revisao/planoEstudo/${planoVazio.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/revisao/disciplina/:disciplinaId", () => {
        it("deve buscar revisões por disciplina", async () => {
            const response = await request(app)
                .get(`/api/revisao/disciplina/${disciplinaTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].disciplinaId).toBe(disciplinaTeste.id);
        });

        it("deve retornar 404 quando não houver revisões na disciplina", async () => {
            // Criar disciplina sem revisões
            const disciplinaSemRevisoes = await prisma.disciplina.create({
                data: {
                    titulo: "Disciplina Sem Revisões",
                    planoId: seedData.planoEstudo.id,
                },
            });

            const response = await request(app)
                .get(`/api/revisao/disciplina/${disciplinaSemRevisoes.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/revisao/topico/:topicoId", () => {
        it("deve buscar revisões por tópico", async () => {
            const response = await request(app)
                .get(`/api/revisao/topico/${topicoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].topicoId).toBe(topicoTeste.id);
        });

        it("deve retornar 404 quando não houver revisões no tópico", async () => {
            // Criar tópico sem revisões
            const topicoSemRevisoes = await prisma.topico.create({
                data: {
                    titulo: "Tópico Sem Revisões",
                    ordem: 3,
                    disciplinaId: disciplinaTeste.id,
                },
            });

            const response = await request(app)
                .get(`/api/revisao/topico/${topicoSemRevisoes.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("PUT /api/revisao/:id", () => {
        it("deve atualizar uma revisão", async () => {
            const updateData = {
                dataRealizada: new Date("2026-02-01T11:00:00.000Z"),
                tempoEstudo: 2.5,
                questoesAcertos: 8,
                questoesErros: 2,
                desempenho: 80.0,
                concluida: true,
                situacaoRevisao: "CONCLUIDA",
            };

            const response = await request(app)
                .put(`/api/revisao/${revisaoTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updateData);

            expect(response.status).toBe(HttpStatus.OK);
            expect(parseFloat(response.body.tempoEstudo)).toBe(2.5);
            expect(response.body.questoesAcertos).toBe(8);
            expect(response.body.questoesErros).toBe(2);
            expect(parseFloat(response.body.desempenho)).toBe(80.0);
            expect(response.body.concluida).toBe(true);
            expect(response.body.situacaoRevisao).toBe("CONCLUIDA");
        });

        it("deve retornar 404 ao tentar atualizar revisão inexistente", async () => {
            const response = await request(app)
                .put("/api/revisao/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ concluida: true });

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("DELETE /api/revisao/:id", () => {
        it("deve excluir uma revisão", async () => {
            // Criar uma revisão para excluir
            const revisaoParaExcluir = await prisma.revisao.create({
                data: {
                    numero: 5,
                    dataProgramada: new Date("2026-03-01T10:00:00.000Z"),
                    planoEstudoId: seedData.planoEstudo.id,
                    disciplinaId: disciplinaTeste.id,
                    topicoId: topicoTeste.id,
                    situacaoRevisao: "AGENDADA",
                },
            });

            const response = await request(app)
                .delete(`/api/revisao/${revisaoParaExcluir.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);

            // Verificar se foi excluída
            const checkResponse = await request(app)
                .get(`/api/revisao/${revisaoParaExcluir.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(checkResponse.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve retornar 404 ao tentar excluir revisão inexistente", async () => {
            const response = await request(app)
                .delete("/api/revisao/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });
});
