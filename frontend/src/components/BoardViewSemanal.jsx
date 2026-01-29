import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { diasSemanaOptions, horasToHHMM } from '../utils/utils';
import BlocoCard from './BlocoCard';

const BoardViewSemanal = ({ blocosPorDia, horasPorDia, disciplinasMap, onBlocoClick }) => {
    return (
        <div className="calendario-semanal">
            {diasSemanaOptions.map((dia) => {
                const blocos = blocosPorDia[dia.id] || [];
                const totalHoras = horasPorDia[dia.id] || 0;

                return (
                    <div key={dia.id} className="dia-coluna">
                        <div className="dia-header">
                            <h3 className="dia-nome">{dia.sigla}</h3>
                            {totalHoras > 0 && (
                                <span className="dia-total-horas">
                                    <FontAwesomeIcon icon={faClock} />
                                    {horasToHHMM(totalHoras)}
                                </span>
                            )}
                        </div>
                        <div className="dia-sessoes">
                            {blocos.length > 0 ? (
                                blocos.map(bloco => (
                                    <BlocoCard
                                        key={bloco.id}
                                        bloco={bloco}
                                        disciplina={bloco.disciplina || disciplinasMap.get(bloco.disciplinaId)}
                                        onClick={() => onBlocoClick(bloco)}
                                        concluido={bloco.concluido}
                                        tempoEstudado={bloco.tempoEstudado || 0}
                                    />
                                ))
                            ) : (
                                <div className="dia-vazio">
                                    <p>Nenhum bloco planejado</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

BoardViewSemanal.propTypes = {
    blocosPorDia: PropTypes.object.isRequired,
    horasPorDia: PropTypes.object.isRequired,
    disciplinasMap: PropTypes.instanceOf(Map).isRequired,
    onBlocoClick: PropTypes.func.isRequired,
};

export default BoardViewSemanal;
