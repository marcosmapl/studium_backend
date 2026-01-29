import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFloppyDisk, faBook, faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { CategoriaSessao, CategoriaSessaoLabels, CategoriaSessaoColors } from '../constants';
import { hhmmToHoras, horasToHHMM } from '../utils/utils';
import { toast } from 'react-toastify';
import api from '../services/api';
import TimeInput from './TimeInput';
import './SessaoEstudoForm.css';

const SessaoEstudoForm = ({ isOpen, onClose, blocoEstudo, disciplina, planoEstudoId, onSuccess }) => {
    const [formData, setFormData] = useState({
        dataInicio: new Date().toISOString().split('T')[0],
        categoriaSessao: CategoriaSessao.TEORIA,
        tempoEstudo: 0, // Armazena em horas decimais
        topicoId: '',
        topicoFinalizado: false,
        questoesAcertos: 0,
        questoesErros: 0,
        paginasLidas: 0,
        observacoes: '',
        agendarRevisao: false,
    });

    const [topicos, setTopicos] = useState([]);
    const [loadingTopicos, setLoadingTopicos] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Carrega tópicos da disciplina
    useEffect(() => {
        const carregarTopicos = async () => {
            if (!disciplina?.id || !isOpen) return;

            setLoadingTopicos(true);
            try {
                const response = await api.get(`/topico/disciplina/${disciplina.id}`);
                // Filtra apenas tópicos não concluídos e que estão no edital
                const topicosFiltrados = response.data.filter(t => !t.concluido && t.edital);
                setTopicos(topicosFiltrados);

                // Seleciona o primeiro tópico se houver
                if (topicosFiltrados.length > 0 && !formData.topicoId) {
                    setFormData(prev => ({ ...prev, topicoId: topicosFiltrados[0].id }));
                }
            } catch (error) {
                toast.error('Erro ao carregar tópicos da disciplina');
            } finally {
                setLoadingTopicos(false);
            }
        };

        carregarTopicos();
    }, [disciplina?.id, isOpen]);

    // Reseta o formulário quando fechar
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                dataInicio: new Date().toISOString().split('T')[0],
                categoriaSessao: CategoriaSessao.TEORIA,
                tempoEstudo: 0,
                topicoId: '',
                topicoFinalizado: false,
                questoesAcertos: 0,
                questoesErros: 0,
                paginasLidas: 0,
                observacoes: '',
                agendarRevisao: false,
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTempoEstudoChange = (formattedValue, horasDecimais) => {
        setFormData(prev => ({
            ...prev,
            tempoEstudo: horasDecimais
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validações
        if (!formData.topicoId) {
            toast.error('Selecione um tópico');
            return;
        }

        if (!formData.tempoEstudo || formData.tempoEstudo === 0) {
            toast.error('Informe o tempo de estudo');
            return;
        }

        const tempoEstudoHoras = formData.tempoEstudo;

        setSubmitting(true);
        try {
            // 1. Criar sessão de estudo
            const sessaoData = {
                dataInicio: new Date(formData.dataInicio + 'T' + new Date().toTimeString().split(' ')[0]),
                dataTermino: new Date(),
                categoriaSessao: formData.categoriaSessao,
                tempoEstudo: tempoEstudoHoras,
                topicoFinalizado: formData.topicoFinalizado,
                questoesAcertos: Number(formData.questoesAcertos),
                questoesErros: Number(formData.questoesErros),
                paginasLidas: Number(formData.paginasLidas),
                observacoes: formData.observacoes || null,
                concluida: true,
                situacaoSessao: 'CONCLUIDA',
                planoEstudoId: planoEstudoId,
                disciplinaId: disciplina.id,
                topicoId: Number(formData.topicoId),
                blocoEstudoId: blocoEstudo.id,
            };

            await api.post('/sessaoEstudo', sessaoData);

            // 2. Verificar se tópico foi finalizado e atualizar
            if (formData.topicoFinalizado) {
                await api.put(`/topico/${formData.topicoId}`, {
                    concluido: true
                });
            }

            // 3. Verificar e atualizar bloco de estudo
            // Buscar todas as sessões do bloco para calcular total
            const sessoesResponse = await api.get(`/sessaoEstudo/blocoEstudo/${blocoEstudo.id}`);
            const totalEstudado = sessoesResponse.data.reduce((sum, s) => sum + Number(s.tempoEstudo), 0);

            if (totalEstudado >= Number(blocoEstudo.totalHorasPlanejadas)) {
                await api.put(`/blocoEstudo/${blocoEstudo.id}`, {
                    concluido: true
                });
            }

            // 4. Agendar revisão se solicitado
            if (formData.agendarRevisao) {
                const dataRevisao = new Date(formData.dataInicio);
                dataRevisao.setDate(dataRevisao.getDate() + 2);

                // Buscar o número da próxima revisão
                let numeroRevisao = 1;
                try {
                    const revisoesResponse = await api.get(`/revisao/topico/${formData.topicoId}`);
                    numeroRevisao = (revisoesResponse.data?.length || 0) + 1;
                } catch (err) {
                    // Se não encontrar revisões (404), começa com número 1
                    if (err.response?.status !== 404) {
                        throw err; // Re-lança se não for 404
                    }
                }

                await api.post('/revisao', {
                    numero: numeroRevisao,
                    dataProgramada: dataRevisao,
                    situacaoRevisao: 'AGENDADA',
                    concluida: false,
                    planoEstudoId: planoEstudoId,
                    disciplinaId: disciplina.id,
                    topicoId: Number(formData.topicoId),
                });
            }

            toast.success('Sessão de estudo registrada com sucesso!');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Erro ao registrar sessão de estudo: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="sessao-form-overlay" onClick={onClose}>
            <div className="sessao-form-panel" onClick={(e) => e.stopPropagation()}>
                <div className="sessao-form-header">
                    <div>
                        <h2>Registrar Sessão de Estudo</h2>
                        <p className="sessao-form-subtitle">
                            <FontAwesomeIcon icon={faBook} /> {disciplina?.titulo}
                        </p>
                    </div>
                    <button className="btn-close" onClick={onClose} type="button">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="sessao-form-content">
                    {/* Data da Sessão e Tempo de Estudo */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dataInicio">Data da Sessão *</label>
                            <input
                                type="date"
                                id="dataInicio"
                                name="dataInicio"
                                value={formData.dataInicio}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tempoEstudo">Tempo de Estudo (HH:MM) *</label>
                            <TimeInput
                                id="tempoEstudo"
                                name="tempoEstudo"
                                value={formData.tempoEstudo}
                                onChange={handleTempoEstudoChange}
                                placeholder="00:00"
                                required
                                maxHours={23}
                            />
                        </div>
                    </div>

                    {/* Categoria */}
                    <div className="form-group">
                        <label htmlFor="categoriaSessao">Categoria *</label>
                        <select
                            id="categoriaSessao"
                            name="categoriaSessao"
                            value={formData.categoriaSessao}
                            onChange={handleChange}
                            required
                        >
                            {Object.entries(CategoriaSessaoLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tópico */}
                    <div className="form-group">
                        <label htmlFor="topicoId">Tópico Estudado *</label>
                        {loadingTopicos ? (
                            <p>Carregando tópicos...</p>
                        ) : topicos.length === 0 ? (
                            <p className="text-warning">Nenhum tópico disponível para esta disciplina</p>
                        ) : (
                            <select
                                id="topicoId"
                                name="topicoId"
                                value={formData.topicoId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione um tópico</option>
                                {topicos.map(topico => (
                                    <option key={topico.id} value={topico.id}>
                                        {topico.titulo}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Checkbox Tópico Finalizado */}
                    <div className="form-group-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="topicoFinalizado"
                                checked={formData.topicoFinalizado}
                                onChange={handleChange}
                            />
                            <FontAwesomeIcon icon={faCheck} />
                            Tópico concluído nesta sessão
                        </label>
                    </div>

                    {/* Questões */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="questoesAcertos">Questões Acertadas</label>
                            <input
                                type="number"
                                id="questoesAcertos"
                                name="questoesAcertos"
                                value={formData.questoesAcertos}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="questoesErros">Questões Erradas</label>
                            <input
                                type="number"
                                id="questoesErros"
                                name="questoesErros"
                                value={formData.questoesErros}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Páginas Lidas */}
                    <div className="form-group">
                        <label htmlFor="paginasLidas">Páginas Lidas</label>
                        <input
                            type="number"
                            id="paginasLidas"
                            name="paginasLidas"
                            value={formData.paginasLidas}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                    {/* Observações */}
                    <div className="form-group">
                        <label htmlFor="observacoes">Observações</label>
                        <textarea
                            id="observacoes"
                            name="observacoes"
                            value={formData.observacoes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Anotações sobre a sessão de estudo..."
                        />
                    </div>

                    {/* Agendar Revisão */}
                    <div className="form-group-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="agendarRevisao"
                                checked={formData.agendarRevisao}
                                onChange={handleChange}
                            />
                            <FontAwesomeIcon icon={faClock} />
                            Agendar revisão para daqui 2 dias
                        </label>
                    </div>

                    {/* Botões */}
                    <div className="sessao-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting || topicos.length === 0}>
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            {submitting ? 'Salvando...' : 'Registrar Sessão'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

SessaoEstudoForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    blocoEstudo: PropTypes.object,
    disciplina: PropTypes.object,
    planoEstudoId: PropTypes.number,
    onSuccess: PropTypes.func.isRequired,
};

export default SessaoEstudoForm;
