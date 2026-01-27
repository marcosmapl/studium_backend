import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding,
    faBriefcase,
    faUniversity,
    faCheckCircle,
    faCirclePlus,
    faClock,
    faBook,
    faCalendar,
    faFire,
    faTachometerAlt,
    faBullseye,
    faTrash,
    faEdit,
    faPlayCircle,
    faPauseCircle
} from '@fortawesome/free-solid-svg-icons';
import { formatDateToLocaleString, calculateTotalHours, calculatePerformance } from '../utils/utils';
import './PlanoEstudoCard.css';

const PlanoEstudoCard = ({ plano, onEdit, onDelete, onViewDisciplinas }) => {
    const getSituacaoClass = (descricao) => {
        switch (descricao) {
            case 'Em Andamento':
                return 'situacao-andamento';
            case 'Pausado':
                return 'situacao-pausado';
            case 'Concluído':
                return 'situacao-concluido';
            case 'Novo':
                return 'situacao-novo';
            default:
                return '';
        }
    };

    const getSituacaoIcon = (descricao) => {
        switch (descricao) {
            case 'Em Andamento':
                return faPlayCircle;
            case 'Pausado':
                return faPauseCircle;
            case 'Concluído':
                return faCheckCircle;
            case 'Novo':
                return faCirclePlus;
            default:
                return '';
        }
    };

    return (
        <div className="studium-card-base">
            {/* Cabeçalho do Card */}
            <div className="studium-card-header">
                <div className="plano-titulo-wrapper">
                    <h3 className="studium-card-title">{plano.titulo}</h3>
                    <span className={`plano-situacao ${getSituacaoClass(plano.situacao.descricao)}`}>
                        <FontAwesomeIcon icon={getSituacaoIcon(plano.situacao.descricao)} />
                        {plano.situacao.descricao}
                    </span>
                </div>
            </div>

            {/* Informações do Concurso */}
            <div className="plano-info-concurso">
                <div className="info-item">
                    <div className="info-icon">
                        <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <div className="info-content">
                        <span className="info-label">Concurso</span>
                        <span className="info-value">{plano.concurso}</span>
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-icon">
                        <FontAwesomeIcon icon={faBriefcase} />
                    </div>
                    <div className="info-content">
                        <span className="info-label">Cargo</span>
                        <span className="info-value">{plano.cargo}</span>
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-icon">
                        <FontAwesomeIcon icon={faUniversity} />
                    </div>
                    <div className="info-content">
                        <span className="info-label">Banca</span>
                        <span className="info-value">{plano.banca}</span>
                    </div>
                </div>
                <div className="info-item">
                    <div className="info-icon">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className="info-content">
                        <span className="info-label">Data da Prova</span>
                        <span className="info-value">{formatDateToLocaleString(plano.dataProva)}</span>
                    </div>
                </div>
            </div>

            {/* Progresso Geral */}
            <div className="plano-progresso-section">
                <div className="progresso-header">
                    <span className="progresso-label">Progresso Geral</span>
                    <span className="progresso-percentual">{plano.progressoGeral | 0}%</span>
                </div>
                <div className="progresso-barra-container">
                    <div
                        className="progresso-barra-preenchida"
                        style={{ width: `${plano.progressoGeral | 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Estatísticas do Plano */}
            <div className="studium-stats-grid">
                <div className="studium-stats-item">
                    <div className="studium-stats-icon">
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="studium-stats-content">
                        <span className="studium-stats-label">Horas Estudadas</span>
                        <span className="studium-stats-valor">{calculateTotalHours(plano.sessoesEstudo)}</span>
                    </div>
                </div>
                <div className="studium-stats-item">
                    <FontAwesomeIcon icon={faBook} className="studium-stats-icon" />
                    <div className="studium-stats-content">
                        <span className="studium-stats-label">Disciplinas</span>
                        <span className="studium-stats-valor">{plano.disciplinas?.length | 0}</span>
                    </div>
                </div>
                <div className="studium-stats-item">
                    <FontAwesomeIcon icon={faFire} className="studium-stats-icon" />
                    <div className="studium-stats-content">
                        <span className="studium-stats-label">Constância</span>
                        <span className="studium-stats-valor">{`${plano.constancia || 0}%`}</span>
                    </div>
                </div>
                <div className="studium-stats-item">
                    <FontAwesomeIcon icon={faTachometerAlt} className="studium-stats-icon" />
                    <div className="studium-stats-content">
                        <span className="studium-stats-label">Ritmo Atual</span>
                        <span className="studium-stats-valor">
                            {plano.ritmoAtual > 0 ? `${plano.ritmoAtual}h/dia` : '- h/dia'}
                        </span>
                    </div>
                </div>
                <div className="studium-stats-item">
                    <FontAwesomeIcon icon={faBullseye} className="studium-stats-icon" />
                    <div className="studium-stats-content">
                        <span className="studium-stats-label">Desempenho</span>
                        <span className="studium-stats-valor">{calculatePerformance(plano.sessoesEstudo)}%</span>
                    </div>
                </div>
            </div>

            {/* Rodapé do Card */}
            <div className="studium-card-footer">
                <span className="plano-data-criacao">
                    Criado em {formatDateToLocaleString(plano.createdAt)}
                </span>
                <div className="studium-card-footer-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => onViewDisciplinas(plano.id)}
                    >
                        <FontAwesomeIcon icon={faBook} />
                        Ver Disciplinas
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => onEdit(plano)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Editar
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => onDelete(plano)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

PlanoEstudoCard.propTypes = {
    plano: PropTypes.shape({
        id: PropTypes.number.isRequired,
        titulo: PropTypes.string.isRequired,
        concurso: PropTypes.string.isRequired,
        cargo: PropTypes.string.isRequired,
        banca: PropTypes.string.isRequired,
        dataProva: PropTypes.string.isRequired,
        progressoGeral: PropTypes.number,
        constancia: PropTypes.number,
        ritmoAtual: PropTypes.number,
        createdAt: PropTypes.string.isRequired,
        situacao: PropTypes.shape({
            descricao: PropTypes.string.isRequired
        }).isRequired,
        disciplinas: PropTypes.array,
        sessoesEstudo: PropTypes.array
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewDisciplinas: PropTypes.func.isRequired
};

export default PlanoEstudoCard;
