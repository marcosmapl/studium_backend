import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-container" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-header">
                    <div className="confirm-icon-wrapper">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="confirm-icon" />
                    </div>
                    <h2 className="confirm-title">{title}</h2>
                </div>

                <div className="confirm-content">
                    <p className="confirm-message">{message}</p>
                </div>

                <div className="confirm-footer">
                    <button type="button" className="btn-confirm-no" onClick={onCancel}>
                        Não
                    </button>
                    <button type="button" className="btn-confirm-yes" onClick={onConfirm}>
                        Sim
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ConfirmDialog;
