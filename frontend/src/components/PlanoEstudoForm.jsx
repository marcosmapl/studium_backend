import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import './PlanoEstudoForm.css';

const PlanoEstudoForm = ({ plano, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        concurso: '',
        cargo: '',
        banca: '',
        dataProva: ''
    });

    const [errors, setErrors] = useState({});

    // Preencher o formulário quando receber um plano para edição
    useEffect(() => {
        if (plano) {
            setFormData({
                titulo: plano.titulo || '',
                concurso: plano.concurso || '',
                cargo: plano.cargo || '',
                banca: plano.banca || '',
                dataProva: plano.dataProva || ''
            });
        } else {
            // Limpar formulário para novo plano
            setFormData({
                titulo: '',
                concurso: '',
                cargo: '',
                banca: '',
                dataProva: ''
            });
        }
        setErrors({});
    }, [plano, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpar erro do campo quando usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'Título é obrigatório';
        }

        if (!formData.concurso.trim()) {
            newErrors.concurso = 'Concurso é obrigatório';
        }

        if (!formData.cargo.trim()) {
            newErrors.cargo = 'Cargo é obrigatório';
        }

        if (!formData.banca.trim()) {
            newErrors.banca = 'Banca é obrigatória';
        }

        if (!formData.dataProva) {
            newErrors.dataProva = 'Data da prova é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const planoData = {
                ...formData,
                id: plano?.id || Date.now(), // ID temporário para novos planos
                situacao: plano?.situacao || 'Em Andamento',
                progressoGeral: plano?.progressoGeral || 0,
                dataCriacao: plano?.dataCriacao || new Date().toISOString().split('T')[0],
                totalDisciplinas: plano?.totalDisciplinas || 0,
                horasEstudadas: plano?.horasEstudadas || 0,
                constancia: plano?.constancia || 0,
                ritmoAtual: plano?.ritmoAtual || 0,
                eficienciaGeral: plano?.eficienciaGeral || 0
            };

            onSave(planoData);
            onClose();
        }
    };

    const handleCancel = () => {
        setFormData({
            titulo: '',
            concurso: '',
            cargo: '',
            banca: '',
            dataProva: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {plano ? 'Editar Plano de Estudo' : 'Novo Plano de Estudo'}
                    </h2>
                    <button className="modal-close-btn" onClick={handleCancel} aria-label="Fechar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="plano-form">
                    <div className="modal-content">
                        {/* Título do Plano */}
                        <div className="form-group">
                            <label htmlFor="titulo" className="form-label">
                                Título do Plano de Estudo *
                            </label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className={`form-input ${errors.titulo ? 'input-error' : ''}`}
                                placeholder="Ex: Preparação para TRF 2024"
                            />
                            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
                        </div>

                        {/* Concurso */}
                        <div className="form-group">
                            <label htmlFor="concurso" className="form-label">
                                Concurso *
                            </label>
                            <input
                                type="text"
                                id="concurso"
                                name="concurso"
                                value={formData.concurso}
                                onChange={handleChange}
                                className={`form-input ${errors.concurso ? 'input-error' : ''}`}
                                placeholder="Ex: Tribunal Regional Federal"
                            />
                            {errors.concurso && <span className="error-message">{errors.concurso}</span>}
                        </div>

                        {/* Cargo */}
                        <div className="form-group">
                            <label htmlFor="cargo" className="form-label">
                                Cargo *
                            </label>
                            <input
                                type="text"
                                id="cargo"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                                className={`form-input ${errors.cargo ? 'input-error' : ''}`}
                                placeholder="Ex: Analista Judiciário"
                            />
                            {errors.cargo && <span className="error-message">{errors.cargo}</span>}
                        </div>

                        {/* Banca Organizadora */}
                        <div className="form-group">
                            <label htmlFor="banca" className="form-label">
                                Banca Organizadora *
                            </label>
                            <input
                                type="text"
                                id="banca"
                                name="banca"
                                value={formData.banca}
                                onChange={handleChange}
                                className={`form-input ${errors.banca ? 'input-error' : ''}`}
                                placeholder="Ex: CESPE/CEBRASPE"
                            />
                            {errors.banca && <span className="error-message">{errors.banca}</span>}
                        </div>

                        {/* Data da Prova */}
                        <div className="form-group">
                            <label htmlFor="dataProva" className="form-label">
                                Data da Prova *
                            </label>
                            <input
                                type="date"
                                id="dataProva"
                                name="dataProva"
                                value={formData.dataProva}
                                onChange={handleChange}
                                className={`form-input ${errors.dataProva ? 'input-error' : ''}`}
                            />
                            {errors.dataProva && <span className="error-message">{errors.dataProva}</span>}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancelar" onClick={handleCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar">
                            <FontAwesomeIcon icon={faSave} />
                            {plano ? 'Atualizar' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

PlanoEstudoForm.propTypes = {
    plano: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default PlanoEstudoForm;
