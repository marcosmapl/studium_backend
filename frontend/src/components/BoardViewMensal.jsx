import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { diasSemanaOptions, horasToHHMM } from '../utils/utils';
import BlocoCardMensal from './BlocoCardMensal';

const BoardViewMensal = ({ diasDoMes, blocosPorDia, horasPorDia, disciplinasMap, onBlocoClick }) => {
    return (
        <div className="calendario-mensal">
            {/* Cabeçalhos dos dias da semana */}
            <div className="calendario-mensal-header">
                {diasSemanaOptions.map((dia) => (
                    <div key={dia.id} className="calendario-mensal-dia-semana">
                        {dia.sigla}
                    </div>
                ))}
            </div>

            {/* Grid de dias */}
            <div className="calendario-mensal-grid">
                {diasDoMes.map((diaInfo, index) => {
                    const diaSemana = diaInfo.data.getDay();
                    const blocos = blocosPorDia[diaSemana] || [];
                    const totalHoras = horasPorDia[diaSemana] || 0;

                    return (
                        <div
                            key={index}
                            className={`calendario-mensal-dia ${diaInfo.mesAtual ? 'mes-atual' : 'mes-outro'
                                } ${blocos.length > 0 ? 'com-sessoes' : ''
                                }`}
                        >
                            <div className="dia-mensal-header">
                                <span className="dia-mensal-numero">{diaInfo.dia}</span>
                                {totalHoras > 0 && (
                                    <span className="dia-mensal-total">
                                        <FontAwesomeIcon icon={faClock} />
                                        {horasToHHMM(totalHoras)}
                                    </span>
                                )}
                            </div>
                            <div className="dia-mensal-sessoes">
                                {blocos.map(bloco => (
                                    <BlocoCardMensal
                                        key={bloco.id}
                                        bloco={bloco}
                                        disciplina={bloco.disciplina || disciplinasMap.get(bloco.disciplinaId)}
                                        onClick={() => onBlocoClick(bloco)}
                                        concluido={bloco.concluido}
                                        tempoEstudado={bloco.tempoEstudado || 0}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

BoardViewMensal.propTypes = {
    diasDoMes: PropTypes.arrayOf(PropTypes.shape({
        dia: PropTypes.number.isRequired,
        mesAtual: PropTypes.bool.isRequired,
        data: PropTypes.instanceOf(Date).isRequired,
    })).isRequired,
    blocosPorDia: PropTypes.object.isRequired,
    horasPorDia: PropTypes.object.isRequired,
    disciplinasMap: PropTypes.instanceOf(Map).isRequired,
    onBlocoClick: PropTypes.func.isRequired,
};

export default BoardViewMensal;
