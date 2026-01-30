/**
 * Índice central de todos os serviços da API
 * Exporta todos os serviços para facilitar importação
 */

import authService from './auth.service';
import usuarioService from './usuario.service';
import grupoUsuarioService from './grupoUsuario.service';
import planoEstudoService from './planoEstudo.service';
import disciplinaService from './disciplina.service';
import topicoService from './topico.service';
import sessaoEstudoService from './sessaoEstudo.service';
import revisaoService from './revisao.service';
import blocoEstudoService from './blocoEstudo.service';
import cidadeService from './cidade.service';
import apiClient from './apiClient';

export {
    authService,
    usuarioService,
    grupoUsuarioService,
    planoEstudoService,
    disciplinaService,
    topicoService,
    sessaoEstudoService,
    revisaoService,
    blocoEstudoService,
    cidadeService,
    apiClient
};

// Exportação padrão com todos os serviços
const services = {
    auth: authService,
    usuario: usuarioService,
    grupoUsuario: grupoUsuarioService,
    planoEstudo: planoEstudoService,
    disciplina: disciplinaService,
    topico: topicoService,
    sessaoEstudo: sessaoEstudoService,
    revisao: revisaoService,
    blocoEstudo: blocoEstudoService,
    cidade: cidadeService
};

export default services;
