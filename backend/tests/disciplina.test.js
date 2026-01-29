/**
 * Testes para rotas de disciplina
 * Endpoints: /api/disciplina
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

describe("Disciplina - /api/disciplina", () => {
    let token;
    let disciplinaTeste;
    let seedData;

    beforeAll(async () => {
        await cleanDatabase();

        // Criar dados básicos necessários para autenticação
        seedData = await seedBasicData();

        token = await getAuthToken(app);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("POST /api/disciplina", () => {
        it("deve criar uma nova disciplina", async () => {
            const disciplinaData = {
                titulo: "Contabilidade Geral",
                planoId: seedData.planoEstudo.id,
                importancia: 4.5,
                conhecimento: 2.0,
                horasSemanais: 10.50,
            };

            const response = await request(app)
                .post("/api/disciplina")
                .set("Authorization", `Bearer ${token}`)
                .send(disciplinaData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.titulo).toBe("Contabilidade Geral");
            expect(response.body.planoId).toBe(seedData.planoEstudo.id);
            expect(parseFloat(response.body.importancia)).toBe(4.5);
            expect(parseFloat(response.body.conhecimento)).toBe(2.0);
            expect(parseFloat(response.body.horasSemanais)).toBe(10.5);

            // Salvar a disciplina criada para usar nos demais testes
            disciplinaTeste = response.body;
        });

        it("deve rejeitar criação de disciplina duplicada no mesmo plano", async () => {
            const disciplinaData = {
                titulo: "Contabilidade Geral",
                planoId: seedData.planoEstudo.id,
                horasSemanais: 10.0,
            };

            const response = await request(app)
                .post("/api/disciplina")
                .set("Authorization", `Bearer ${token}`)
                .send(disciplinaData);

            expect(response.status).toBe(HttpStatus.CONFLICT);
            expect(response.body.error).toMatch(/já existe/i);
        });

        it("deve permitir criar disciplina com mesmo título em plano diferente", async () => {
            // Criar um segundo plano
            const segundoPlano = await prisma.planoEstudo.create({
                data: {
                    titulo: "Plano Teste 2",
                    situacao: "NOVO",
                    usuarioId: seedData.usuario.id,
                },
            });

            const disciplinaData = {
                titulo: "Contabilidade Geral",
                planoId: segundoPlano.id,
                horasSemanais: 10.0,
            };

            const response = await request(app)
                .post("/api/disciplina")
                .set("Authorization", `Bearer ${token}`)
                .send(disciplinaData);

            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body.titulo).toBe("Contabilidade Geral");
            expect(response.body.planoId).toBe(segundoPlano.id);
        });

        it("deve validar ausência de campos obrigatórios", async () => {
            const response = await request(app)
                .post("/api/disciplina")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    // Faltando campos obrigatórios
                });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("deve rejeitar criação com plano inexistente", async () => {
            const disciplinaData = {
                titulo: "Disciplina Teste",
                planoId: 99999,
                horasSemanais: 10.0,
            };

            const response = await request(app)
                .post("/api/disciplina")
                .set("Authorization", `Bearer ${token}`)
                .send(disciplinaData);

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body.error).toMatch(/plano.*não encontrado/i);
        });
    });

    describe("GET /api/disciplina", () => {
        it("deve listar todas as disciplinas", async () => {
            const response = await request(app)
                .get("/api/disciplina")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("deve negar acesso sem token", async () => {
            const response = await request(app).get("/api/disciplina");

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });

    describe("GET /api/disciplina/:id", () => {
        it("deve buscar disciplina por ID", async () => {
            const response = await request(app)
                .get(`/api/disciplina/${disciplinaTeste.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.id).toBe(disciplinaTeste.id);
            expect(response.body.titulo).toBe("Contabilidade Geral");
        });

        it("deve retornar 404 para disciplina inexistente", async () => {
            const response = await request(app)
                .get("/api/disciplina/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/disciplina/titulo/exact/:titulo", () => {
        it("deve buscar disciplina por título exato", async () => {
            const response = await request(app)
                .get(`/api/disciplina/titulo/exact/${encodeURIComponent("Contabilidade Geral")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.titulo).toBe("Contabilidade Geral");
        });

        it("deve retornar 404 para título não encontrado", async () => {
            const response = await request(app)
                .get(`/api/disciplina/titulo/exact/${encodeURIComponent("Disciplina Inexistente")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/disciplina/titulo/search/:titulo", () => {
        it("deve buscar disciplinas por título parcial", async () => {
            const response = await request(app)
                .get(`/api/disciplina/titulo/search/${encodeURIComponent("Cont")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].titulo).toContain("Cont");
        });

        it("deve retornar 404 quando não encontrar resultados", async () => {
            const response = await request(app)
                .get(`/api/disciplina/titulo/search/${encodeURIComponent("XYZ123")}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("GET /api/disciplina/plano/:planoId", () => {
        it("deve buscar todas as disciplinas de um plano", async () => {
            const response = await request(app)
                .get(`/api/disciplina/plano/${seedData.planoEstudo.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].planoId).toBe(seedData.planoEstudo.id);
        });

        it("deve retornar 404 quando plano não tiver disciplinas", async () => {
            // Criar plano vazio
            const planoVazio = await prisma.planoEstudo.create({
                data: {
                    titulo: "Plano Vazio",
                    situacao: "NOVO",
                    usuarioId: seedData.usuario.id,
                },
            });

            const response = await request(app)
                .get(`/api/disciplina/plano/${planoVazio.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("PUT /api/disciplina/:id", () => {
        it("deve atualizar uma disciplina", async () => {
            const updateData = {
                titulo: "Contabilidade Geral Atualizada",
                importancia: 5.0,
                conhecimento: 3.5,
                horasSemanais: 15.0,
            };

            const response = await request(app)
                .put(`/api/disciplina/${disciplinaTeste.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updateData);

            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body.titulo).toBe("Contabilidade Geral Atualizada");
            expect(parseFloat(response.body.importancia)).toBe(5.0);
            expect(parseFloat(response.body.conhecimento)).toBe(3.5);
            expect(parseFloat(response.body.horasSemanais)).toBe(15.0);
        });

        it("deve retornar 404 ao tentar atualizar disciplina inexistente", async () => {
            const response = await request(app)
                .put("/api/disciplina/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ titulo: "Teste" });

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe("DELETE /api/disciplina/:id", () => {
        it("deve excluir uma disciplina", async () => {
            // Criar uma disciplina para excluir
            const disciplinaParaExcluir = await prisma.disciplina.create({
                data: {
                    titulo: "Disciplina Para Excluir",
                    planoId: seedData.planoEstudo.id,
                    horasSemanais: 10.0,
                },
            });

            const response = await request(app)
                .delete(`/api/disciplina/${disciplinaParaExcluir.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.OK);

            // Verificar se foi excluída
            const checkResponse = await request(app)
                .get(`/api/disciplina/${disciplinaParaExcluir.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(checkResponse.status).toBe(HttpStatus.NOT_FOUND);
        });

        it("deve retornar 404 ao tentar excluir disciplina inexistente", async () => {
            const response = await request(app)
                .delete("/api/disciplina/99999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });
});
