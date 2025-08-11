/**
 * Opciones para formatear moneda
 */
interface CurrencyFormatOptions {
  symbol?: string;          // Símbolo de moneda (ej. '$', '€')
  decimalSeparator?: string; // Separador decimal (ej. '.', ',')
  thousandSeparator?: string; // Separador de miles (ej. ',', '.', ' ')
  decimalPlaces?: number;    // Número de decimales (ej. 2, 0)
  symbolPosition?: 'before' | 'after'; // Posición del símbolo
  positivePattern?: string;  // Patrón para positivos (ej. '{symbol}{value}')
  negativePattern?: string;  // Patrón para negativos (ej. '-{symbol}{value}')
}

/**
 * Formatea un número como moneda con opciones personalizadas
 * @param value Valor numérico a formatear
 * @param options Opciones de formato
 * @returns String formateado como moneda
 */
export function formatCurrency(
    value: number,
    options: CurrencyFormatOptions = {}
): string {
  // Configuración por defecto
  const defaults: CurrencyFormatOptions = {
    symbol: '$',
    decimalSeparator: '.',
    thousandSeparator: ',',
    decimalPlaces: 2,
    symbolPosition: 'before',
    positivePattern: '{symbol}{value}',
    negativePattern: '-{symbol}{value}'
  };

  // Fusionar opciones con defaults
  const config = { ...defaults, ...options };

  // Validar el valor de entrada
  if (isNaN(value)) {
    throw new Error('El valor proporcionado no es un número válido');
  }

  // Redondear a los decimales especificados
  const roundedValue = Math.abs(value);
  const factor = Math.pow(10, config.decimalPlaces!);
  const rounded = Math.round(roundedValue * factor) / factor;

  // Separar parte entera y decimal
  const parts = rounded.toFixed(config.decimalPlaces).split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '';

  // Aplicar separador de miles
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator!);

  // Construir el valor base
  let formattedValue = integerPart;
  if (config.decimalPlaces! > 0) {
    formattedValue += config.decimalSeparator + decimalPart.padEnd(config.decimalPlaces!, '0');
  }

  // Aplicar patrón según si es positivo o negativo
  const pattern = value < 0 ? config.negativePattern : config.positivePattern;
  return pattern!
      .replace('{symbol}', config.symbol!)
      .replace('{value}', formattedValue);
}

