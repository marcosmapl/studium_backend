import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFloppyDisk, faCalculator } from '@fortawesome/free-solid-svg-icons';
import './PlanejamentoForm.css';

const diasSemanaOptions = [
    { id: 0, label: 'Domingo', sigla: 'DOM' },
    { id: 1, label: 'Segunda-feira', sigla: 'SEG' },
    { id: 2, label: 'Terça-feira', sigla: 'TER' },
    { id: 3, label: 'Quarta-feira', sigla: 'QUA' },
    { id: 4, label: 'Quinta-feira', sigla: 'QUI' },
    { id: 5, label: 'Sexta-feira', sigla: 'SEX' },
    { id: 6, label: 'Sábado', sigla: 'SÁB' }
];

const PlanejamentoForm = ({ planejamento, disciplinas, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        disciplinas: [],
        diasEstudo: []
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && disciplinas) {
            if (planejamento) {
                // Modo edição - carregar dados existentes
                setFormData({
                    disciplinas: planejamento.disciplinas || disciplinas.map(d => ({
                        id: d.id,
                        titulo: d.titulo,
                        importancia: 2.5,
                        conhecimento: 2.5,
                        horasSemanais: 0,
                        selecionada: false
                    })),
                    diasEstudo: planejamento.diasEstudo || diasSemanaOptions.map(d => ({
                        diaSemana: d.id,
                        horasPlanejadas: 0,
                        ativo: false
                    }))
                });
            } else {
                // Modo criação - inicializar com disciplinas do plano
                setFormData({
                    disciplinas: disciplinas.map(d => ({
                        id: d.id,
                        titulo: d.titulo,
                        importancia: 2.5,
                        conhecimento: 2.5,
                        horasSemanais: 0,
                        selecionada: false
                    })),
                    diasEstudo: diasSemanaOptions.map(d => ({
                        diaSemana: d.id,
                        horasPlanejadas: 0,
                        ativo: false
                    }))
                });
            }
            setErrors({});
        }
    }, [isOpen, planejamento, disciplinas]);

    const handleDisciplinaChange = (disciplinaId, field, value) => {
        setFormData(prev => ({
            ...prev,
            disciplinas: prev.disciplinas.map(d =>
                d.id === disciplinaId ? { ...d, [field]: parseFloat(value) } : d
            )
        }));
    };

    const handleToggleDisciplina = (disciplinaId) => {
        setFormData(prev => ({
            ...prev,
            disciplinas: prev.disciplinas.map(d =>
                d.id === disciplinaId ? { ...d, selecionada: !d.selecionada } : d
            )
        }));
    };

    const handleDiaEstudoChange = (diaSemana, value) => {
        const horasPlanejadas = parseFloat(value) || 0;
        setFormData(prev => ({
            ...prev,
            diasEstudo: prev.diasEstudo.map(d =>
                d.diaSemana === diaSemana
                    ? { ...d, horasPlanejadas, ativo: horasPlanejadas > 0 }
                    : d
            )
        }));
    };

    const calcularDistribuicaoAutomatica = () => {
        const totalHorasDisponiveis = formData.diasEstudo.reduce(
            (total, dia) => total + (dia.horasPlanejadas || 0),
            0
        );

        if (totalHorasDisponiveis === 0) {
            alert('Configure as horas disponíveis nos dias da semana primeiro!');
            return;
        }

        // Calcula o peso total considerando importância e conhecimento
        // Quanto maior a importância e menor o conhecimento, mais horas
        const pesoTotal = formData.disciplinas.reduce((total, d) => {
            const peso = d.importancia * (6 - d.conhecimento); // Inverte o conhecimento
            return total + peso;
        }, 0);

        if (pesoTotal === 0) {
            alert('Ajuste a importância e conhecimento das disciplinas!');
            return;
        }

        // Distribui as horas proporcionalmente
        setFormData(prev => ({
            ...prev,
            disciplinas: prev.disciplinas.map(d => {
                const peso = d.importancia * (6 - d.conhecimento);
                const horasSemanais = (peso / pesoTotal) * totalHorasDisponiveis;
                return {
                    ...d,
                    horasSemanais: Math.round(horasSemanais * 2) / 2 // Arredonda para 0.5
                };
            })
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        const diasAtivos = formData.diasEstudo.filter(d => d.ativo && d.horasPlanejadas > 0);
        if (diasAtivos.length === 0) {
            newErrors.diasEstudo = 'Selecione pelo menos um dia com horas de estudo';
        }

        const totalHorasDisciplinas = formData.disciplinas.reduce(
            (total, d) => total + (d.horasSemanais || 0),
            0
        );
        const totalHorasDias = formData.diasEstudo.reduce(
            (total, d) => total + (d.horasPlanejadas || 0),
            0
        );

        if (totalHorasDisciplinas > totalHorasDias) {
            newErrors.horas = 'Total de horas das disciplinas excede o total disponível nos dias';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const planejamentoData = {
            disciplinas: formData.disciplinas,
            diasEstudo: formData.diasEstudo.filter(d => d.ativo && d.horasPlanejadas > 0),
            totalHorasSemana: formData.diasEstudo.reduce((t, d) => t + (d.horasPlanejadas || 0), 0),
            quantidadeDias: formData.diasEstudo.filter(d => d.ativo && d.horasPlanejadas > 0).length
        };

        if (planejamento) {
            planejamentoData.id = planejamento.id;
        }

        onSubmit(planejamentoData);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const getTotalHorasSemana = () => {
        return formData.diasEstudo.reduce((total, dia) => total + (dia.horasPlanejadas || 0), 0);
    };

    const getTotalHorasDisciplinas = () => {
        return formData.disciplinas.reduce((total, d) => total + (d.horasSemanais || 0), 0);
    };

    const getDisciplinasSelecionadas = () => {
        return formData.disciplinas.filter(d => d.selecionada).length;
    };

    if (!isOpen) return null;

    return (
        <div className="studium-modal-overlay" onClick={onClose}>
            <div className="studium-modal-container planejamento-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="studium-modal-header">
                    <div className="studium-modal-header-content">
                        <h2 className="studium-modal-title">
                            {planejamento ? 'Ajustar Planejamento' : 'Criar Novo Planejamento'}
                        </h2>
                        <p className="studium-modal-subtitle">
                            Configure a importância e conhecimento das disciplinas e defina os dias de estudo
                        </p>
                    </div>
                    <button className="studium-modal-close" onClick={onClose} aria-label="Fechar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="studium-modal-body planejamento-form-body">
                        <div className="planejamento-form-layout">
                            {/* Seção de Disciplinas */}
                            <div className="planejamento-disciplinas-section">
                                <div className="planejamento-section-header">
                                    <h3 className="planejamento-section-title">Disciplinas</h3>
                                    <span className="disciplinas-contador">
                                        {getDisciplinasSelecionadas()} de {formData.disciplinas.length} selecionadas
                                    </span>
                                </div>

                                <div className="planejamento-disciplinas-grid">
                                    {formData.disciplinas.map((disciplina) => (
                                        <div
                                            key={disciplina.id}
                                            className={`planejamento-disciplina-card ${disciplina.selecionada ? 'disciplina-selecionada' : ''}`}
                                            onClick={() => handleToggleDisciplina(disciplina.id)}
                                        >
                                            <h4 className="disciplina-card-titulo">{disciplina.titulo}</h4>

                                            <div className="disciplina-card-slider" onClick={(e) => e.stopPropagation()}>
                                                <label className="slider-label">
                                                    Importância: <span className="slider-value">{disciplina.importancia.toFixed(1)}</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="5"
                                                    step="0.5"
                                                    value={disciplina.importancia}
                                                    onChange={(e) => handleDisciplinaChange(disciplina.id, 'importancia', e.target.value)}
                                                    className="studium-slider"
                                                />
                                                <div className="slider-marks">
                                                    <span>0</span>
                                                    <span>1</span>
                                                    <span>2</span>
                                                    <span>3</span>
                                                    <span>4</span>
                                                    <span>5</span>
                                                </div>
                                            </div>

                                            <div className="disciplina-card-slider" onClick={(e) => e.stopPropagation()}>
                                                <label className="slider-label">
                                                    Conhecimento: <span className="slider-value">{disciplina.conhecimento.toFixed(1)}</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="5"
                                                    step="0.5"
                                                    value={disciplina.conhecimento}
                                                    onChange={(e) => handleDisciplinaChange(disciplina.id, 'conhecimento', e.target.value)}
                                                    className="studium-slider"
                                                />
                                                <div className="slider-marks">
                                                    <span>0</span>
                                                    <span>1</span>
                                                    <span>2</span>
                                                    <span>3</span>
                                                    <span>4</span>
                                                    <span>5</span>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Seção de Dias da Semana */}
                            <div className="planejamento-dias-section">
                                <h3 className="planejamento-section-title">Dias de Estudo</h3>

                                <div className="planejamento-dias-lista">
                                    {diasSemanaOptions.map((dia) => {
                                        const diaData = formData.diasEstudo.find(d => d.diaSemana === dia.id);
                                        return (
                                            <div key={dia.id} className="dia-estudo-item">
                                                <label className="dia-estudo-label">
                                                    <span className="dia-nome">{dia.label}</span>
                                                </label>
                                                <div className="dia-estudo-input-group">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="24"
                                                        step="0.5"
                                                        value={diaData?.horasPlanejadas || 0}
                                                        onChange={(e) => handleDiaEstudoChange(dia.id, e.target.value)}
                                                        className="studium-input dia-horas-input"
                                                        placeholder="0"
                                                    />
                                                    <span className="input-suffix">h</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="planejamento-totais">
                                    <div className="total-item">
                                        <span className="total-label">Total Semanal:</span>
                                        <span className="total-value">{getTotalHorasSemana().toFixed(1)}h</span>
                                    </div>
                                </div>

                                {errors.diasEstudo && (
                                    <span className="error-message">{errors.diasEstudo}</span>
                                )}
                                {errors.horas && (
                                    <span className="error-message">{errors.horas}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="studium-modal-footer">
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            {planejamento ? 'Atualizar Planejamento' : 'Criar Planejamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

PlanejamentoForm.propTypes = {
    planejamento: PropTypes.object,
    disciplinas: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default PlanejamentoForm;
