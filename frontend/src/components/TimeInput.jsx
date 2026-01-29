import { useState } from 'react';
import PropTypes from 'prop-types';
import { horasToHHMM, hhmmToHoras } from '../utils/utils';
import { toast } from 'react-toastify';
import './TimeInput.css';

/**
 * Componente de input para entrada de tempo no formato HH:MM
 * Formata automaticamente enquanto o usuário digita
 * Valida se o horário está entre 00:00 e 23:59
 */
const TimeInput = ({
    value,
    onChange,
    onBlur,
    id,
    name,
    required,
    placeholder = '00:00',
    className = '',
    disabled = false,
    maxHours = 23
}) => {
    const [displayValue, setDisplayValue] = useState('');
    const [hasError, setHasError] = useState(false);

    const handleChange = (e) => {
        const inputValue = e.target.value;

        // Remove tudo que não é dígito
        const digitsOnly = inputValue.replace(/\D/g, '');

        // Limita a 4 dígitos
        const limitedDigits = digitsOnly.slice(0, 4);

        // Formata automaticamente enquanto digita
        let formattedValue = '';
        if (limitedDigits.length > 0) {
            if (limitedDigits.length <= 2) {
                formattedValue = limitedDigits;
            } else {
                const hours = limitedDigits.slice(0, -2);
                const minutes = limitedDigits.slice(-2);
                formattedValue = `${hours}:${minutes}`;
            }
        }

        setDisplayValue(formattedValue);
        setHasError(false);

        // Converte para horas decimais e envia para o onChange
        const horasDecimais = hhmmToHoras(limitedDigits);
        onChange(formattedValue, horasDecimais);
    };

    const handleFocus = (e) => {
        // Seleciona todo o conteúdo quando o input recebe foco
        e.target.select();
    };

    const handleBlur = (e) => {
        const currentDisplay = displayValue || horasToHHMM(value || 0);

        // Valida o horário
        if (currentDisplay && currentDisplay !== '00:00') {
            const digitsOnly = currentDisplay.replace(/\D/g, '');

            if (digitsOnly.length >= 3) {
                const hours = parseInt(digitsOnly.slice(0, -2), 10) || 0;
                const minutes = parseInt(digitsOnly.slice(-2), 10) || 0;

                // Verifica se o horário é válido (00:00 até maxHours:59)
                if (hours > maxHours || minutes > 59) {
                    setHasError(true);
                    toast.error(`Horário inválido! Por favor, informe um horário entre 00:00 e ${maxHours}:59.`);
                    e.preventDefault();
                    e.target.focus();
                    e.target.select();

                    if (onBlur) {
                        onBlur(e, false); // false indica validação falhou
                    }
                    return;
                }
            }
        }

        // Limpa o displayValue para usar o value formatado
        setDisplayValue('');
        setHasError(false);

        if (onBlur) {
            onBlur(e, true); // true indica validação passou
        }
    };

    const currentValue = displayValue !== ''
        ? displayValue
        : horasToHHMM(value || 0);

    return (
        <input
            type="text"
            id={id}
            name={name}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`time-input ${hasError ? 'time-input-error' : ''} ${className}`}
            placeholder={placeholder}
            maxLength="5"
            required={required}
            disabled={disabled}
        />
    );
};

TimeInput.propTypes = {
    value: PropTypes.number, // Valor em horas decimais
    onChange: PropTypes.func.isRequired, // (formattedValue, horasDecimais) => void
    onBlur: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    maxHours: PropTypes.number // Máximo de horas permitidas (padrão 23)
};

export default TimeInput;
