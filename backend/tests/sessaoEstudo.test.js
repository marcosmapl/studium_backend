/**
 * Testes para rotas de sessão de estudo
 * Endpoints: /api/sessaoEstudo
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

describe("Sessão de Estudo - /api/sessaoEstudo", () => {
    let token;
    let sessaoTeste;
    let planoEstudoTeste;
    let disciplinaTeste;
    let topicoTeste;
    let blocoEstudoTeste;

    beforeAll(async () => {
        await cleanDatabase();

        // Criar dados básicos necessários para autenticação
        const basicData = await seedBasicData();
        planoEstudoTeste = basicData.planoEstudo;

        token = await getAuthToken(app);

        // Criar disciplina de teste
        disciplinaTeste = await prisma.disciplina.create({
            data: {
                titulo: "Disciplina Teste",
                planoId: planoEstudoTeste.id,
            },
        });

        // Criar tópico de teste
        topicoTeste = await prisma.topico.create({
            data: {
                titulo: "Tópico Teste",
                ordem: 1,
                disciplinaId: disciplinaTeste.id,
            },
        });

        // Criar bloco de estudo (opcional)
        blocoEstudoTeste = await prisma.blocoEstudo.create({
            data: {
                ordem: 1,
                diaSemana: 1,
                totalHorasPlanejadas: 2.0,
                planoEstudoId: planoEstudoTeste.id,
                disciplinaId: disciplinaTeste.id,
            },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/sessaoEstudo", () => {
        it("deve criar uma nova sessão de estudo", async () => {
            const sessaoData = {
                planoEstudoId: planoEstudoTeste.id,
                disciplinaId: disciplinaTeste.id,
                topicoId: topicoTeste.id,
                blocoEstudoId: blocoEstudoTeste.id,
                categoriaSessao: "TEORIA",
                situacaoSessao: "AGENDADA",
                questoesAcertos: 10,
                questoesErros: 2,
                tempoEstudo: 2.5,
                paginasLidas: 15,
                topicoFinalizado: false,
                concluida: false,
            };

            const response = await request(app)
                .post("/api/sessaoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send(sessaoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.planoEstudoId).toBe(planoEstudoTeste.id);
            expect(response.body.disciplinaId).toBe(disciplinaTeste.id);
            expect(response.body.topicoId).toBe(topicoTeste.id);
            expect(response.body.categoriaSessao).toBe("TEORIA");
            expect(response.body.situacaoSessao).toBe("AGENDADA");

            // Salvar a sessão criada para usar nos demais testes
            sessaoTeste = response.body;
        });

        it("deve validar campos obrigatórios", async () => {
            const response = await request(app)
                .post("/api/sessaoEstudo")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                    planoEstudoId: planoEstudoTeste.id,
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe("GET /api/sessaoEstudo", () => {
        it("deve listar todas as sessões de estudo", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/sessaoEstudo/:id", () => {
        it("deve buscar sessão de estudo por ID", async () => {
            const response = await request(app)
                .get(`/api/sessaoEstudo/${sessaoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toBe(sessaoTeste.id);
            expect(response.body.planoEstudoId).toBe(planoEstudoTeste.id);
        });

        it("deve retornar 404 para sessão inexistente", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/sessaoEstudo/planoEstudo/:planoEstudoId", () => {
        it("deve buscar sessões de estudo por plano de estudo", async () => {
            const response = await request(app)
                .get(`/api/sessaoEstudo/planoEstudo/${planoEstudoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].planoEstudoId).toBe(planoEstudoTeste.id);
        });

        it("deve retornar array vazio quando não houver sessões para o plano", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/planoEstudo/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/sessaoEstudo/disciplina/:disciplinaId", () => {
        it("deve buscar sessões de estudo por disciplina", async () => {
            const response = await request(app)
                .get(`/api/sessaoEstudo/disciplina/${disciplinaTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].disciplinaId).toBe(disciplinaTeste.id);
        });

        it("deve retornar array vazio quando não houver sessões para a disciplina", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/disciplina/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/sessaoEstudo/topico/:topicoId", () => {
        it("deve buscar sessões de estudo por tópico", async () => {
            const response = await request(app)
                .get(`/api/sessaoEstudo/topico/${topicoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].topicoId).toBe(topicoTeste.id);
        });

        it("deve retornar array vazio quando não houver sessões para o tópico", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/topico/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/sessaoEstudo/blocoEstudo/:blocoEstudoId", () => {
        it("deve buscar sessões de estudo por bloco de estudo", async () => {
            const response = await request(app)
                .get(`/api/sessaoEstudo/blocoEstudo/${blocoEstudoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].blocoEstudoId).toBe(blocoEstudoTeste.id);
        });

        it("deve retornar array vazio quando não houver sessões para o bloco", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/blocoEstudo/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/sessaoEstudo/categoria/:categoriaSessao", () => {
        it("deve buscar sessões de estudo por categoria", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/categoria/TEORIA")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].categoriaSessao).toBe("TEORIA");
        });

        it("deve retornar array vazio quando não houver sessões para a categoria", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/categoria/LEITURA")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/sessaoEstudo/situacao/:situacaoSessao", () => {
        it("deve buscar sessões de estudo por situação", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/situacao/AGENDADA")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].situacaoSessao).toBe("AGENDADA");
        });

        it("deve retornar array vazio quando não houver sessões para a situação", async () => {
            const response = await request(app)
                .get("/api/sessaoEstudo/situacao/CONCLUIDA")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("PUT /api/sessaoEstudo/:id", () => {
        it("deve atualizar uma sessão de estudo existente", async () => {
            const response = await request(app)
                .put(`/api/sessaoEstudo/${sessaoTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    questoesAcertos: 15,
                    questoesErros: 1,
                    tempoEstudo: 3.0,
                    topicoFinalizado: true,
                });

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.questoesAcertos).toBe(15);
            expect(response.body.topicoFinalizado).toBe(true);

            // Atualizar a referência local
            sessaoTeste = response.body;
        });

        it("deve retornar 404 ao atualizar sessão inexistente", async () => {
            const response = await request(app)
                .put("/api/sessaoEstudo/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ questoesAcertos: 5 });

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("DELETE /api/sessaoEstudo/:id", () => {
        it("deve retornar 404 ao excluir sessão inexistente", async () => {
            const response = await request(app)
                .delete("/api/sessaoEstudo/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve excluir uma sessão de estudo existente", async () => {
            const response = await request(app)
                .delete(`/api/sessaoEstudo/${sessaoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NO_CONTENT);

            // Verificar que foi realmente deletado
            const verificacao = await prisma.sessaoEstudo.findUnique({
                where: { id: sessaoTeste.id },
            });
            expect(verificacao).toBeNull();
        });
    });
});
