/**
 * Testes para rotas de tópico
 * Endpoints: /api/topico
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

describe("Tópico - /api/topico", () => {
    let token;
    let topicoTeste;
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
                titulo: "Disciplina Teste",
                planoId: seedData.planoEstudo.id,
                horasSemanais: 10.0,
            },
        });

    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/topico", () => {
        it("deve criar um novo tópico", async () => {
            const topicoData = {
                titulo: "Teoria Geral dos Direitos Fundamentais",
                ordem: 1,
                disciplinaId: disciplinaTeste.id,
            };

            const response = await request(app)
                .post("/api/topico")
                .set("Authorization", `Bearer ${token}`)
                .send(topicoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.titulo).toBe("Teoria Geral dos Direitos Fundamentais");
            expect(response.body.ordem).toBe(1);
            expect(response.body.disciplinaId).toBe(disciplinaTeste.id);

            // Salvar o tópico criado para usar nos demais testes
            topicoTeste = response.body;
        });

        it("deve rejeitar criação de tópico duplicado na mesma disciplina", async () => {
            const topicoData = {
                titulo: "Teoria Geral dos Direitos Fundamentais",
                ordem: 2,
                disciplinaId: disciplinaTeste.id,
            };

            const response = await request(app)
                .post("/api/topico")
                .set("Authorization", `Bearer ${token}`)
                .send(topicoData);

            expect(response.status).toBe(HttpStatus.CONFLICT);
            expect(response.body.error).toMatch(/já existe/i);
        });

        it("deve permitir criar tópico com mesmo título em disciplina diferente", async () => {
            // Criar uma segunda disciplina
            const segundaDisciplina = await prisma.disciplina.create({
                data: {
                    titulo: "Disciplina Teste 2",
                    planoId: seedData.planoEstudo.id,
                    horasSemanais: 10.0,
                },
            });

            const topicoData = {
                titulo: "Teoria Geral dos Direitos Fundamentais",
                ordem: 1,
                disciplinaId: segundaDisciplina.id,
            };

            const response = await request(app)
                .post("/api/topico")
                .set("Authorization", `Bearer ${token}`)
                .send(topicoData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.titulo).toBe("Teoria Geral dos Direitos Fundamentais");
            expect(response.body.disciplinaId).toBe(segundaDisciplina.id);
        });

        it("deve validar ausência de campos obrigatórios", async () => {
            const response = await request(app)
                .post("/api/topico")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    titulo: "Tópico Incompleto",
                    // Faltando ordem, disciplinaId e situacaoId
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("deve validar ausência de titulo", async () => {
            const response = await request(app)
                .post("/api/topico")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    ordem: 2,
                    disciplinaId: disciplinaTeste.id,
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe("GET /api/topico", () => {
        it("deve listar todos os tópicos", async () => {
            const response = await request(app)
                .get("/api/topico")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/topico/:id", () => {
        it("deve buscar tópico por ID", async () => {
            const response = await request(app)
                .get(`/api/topico/${topicoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toBe(topicoTeste.id);
            expect(response.body.titulo).toBe("Teoria Geral dos Direitos Fundamentais");
        });

        it("deve retornar 404 para tópico inexistente", async () => {
            const response = await request(app)
                .get("/api/topico/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/topico/titulo/exact/:titulo", () => {
        it("deve buscar tópico por título exato", async () => {
            const response = await request(app)
                .get(`/api/topico/titulo/exact/${encodeURIComponent(topicoTeste.titulo)}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toBeDefined();
            expect(response.body.titulo).toBe(topicoTeste.titulo);
        });

        it("deve retornar 404 quando nenhum tópico for encontrado", async () => {
            const response = await request(app)
                .get("/api/topico/titulo/exact/Tópico Inexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/topico/titulo/search/:titulo", () => {
        it("deve buscar tópicos por título parcial", async () => {
            const response = await request(app)
                .get(`/api/topico/titulo/search/${encodeURIComponent("Teoria")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.some(t => t.titulo.includes("Teoria"))).toBe(true);
        });

        it("deve retornar array vazio quando nenhum tópico for encontrado", async () => {
            const response = await request(app)
                .get("/api/topico/titulo/search/XYZInexistente")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("GET /api/topico/disciplina/:disciplinaId", () => {
        it("deve buscar tópicos por disciplina", async () => {
            const response = await request(app)
                .get(`/api/topico/disciplina/${disciplinaTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.every(t => t.disciplinaId === disciplinaTeste.id)).toBe(true);
        });

        it("deve retornar array vazio quando nenhum tópico for encontrado para disciplina", async () => {
            const response = await request(app)
                .get("/api/topico/disciplina/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe("PUT /api/topico/:id", () => {
        it("deve atualizar um tópico existente", async () => {
            const response = await request(app)
                .put(`/api/topico/${topicoTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    titulo: "Teoria Geral dos Direitos Fundamentais - Atualizado",
                    ordem: 2,
                });

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.titulo).toBe("Teoria Geral dos Direitos Fundamentais - Atualizado");
            expect(response.body.ordem).toBe(2);

            // Atualizar a referência local
            topicoTeste = response.body;
        });

        it("deve retornar 404 ao atualizar tópico inexistente", async () => {
            const response = await request(app)
                .put("/api/topico/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ titulo: "Teste" });

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("DELETE /api/topico/:id", () => {
        it("deve retornar 404 ao excluir tópico inexistente", async () => {
            const response = await request(app)
                .delete("/api/topico/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve excluir um tópico existente", async () => {
            const response = await request(app)
                .delete(`/api/topico/${topicoTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NO_CONTENT);

            // Verificar que foi realmente deletado
            const verificacao = await prisma.topico.findUnique({
                where: { id: topicoTeste.id },
            });
            expect(verificacao).toBeNull();
        });
    });
});
