import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBook, faCheck } from '@fortawesome/free-solid-svg-icons';
import { horasToHHMM } from '../utils/utils';

const BlocoCard = ({ bloco, disciplina, className = "sessao-card", onClick, concluido, tempoEstudado = 0 }) => {
    // Se concluído, mostra 00:00. Caso contrário, calcula tempo restante
    const tempoRestante = concluido ? 0 : Math.max(0, Number(bloco.totalHorasPlanejadas) - Number(tempoEstudado));

    return (
        <div
            className={`${className} ${concluido ? 'sessao-card-concluido' : ''} ${!concluido ? 'sessao-card-clickable' : ''}`}
            style={{
                borderLeftColor: disciplina?.cor || '#ccc',
                opacity: concluido ? 0.6 : 1,
                cursor: concluido ? 'not-allowed' : 'pointer'
            }}
            onClick={!concluido ? onClick : undefined}
            title={concluido ? 'Bloco concluído' : 'Clique para registrar sessão de estudo'}
        >
            <div className="sessao-card-header">
                <div className="sessao-categoria">
                    <FontAwesomeIcon icon={faBook} />
                    <span>Bloco {bloco.ordem}</span>
                </div>
                <div className="sessao-tempo">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{horasToHHMM(tempoRestante)}</span>
                </div>
            </div>
            <h4 className="sessao-disciplina">
                {disciplina?.titulo || 'Disciplina não encontrada'}
                {concluido && (
                    <span className="bloco-badge-icon">
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                )}
            </h4>
        </div>
    );
};

BlocoCard.propTypes = {
    bloco: PropTypes.shape({
        id: PropTypes.number.isRequired,
        ordem: PropTypes.number.isRequired,
        totalHorasPlanejadas: PropTypes.number.isRequired,
        concluido: PropTypes.bool,
    }).isRequired,
    disciplina: PropTypes.shape({
        id: PropTypes.number,
        titulo: PropTypes.string,
        cor: PropTypes.string,
    }),
    className: PropTypes.string,
    onClick: PropTypes.func,
    concluido: PropTypes.bool,
    tempoEstudado: PropTypes.number,
};

export default BlocoCard;
