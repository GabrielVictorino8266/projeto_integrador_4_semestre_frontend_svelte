/**
 * Cria uma função debounced que aguarda um tempo antes de executar
 * @param {function} func - Função a ser executada
 * @param {number} delay - Tempo de espera em ms
 * @returns {function} Função debounced
 */
export function debounce(func, delay = 300) {
  let timeoutId = null;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Cria uma função debounced que retorna uma Promise
 * @param {function} func - Função assíncrona a ser executada
 * @param {number} delay - Tempo de espera em ms
 * @returns {function} Função debounced que retorna Promise
 */
export function debounceAsync(func, delay = 300) {
  let timeoutId = null;

  return function (...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await func.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
