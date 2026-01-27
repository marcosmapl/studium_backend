import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFloppyDisk, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { diasSemanaOptions, horasToHHMM, hhmmToHoras } from '../utils/utils';
import { toast } from 'react-toastify';
import './PlanejamentoForm.css';

const PlanejamentoForm = ({ planoEstudoId, disciplinas, blocosAtuais, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        disciplinas: [],
        diasEstudo: []
    });

    const [errors, setErrors] = useState({});
    const [inputErrors, setInputErrors] = useState({});

    useEffect(() => {
        if (isOpen && disciplinas) {
            // Agrupar blocos por dia da semana
            const blocosPorDia = {};
            if (blocosAtuais && blocosAtuais.length > 0) {
                blocosAtuais.forEach(bloco => {
                    if (!blocosPorDia[bloco.diaSemana]) {
                        blocosPorDia[bloco.diaSemana] = [];
                    }
                    blocosPorDia[bloco.diaSemana].push(bloco);
                });
            }

            // Inicializar disciplinas com dados do banco
            const disciplinasIniciais = disciplinas.map(d => ({
                id: d.id,
                titulo: d.titulo,
                cor: d.cor || '#FFFFFF',
                importancia: Number(d.importancia) || 2.5,
                conhecimento: Number(d.conhecimento) || 2.5,
                horasSemanais: Number(d.horasSemanais) || 0,
                selecionada: d.selecionada !== undefined ? d.selecionada : true // Usa valor do banco ou true por padrão
            }));

            // Inicializar dias com blocos existentes ou vazios
            const diasEstudoIniciais = diasSemanaOptions.map(dia => {
                const blocosDoDia = blocosPorDia[dia.id] || [];
                const totalHoras = blocosDoDia.reduce((sum, bloco) => sum + Number(bloco.totalHorasPlanejadas), 0);

                return {
                    diaSemana: dia.id,
                    horasPlanejadas: totalHoras,
                    ativo: totalHoras > 0,
                    blocos: blocosDoDia.map(bloco => ({
                        id: bloco.id,
                        disciplinaId: bloco.disciplinaId,
                        totalHorasPlanejadas: Number(bloco.totalHorasPlanejadas),
                        ordem: bloco.ordem
                    }))
                };
            });

            setFormData({
                disciplinas: disciplinasIniciais,
                diasEstudo: diasEstudoIniciais
            });
            setErrors({});
        }
    }, [isOpen, disciplinas, blocosAtuais]);

    // Recalcula distribuição automaticamente quando dias ou disciplinas mudarem
    useEffect(() => {
        if (formData.disciplinas.length > 0 && formData.diasEstudo.length > 0) {
            calcularDistribuicaoAutomatica();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formData.diasEstudo.map(d => d.horasPlanejadas).join(','),
        formData.disciplinas.map(d => `${d.id}-${d.importancia}-${d.conhecimento}-${d.selecionada}`).join(',')
    ]);

    const handleDisciplinaChange = (disciplinaId, field, value) => {
        setFormData(prev => ({
            ...prev,
            disciplinas: prev.disciplinas.map(d =>
                d.id === disciplinaId ? { ...d, [field]: parseFloat(value) } : d
            )
        }));
    };

    const handleToggleDisciplina = (disciplinaId, e) => {
        // Previne toggle se o clique foi em um slider
        if (e.target.type === 'range') {
            return;
        }
        setFormData(prev => ({
            ...prev,
            disciplinas: prev.disciplinas.map(d =>
                d.id === disciplinaId ? { ...d, selecionada: !d.selecionada } : d
            )
        }));
    };

    const handleDiaEstudoChange = (diaSemana, value) => {
        // Remove tudo que não é dígito
        const digitsOnly = value.replace(/\D/g, '');

        // Limita a 4 dígitos
        const limitedDigits = digitsOnly.slice(0, 4);

        // Formata automaticamente enquanto digita
        let formattedValue = '';
        if (limitedDigits.length > 0) {
            if (limitedDigits.length <= 2) {
                formattedValue = limitedDigits;
            } else {
                const hours = limitedDigits.slice(0, -2);
                const minutes = limitedDigits.slice(-2);
                formattedValue = `${hours}:${minutes}`;
            }
        }

        const horasPlanejadas = hhmmToHoras(limitedDigits);

        // Remove o erro ao digitar
        if (inputErrors[diaSemana]) {
            setInputErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[diaSemana];
                return newErrors;
            });
        }

        setFormData(prev => ({
            ...prev,
            diasEstudo: prev.diasEstudo.map(d =>
                d.diaSemana === diaSemana
                    ? { ...d, horasPlanejadas, ativo: horasPlanejadas > 0, displayValue: formattedValue }
                    : d
            )
        }));
    };

    const handleDiaEstudoBlur = (diaSemana, e) => {
        const diaData = formData.diasEstudo.find(d => d.diaSemana === diaSemana);
        const displayValue = diaData?.displayValue !== undefined
            ? diaData.displayValue
            : horasToHHMM(diaData?.horasPlanejadas || 0);

        // Valida o horário
        if (displayValue && displayValue !== '00:00') {
            const digitsOnly = displayValue.replace(/\D/g, '');

            if (digitsOnly.length >= 3) {
                const hours = parseInt(digitsOnly.slice(0, -2), 10) || 0;
                const minutes = parseInt(digitsOnly.slice(-2), 10) || 0;

                // Verifica se o horário é válido (00:00 até 23:59)
                if (hours > 23 || minutes > 59) {
                    setInputErrors(prev => ({ ...prev, [diaSemana]: true }));
                    toast.error('Horário inválido! Por favor, informe um horário entre 00:00 e 23:59.');
                    e.preventDefault();
                    e.target.focus();
                    e.target.select();
                    return;
                }
            }
        }

        // Formata o valor final quando sai do campo
        setFormData(prev => ({
            ...prev,
            diasEstudo: prev.diasEstudo.map(d =>
                d.diaSemana === diaSemana
                    ? { ...d, displayValue: undefined }
                    : d
            )
        }));
    };

    const handleDiaEstudoFocus = (e) => {
        // Seleciona todo o conteúdo quando o input recebe foco
        e.target.select();
    };

    const calcularDistribuicaoAutomatica = () => {
        const totalHorasDisponiveis = formData.diasEstudo.reduce(
            (total, dia) => total + (dia.horasPlanejadas || 0),
            0
        );

        if (totalHorasDisponiveis === 0) {
            return;
        }

        // Considera apenas disciplinas selecionadas
        const disciplinasSelecionadas = formData.disciplinas.filter(d => d.selecionada);

        // Calcula o peso total considerando importância e conhecimento
        // Quanto maior a importância e menor o conhecimento, mais horas
        const pesoTotal = disciplinasSelecionadas.reduce((total, d) => {
            const peso = d.importancia * (6 - d.conhecimento); // Inverte o conhecimento
            return total + peso;
        }, 0);

        if (pesoTotal === 0) {
            return;
        }

        // Distribui as horas proporcionalmente
        setFormData(prev => ({
            ...prev,
            disciplinas: prev.disciplinas.map(d => {
                if (!d.selecionada) {
                    return { ...d, horasSemanais: 0 };
                }
                const peso = d.importancia * (6 - d.conhecimento);
                const horasSemanais = (peso / pesoTotal) * totalHorasDisponiveis;
                return {
                    ...d,
                    horasSemanais: Math.round(horasSemanais * 2) / 2 // Arredonda para 0.5
                };
            })
        }));
    };

    const gerarBlocosDeEstudo = () => {
        const blocos = [];
        const diasAtivos = formData.diasEstudo.filter(d => d.ativo && d.horasPlanejadas > 0);

        if (diasAtivos.length === 0) {
            toast.error('Configure pelo menos um dia da semana!');
            return [];
        }

        // Disciplinas ordenadas por prioridade (importância alta e conhecimento baixo primeiro)
        const disciplinasOrdenadas = [...formData.disciplinas]
            .filter(d => d.selecionada && d.horasSemanais > 0)
            .sort((a, b) => {
                const pesoA = a.importancia * (6 - a.conhecimento);
                const pesoB = b.importancia * (6 - b.conhecimento);
                return pesoB - pesoA;
            });

        if (disciplinasOrdenadas.length === 0) {
            toast.error('Configure as horas semanais das disciplinas!');
            return [];
        }

        // Durações possíveis para blocos (em horas)
        const duracoesPossiveis = [1.5, 1.0, 0.5];

        // Rastreia horas restantes de cada disciplina
        const horasRestantesPorDisciplina = {};
        disciplinasOrdenadas.forEach(d => {
            horasRestantesPorDisciplina[d.id] = d.horasSemanais;
        });

        // Distribui blocos dia a dia, tentando variar disciplinas
        let tentativasSeguranca = 0;
        const maxTentativas = diasAtivos.length * 100;

        for (let diaIndex = 0; diaIndex < diasAtivos.length && tentativasSeguranca < maxTentativas; diaIndex++) {
            const dia = diasAtivos[diaIndex];

            // Continua alocando blocos no dia atual até preencher
            while (tentativasSeguranca < maxTentativas) {
                tentativasSeguranca++;

                const horasUsadasNoDia = blocos
                    .filter(b => b.diaSemana === dia.diaSemana)
                    .reduce((sum, b) => sum + b.totalHorasPlanejadas, 0);

                const horasDisponiveis = dia.horasPlanejadas - horasUsadasNoDia;

                if (horasDisponiveis < 0.5) {
                    // Dia completo, passa para o próximo
                    break;
                }

                // Identifica disciplinas já alocadas neste dia
                const disciplinasNoDia = new Set(
                    blocos
                        .filter(b => b.diaSemana === dia.diaSemana)
                        .map(b => b.disciplinaId)
                );

                // Busca a melhor disciplina para alocar
                let disciplinaEscolhida = null;
                let duracaoEscolhida = 0;

                // Primeiro, tenta disciplinas que ainda NÃO foram alocadas neste dia
                for (const disciplina of disciplinasOrdenadas) {
                    if (disciplinasNoDia.has(disciplina.id)) {
                        continue; // Pula disciplinas já no dia
                    }

                    const horasRestantes = horasRestantesPorDisciplina[disciplina.id];
                    if (horasRestantes <= 0) {
                        continue; // Sem horas restantes
                    }

                    // Encontra duração adequada
                    for (const duracao of duracoesPossiveis) {
                        if (duracao <= horasDisponiveis && duracao <= horasRestantes) {
                            disciplinaEscolhida = disciplina;
                            duracaoEscolhida = duracao;
                            break;
                        }
                    }

                    if (disciplinaEscolhida) {
                        break; // Encontrou uma disciplina nova para o dia
                    }
                }

                // Se não encontrou disciplina nova, ou todas já estão no dia, 
                // permite repetir disciplinas (mas respeitando prioridade)
                if (!disciplinaEscolhida) {
                    for (const disciplina of disciplinasOrdenadas) {
                        const horasRestantes = horasRestantesPorDisciplina[disciplina.id];
                        if (horasRestantes <= 0) {
                            continue;
                        }

                        // Encontra duração adequada
                        for (const duracao of duracoesPossiveis) {
                            if (duracao <= horasDisponiveis && duracao <= horasRestantes) {
                                disciplinaEscolhida = disciplina;
                                duracaoEscolhida = duracao;
                                break;
                            }
                        }

                        if (disciplinaEscolhida) {
                            break;
                        }
                    }
                }

                // Se encontrou disciplina para alocar
                if (disciplinaEscolhida && duracaoEscolhida > 0) {
                    const ordem = blocos.filter(b => b.diaSemana === dia.diaSemana).length + 1;

                    blocos.push({
                        diaSemana: dia.diaSemana,
                        ordem: ordem,
                        totalHorasPlanejadas: duracaoEscolhida,
                        disciplinaId: disciplinaEscolhida.id
                    });

                    // Atualiza horas restantes
                    horasRestantesPorDisciplina[disciplinaEscolhida.id] -= duracaoEscolhida;
                } else {
                    // Não há mais disciplinas para alocar ou espaço suficiente
                    break;
                }
            }
        }

        // Se ainda restam horas para alocar, tenta distribuir nos dias já existentes
        let continuar = true;
        let voltasSeguranca = 0;

        while (continuar && voltasSeguranca < 50) {
            voltasSeguranca++;
            continuar = false;

            for (const dia of diasAtivos) {
                const horasUsadasNoDia = blocos
                    .filter(b => b.diaSemana === dia.diaSemana)
                    .reduce((sum, b) => sum + b.totalHorasPlanejadas, 0);

                const horasDisponiveis = dia.horasPlanejadas - horasUsadasNoDia;

                if (horasDisponiveis >= 0.5) {
                    // Tenta alocar mais blocos
                    for (const disciplina of disciplinasOrdenadas) {
                        const horasRestantes = horasRestantesPorDisciplina[disciplina.id];
                        if (horasRestantes <= 0) continue;

                        for (const duracao of duracoesPossiveis) {
                            if (duracao <= horasDisponiveis && duracao <= horasRestantes) {
                                const ordem = blocos.filter(b => b.diaSemana === dia.diaSemana).length + 1;

                                blocos.push({
                                    diaSemana: dia.diaSemana,
                                    ordem: ordem,
                                    totalHorasPlanejadas: duracao,
                                    disciplinaId: disciplina.id
                                });

                                horasRestantesPorDisciplina[disciplina.id] -= duracao;
                                continuar = true;
                                break;
                            }
                        }

                        if (continuar) break;
                    }
                }

                if (continuar) break;
            }
        }

        return blocos;
    };

    const validateForm = () => {
        const newErrors = {};

        const diasAtivos = formData.diasEstudo.filter(d => d.ativo && d.horasPlanejadas > 0);
        if (diasAtivos.length === 0) {
            newErrors.diasEstudo = 'Selecione pelo menos um dia com horas de estudo';
        }

        const disciplinasSelecionadas = formData.disciplinas.filter(d => d.selecionada);

        if (disciplinasSelecionadas.length === 0) {
            newErrors.disciplinas = 'Selecione pelo menos uma disciplina';
        }

        const totalHorasDisciplinas = disciplinasSelecionadas.reduce(
            (total, d) => total + (d.horasSemanais || 0),
            0
        );
        const totalHorasDias = formData.diasEstudo.reduce(
            (total, d) => total + (d.horasPlanejadas || 0),
            0
        );

        if (totalHorasDisciplinas === 0) {
            newErrors.horas = 'Configure as horas semanais das disciplinas (use o botão "Distribuir Automaticamente")';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const blocos = gerarBlocosDeEstudo();

        if (blocos.length === 0) {
            return;
        }

        // Prepara dados do plano (dias ativos e horas)
        const dadosPlano = {};
        formData.diasEstudo.forEach(dia => {
            const diaInfo = diasSemanaOptions.find(d => d.value === dia.diaSemana);
            if (diaInfo) {
                const nomeDia = diaInfo.nome.toLowerCase();
                dadosPlano[`${nomeDia}_ativo`] = dia.ativo;
                dadosPlano[`${nomeDia}_horas`] = dia.horasPlanejadas;
            }
        });

        // Prepara dados das disciplinas (horasSemanais e selecionada)
        const disciplinasAtualizadas = formData.disciplinas.map(d => ({
            id: d.id,
            horasSemanais: d.horasSemanais,
            selecionada: d.selecionada
        }));

        onSubmit({
            blocos,
            dadosPlano,
            disciplinasAtualizadas
        });
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const getTotalHorasSemana = () => {
        return formData.diasEstudo.reduce((total, dia) => total + (dia.horasPlanejadas || 0), 0);
    };

    const getTotalHorasDisciplinas = () => {
        return formData.disciplinas
            .filter(d => d.selecionada)
            .reduce((total, d) => total + (d.horasSemanais || 0), 0);
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
                            {blocosAtuais && blocosAtuais.length > 0 ? 'Ajustar Planejamento' : 'Criar Novo Planejamento'}
                        </h2>
                        <p className="studium-modal-subtitle">
                            Configure a importância e conhecimento das disciplinas e defina sua disponibilidade semanal. O sistema distribuirá automaticamente os blocos de estudo.
                        </p>
                    </div>
                    <button className="studium-modal-close-btn" onClick={onClose} aria-label="Fechar">
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
                                            style={{ borderLeftColor: disciplina.cor, borderLeftWidth: '4px', borderLeftStyle: 'solid' }}
                                            onClick={(e) => handleToggleDisciplina(disciplina.id, e)}
                                        >
                                            <div className="disciplina-card-header">
                                                <h4 className="disciplina-card-titulo">{disciplina.titulo}</h4>

                                            </div>

                                            <div className="disciplina-card-sliders">
                                                <div className="disciplina-slider-group">
                                                    <label className="disciplina-slider-label">
                                                        <span>Importância:</span>
                                                        <span className="disciplina-slider-value">{disciplina.importancia.toFixed(1)}</span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        step="0.5"
                                                        value={disciplina.importancia}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleDisciplinaChange(disciplina.id, 'importancia', e.target.value);
                                                        }}
                                                        className="disciplina-slider"
                                                        disabled={!disciplina.selecionada}
                                                    />
                                                </div>

                                                <div className="disciplina-slider-group">
                                                    <label className="disciplina-slider-label">
                                                        <span>Conhecimento:</span>
                                                        <span className="disciplina-slider-value">{disciplina.conhecimento.toFixed(1)}</span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        step="0.5"
                                                        value={disciplina.conhecimento}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleDisciplinaChange(disciplina.id, 'conhecimento', e.target.value);
                                                        }}
                                                        className="disciplina-slider"
                                                        disabled={!disciplina.selecionada}
                                                    />
                                                </div>
                                            </div>

                                            <div className="disciplina-card-footer">
                                                <span className="disciplina-horas-semanais">
                                                    <strong>{horasToHHMM(disciplina.horasSemanais)}</strong> / semana
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Seção de Dias da Semana */}
                            <div className="planejamento-dias-section">
                                <h3 className="planejamento-section-title">Disponibilidade Semanal</h3>

                                <div className="planejamento-dias-lista">
                                    {diasSemanaOptions.map((dia) => {
                                        const diaData = formData.diasEstudo.find(d => d.diaSemana === dia.id);
                                        const displayValue = diaData?.displayValue !== undefined
                                            ? diaData.displayValue
                                            : horasToHHMM(diaData?.horasPlanejadas || 0);

                                        return (
                                            <div key={dia.id} className="dia-estudo-item">
                                                <label className="dia-estudo-label">
                                                    <span className="dia-nome">{dia.label}</span>
                                                </label>
                                                <div className="dia-estudo-input-group">
                                                    <input
                                                        type="text"
                                                        value={displayValue}
                                                        onChange={(e) => handleDiaEstudoChange(dia.id, e.target.value)}
                                                        onFocus={handleDiaEstudoFocus}
                                                        onBlur={(e) => handleDiaEstudoBlur(dia.id, e)}
                                                        className={`studium-input dia-horas-input ${inputErrors[dia.id] ? 'error' : ''}`}
                                                        placeholder="00:00"
                                                        maxLength="5"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="planejamento-totais">
                                    <div className="total-item">
                                        <span className="total-label">Total Alocado:</span>
                                        <span className="total-value">{horasToHHMM(getTotalHorasSemana())}</span>
                                    </div>
                                </div>

                                {errors.disciplinas && (
                                    <span className="error-message">{errors.disciplinas}</span>
                                )}
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
                            {blocosAtuais && blocosAtuais.length > 0 ? 'Atualizar Planejamento' : 'Criar Planejamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

PlanejamentoForm.propTypes = {
    planoEstudoId: PropTypes.number,
    disciplinas: PropTypes.array.isRequired,
    blocosAtuais: PropTypes.array,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default PlanejamentoForm;
