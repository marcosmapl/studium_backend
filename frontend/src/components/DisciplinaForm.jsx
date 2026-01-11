import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBookOpen, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './DisciplinaForm.css';

const DisciplinaForm = ({ isOpen, onClose, onSubmit, disciplina }) => {
  const [formData, setFormData] = useState({
    nome: '',
    peso: '',
    nivelFamiliaridade: 1
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (disciplina) {
      setFormData({
        nome: disciplina.nome || '',
        peso: disciplina.peso || '',
        nivelFamiliaridade: disciplina.nivelFamiliaridade || 1
      });
    } else {
      setFormData({
        nome: '',
        peso: '',
        nivelFamiliaridade: 1
      });
    }
    setErrors({});
    setHoveredStar(0);
  }, [disciplina, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome da disciplina é obrigatório';
    }

    if (!formData.peso) {
      newErrors.peso = 'O peso é obrigatório';
    } else if (isNaN(formData.peso) || Number(formData.peso) <= 0) {
      newErrors.peso = 'O peso deve ser um número maior que zero';
    }

    if (!formData.nivelFamiliaridade || formData.nivelFamiliaridade < 1 || formData.nivelFamiliaridade > 5) {
      newErrors.nivelFamiliaridade = 'Selecione um nível de familiaridade válido';
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
      peso: Number(formData.peso),
      nivelFamiliaridade: Number(formData.nivelFamiliaridade)
    };

    if (disciplina) {
      disciplinaData.id = disciplina.id;
    }

    onSubmit(disciplinaData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getNivelInfo = (nivel) => {
    const niveis = {
      1: {
        titulo: 'Nível 1 — Nenhuma Familiaridade',
        descricao: 'Nunca estudou a disciplina ou teve contato irrelevante.'
      },
      2: {
        titulo: 'Nível 2 — Baixa Familiaridade',
        descricao: 'Já estudou superficialmente, sem consolidação.'
      },
      3: {
        titulo: 'Nível 3 — Familiaridade Moderada',
        descricao: 'Já estudou a disciplina com alguma regularidade.'
      },
      4: {
        titulo: 'Nível 4 — Alta Familiaridade',
        descricao: 'Conteúdo conhecido e recorrente nos estudos.'
      },
      5: {
        titulo: 'Nível 5 — Familiaridade Muito Alta',
        descricao: 'Disciplina internalizada.'
      }
    };
    return niveis[nivel];
  };

  if (!isOpen) return null;

  return (
    <div className="disciplina-form-overlay" onClick={handleOverlayClick}>
      <div className="disciplina-form-modal">
        <div className="disciplina-form-header">
          <h2 className="disciplina-form-title">
            <FontAwesomeIcon icon={faBookOpen} />
            {disciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
          </h2>
          <button
            type="button"
            className="disciplina-form-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="disciplina-form-body">
          <div className="disciplina-form-group">
            <label htmlFor="nome" className="disciplina-form-label">
              Nome da Disciplina <span className="disciplina-form-required">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`disciplina-form-input ${errors.nome ? 'disciplina-form-input-error' : ''}`}
              placeholder="Ex: Direito Constitucional"
            />
            {errors.nome && (
              <span className="disciplina-form-error-message">{errors.nome}</span>
            )}
          </div>

          <div className="disciplina-form-row">
            <div className="disciplina-form-group">
              <label htmlFor="peso" className="disciplina-form-label">
                Peso <span className="disciplina-form-required">*</span>
              </label>
              <input
                type="number"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className={`disciplina-form-input ${errors.peso ? 'disciplina-form-input-error' : ''}`}
                placeholder="Ex: 3"
                step="0.1"
                min="0"
              />
              {errors.peso && (
                <span className="disciplina-form-error-message">{errors.peso}</span>
              )}
            </div>

            <div className="disciplina-form-group">
              <label className="disciplina-form-label">
                Nível de Familiaridade <span className="disciplina-form-required">*</span>
              </label>
              <div className="familiaridade-stars-container">
                {[1, 2, 3, 4, 5].map((nivel) => {
                  const nivelInfo = getNivelInfo(nivel);
                  const isActive = (hoveredStar || formData.nivelFamiliaridade) >= nivel;
                  
                  return (
                    <div
                      key={nivel}
                      className="star-wrapper"
                      onMouseEnter={() => setHoveredStar(nivel)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setFormData(prev => ({ ...prev, nivelFamiliaridade: nivel }))}
                    >
                      <FontAwesomeIcon
                        icon={isActive ? faStar : faStarRegular}
                        className={`familiaridade-star ${isActive ? 'active' : ''}`}
                      />
                      {hoveredStar === nivel && (
                        <div className="star-tooltip">
                          <div className="star-tooltip-title">{nivelInfo.titulo}</div>
                          <div className="star-tooltip-desc">{nivelInfo.descricao}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.nivelFamiliaridade && (
                <span className="disciplina-form-error-message">{errors.nivelFamiliaridade}</span>
              )}
            </div>
          </div>

          <div className="disciplina-form-footer">
            <button
              type="button"
              className="disciplina-form-btn disciplina-form-btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="disciplina-form-btn disciplina-form-btn-submit"
            >
              {disciplina ? 'Salvar Alterações' : 'Criar Disciplina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisciplinaForm;
