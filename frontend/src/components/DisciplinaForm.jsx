import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBookOpen, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import './DisciplinaForm.css';

const DisciplinaForm = ({ disciplina, isOpen, onClose, onSubmit }) => {

    const [formData, setFormData] = useState({
        titulo: '',
        cor: '#FFFFFF',
        importancia: 1,
        conhecimento: 0
    });

    const [errors, setErrors] = useState({});

    // preencher o form quando abrir o modal ou mudar a disciplina
    useEffect(() => {
        if (disciplina) {
            setFormData({
                titulo: disciplina.titulo || '',
                cor: disciplina.cor || '#FFFFFF',
                importancia: disciplina.importancia || 1,
                conhecimento: disciplina.conhecimento || 0
            });
        } else {
            // Limpar formulário para nova disciplina
            setFormData({
                titulo: '',
                cor: '#FFFFFF',
                importancia: 1,
                conhecimento: 0
            });
        }
        setErrors({});
    }, [disciplina, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'O nome da disciplina é obrigatório';
        }

        if (formData.importancia === undefined || formData.importancia === null) {
            newErrors.importancia = 'A importância da disciplina é obrigatória';
        } else if (isNaN(formData.importancia) || Number(formData.importancia) < 0 || Number(formData.importancia) > 5) {
            newErrors.importancia = 'A importância deve estar entre 0.0 e 5.0';
        }

        if (formData.conhecimento === undefined || formData.conhecimento === null) {
            newErrors.conhecimento = 'O nível de conhecimento é obrigatório';
        } else if (isNaN(formData.conhecimento) || Number(formData.conhecimento) < 0 || Number(formData.conhecimento) > 5) {
            newErrors.conhecimento = 'O conhecimento deve estar entre 0.0 e 5.0';
        }

        if (!formData.cor || !/^#[0-9A-F]{6}$/i.test(formData.cor)) {
            newErrors.cor = 'Selecione uma cor válida';
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
        // Limpa o erro do campo ao começar a digitar
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

        const disciplinaData = {
            ...formData,
            importancia: Number(formData.importancia),
            conhecimento: Number(formData.conhecimento)
        };

        if (disciplina) {
            disciplinaData.id = disciplina.id;
        }

        onSubmit(disciplinaData);
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            titulo: '',
            cor: '#FFFFFF',
            importancia: 1,
            conhecimento: 0
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="studium-modal-header">
                    <FontAwesomeIcon icon={faBookOpen} />
                    <h2 className="studium-modal-title">
                        {disciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
                    </h2>
                    <button className="studium-modal-close-btn" onClick={handleCancel} aria-label="Fechar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="studium-modal-form">
                    <div className="modal-content">
                        <div className="studium-modal-form-group">
                            <label htmlFor="titulo" className="studium-modal-form-label">
                                Nome da Disciplina *
                            </label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className={`studium-form-input ${errors.titulo ? 'error' : ''}`}
                                placeholder="Ex: Direito Constitucional"
                            />
                            {errors.titulo && (
                                <span className="error-message">{errors.titulo}</span>
                            )}
                        </div>

                        <div className="disciplina-form-row">
                            <div className="studium-modal-form-group">
                                <label htmlFor="cor" className="studium-modal-form-label">
                                    Cor da Disciplina *
                                </label>
                                <div className="color-picker-wrapper">
                                    <input
                                        type="color"
                                        id="cor"
                                        name="cor"
                                        value={formData.cor}
                                        onChange={handleChange}
                                        className={`studium-color-input ${errors.cor ? 'error' : ''}`}
                                    />
                                    <span className="color-hex-display">{formData.cor}</span>
                                </div>
                                {errors.cor && (
                                    <span className="error-message">{errors.cor}</span>
                                )}
                            </div>

                            <div className="studium-modal-form-group">
                                <label htmlFor="importancia" className="studium-modal-form-label">
                                    Importância: {Number(formData.importancia).toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    id="importancia"
                                    name="importancia"
                                    value={formData.importancia}
                                    onChange={handleChange}
                                    className={`studium-slider ${errors.importancia ? 'error' : ''}`}
                                    min="0"
                                    max="5"
                                    step="0.5"
                                />
                                <div className="slider-labels">
                                    <span>Mínima</span>
                                    <span>Máxima</span>
                                </div>
                                {errors.importancia && (
                                    <span className="error-message">{errors.importancia}</span>
                                )}
                            </div>

                            <div className="studium-modal-form-group">
                                <label htmlFor="conhecimento" className="studium-modal-form-label">
                                    Conhecimento: {Number(formData.conhecimento).toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    id="conhecimento"
                                    name="conhecimento"
                                    value={formData.conhecimento}
                                    onChange={handleChange}
                                    className={`studium-slider ${errors.conhecimento ? 'error' : ''}`}
                                    min="0"
                                    max="5"
                                    step="0.5"
                                />
                                <div className="slider-labels">
                                    <span>Nenhum</span>
                                    <span>Expert</span>
                                </div>
                                {errors.conhecimento && (
                                    <span className="error-message">{errors.conhecimento}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="studium-modal-footer">
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            {disciplina ? 'Atualizar Disciplina' : 'Criar Disciplina'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

DisciplinaForm.propTypes = {
    disciplina: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default DisciplinaForm;
