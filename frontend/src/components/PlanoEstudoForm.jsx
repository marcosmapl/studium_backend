import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import './PlanoEstudoForm.css';
import { formatDateForInput } from '../utils/utils';

const PlanoEstudoForm = ({ plano, isOpen, onClose, onSubmit }) => {

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
                dataProva: formatDateForInput(plano.dataProva)
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


    const validateForm = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'O título do plano é obrigatório';
        }

        if (!formData.concurso.trim()) {
            newErrors.concurso = 'O concurso alvo é obrigatório';
        }

        if (!formData.cargo.trim()) {
            newErrors.cargo = 'O cargo pretendido é obrigatório';
        }

        if (!formData.banca.trim()) {
            newErrors.banca = 'A banca organizadora é obrigatória';
        }

        if (!formData.dataProva) {
            newErrors.dataProva = 'A data da prova é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        // Converter data YYYY-MM-DD para ISO DateTime
        const dataProvaISO = formData.dataProva
            ? new Date(formData.dataProva + 'T00:00:00.000Z').toISOString()
            : null;

        // Se está editando, envia apenas os campos editáveis + IDs necessários
        const planoData = {
            ...formData,
            dataProva: dataProvaISO,
        }
        
        if (plano) {
            planoData.id = plano.id;
        }

        onSubmit(planoData);
        onClose();
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
                <div className="studium-modal-header">
                    <FontAwesomeIcon icon={faClipboardList} />
                    <h2 className="studium-modal-title">
                        {plano ? 'Editar Plano de Estudo' : 'Novo Plano de Estudo'}
                    </h2>
                    <button className="studium-modal-close-btn" onClick={handleCancel} aria-label="Fechar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="studium-modal-form">
                    <div className="modal-content">
                        {/* Título do Plano */}
                        <div className="studium-modal-form-group">
                            <label htmlFor="titulo" className="studium-modal-form-label">
                                Título do Plano de Estudo *
                            </label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className={`studium-form-input ${errors.titulo ? 'error' : ''}`}
                                placeholder="Ex: Preparação para TRF 2024"
                            />
                            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
                        </div>

                        {/* Concurso */}
                        <div className="studium-modal-form-group">
                            <label htmlFor="concurso" className="studium-modal-form-label">
                                Concurso *
                            </label>
                            <input
                                type="text"
                                id="concurso"
                                name="concurso"
                                value={formData.concurso}
                                onChange={handleChange}
                                className={`studium-form-input ${errors.concurso ? 'error' : ''}`}
                                placeholder="Ex: Tribunal Regional Federal"
                            />
                            {errors.concurso && <span className="error-message">{errors.concurso}</span>}
                        </div>

                        {/* Cargo */}
                        <div className="studium-modal-form-group">
                            <label htmlFor="cargo" className="studium-modal-form-label">
                                Cargo *
                            </label>
                            <input
                                type="text"
                                id="cargo"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                                className={`studium-form-input ${errors.cargo ? ' error' : ''}`}
                                placeholder="Ex: Analista Judiciário"
                            />
                            {errors.cargo && <span className="error-message">{errors.cargo}</span>}
                        </div>

                        {/* Banca Organizadora */}
                        <div className="studium-modal-form-group">
                            <label htmlFor="banca" className="studium-modal-form-label">
                                Banca Organizadora *
                            </label>
                            <input
                                type="text"
                                id="banca"
                                name="banca"
                                value={formData.banca}
                                onChange={handleChange}
                                className={`studium-form-input ${errors.banca ? 'error' : ''}`}
                                placeholder="Ex: CESPE/CEBRASPE"
                            />
                            {errors.banca && <span className="error-message">{errors.banca}</span>}
                        </div>

                        {/* Data da Prova */}
                        <div className="studium-modal-form-group">
                            <label htmlFor="dataProva" className="studium-modal-form-label">
                                Data da Prova *
                            </label>
                            <input
                                type="date"
                                id="dataProva"
                                name="dataProva"
                                value={formData.dataProva}
                                onChange={handleChange}
                                className={`studium-form-input ${errors.dataProva ? 'error' : ''}`}
                            />
                            {errors.dataProva && <span className="error-message">{errors.dataProva}</span>}
                        </div>
                    </div>

                    <div className="studium-modal-footer">
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faSave} />
                            {plano ? 'Atualizar Plano' : 'Criar Plano'}
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
    onSubmit: PropTypes.func.isRequired
};

export default PlanoEstudoForm;
