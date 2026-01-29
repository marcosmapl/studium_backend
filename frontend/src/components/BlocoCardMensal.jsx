import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCheck } from '@fortawesome/free-solid-svg-icons';
import { horasToHHMM } from '../utils/utils';

const BlocoCardMensal = ({ bloco, disciplina, onClick, concluido, tempoEstudado = 0 }) => {
    // Se concluído, mostra 00:00. Caso contrário, calcula tempo restante
    const tempoRestante = concluido ? 0 : Math.max(0, Number(bloco.totalHorasPlanejadas) - Number(tempoEstudado));

    return (
        <div
            className={`sessao-card-mensal ${concluido ? 'sessao-card-concluido' : ''} ${!concluido ? 'sessao-card-clickable' : ''}`}
            style={{
                borderLeftColor: disciplina?.cor || '#ccc',
                opacity: concluido ? 0.5 : 1,
                cursor: concluido ? 'not-allowed' : 'pointer'
            }}
            onClick={!concluido ? onClick : undefined}
            title={concluido ? 'Bloco concluído' : disciplina?.titulo || 'N/A'}
        >
            <div className="sessao-mensal-info">
                <FontAwesomeIcon icon={faBook} className="sessao-mensal-icon" />
                <span className="sessao-mensal-disciplina">{disciplina?.titulo || 'N/A'}</span>
                {concluido && (
                    <FontAwesomeIcon icon={faCheck} className="bloco-badge-icon-small" />
                )}
            </div>
            <span className="sessao-mensal-tempo">{horasToHHMM(tempoRestante)}</span>
        </div>
    );
};

BlocoCardMensal.propTypes = {
    bloco: PropTypes.shape({
        id: PropTypes.number.isRequired,
        totalHorasPlanejadas: PropTypes.number.isRequired,
        concluido: PropTypes.bool,
    }).isRequired,
    disciplina: PropTypes.shape({
        id: PropTypes.number,
        titulo: PropTypes.string,
        cor: PropTypes.string,
    }),
    onClick: PropTypes.func,
    concluido: PropTypes.bool,
    tempoEstudado: PropTypes.number,
};

export default BlocoCardMensal;
