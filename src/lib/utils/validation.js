// src/lib/utils/validation.js

/**
 * Valida um CNPJ (Cadastro Nacional da Pessoa Jurídica).
 * @param {string} cnpj - O CNPJ a ser validado.
 * @returns {boolean} - true se o CNPJ for válido, false caso contrário.
 */
export function validarCNPJ(cnpj) {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, "");

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CNPJs inválidos conhecidos)
  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  // Validação do segundo dígito verificador
  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return false;
  }

  return true;
}

/**
 * Valida um CPF (Cadastro de Pessoa Física).
 * @param {string} cpf - O CPF a ser validado.
 * @returns {boolean} - true se o CPF for válido, false caso contrário.
 */
export function validarCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPFs inválidos conhecidos)
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

/**
 * Valida um endereço de e-mail.
 * @param {string} email - O e-mail a ser validado.
 * @returns {boolean} - true se o e-mail for válido, false caso contrário.
 */
export function validarEmail(email) {
  // Remove whitespace
  email = email.trim();

  // Check if email is empty
  if (!email) {
    return false;
  }

  // Regex básico para e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  const parts = email.split("@");

  // Deve ter exatamente um @
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  // Parte local e domínio não podem ser vazios
  if (!localPart || !domain) {
    return false;
  }

  // Outras verificações (opcional, mas bom)
  if (localPart.length > 64 || domain.length > 255) {
    return false;
  }

  // Domínio deve ter pelo menos um ponto
  if (!domain.includes(".")) {
    return false;
  }

  // Verifica pontos consecutivos
  if (email.includes("..")) {
    return false;
  }

  // Domínio não pode começar ou terminar com ponto ou hífen
  if (/^[.-]|[.-]$/.test(domain)) {
    return false;
  }

  return true;
}

/**
 * Valida se a data de nascimento implica uma idade dentro do intervalo permitido.
 * @param {string} dataNascimento - A data de nascimento (ex: 'DD/MM/YYYY' ou 'YYYY-MM-DD').
 * @param {number} idadeMinima - Idade mínima permitida.
 * @param {number} idadeMaxima - Idade máxima permitida.
 * @returns {boolean} - true se a idade for válida, false caso contrário.
 */
export function validarIdade(
  dataNascimento,
  idadeMinima = 0,
  idadeMaxima = 150,
) {
  let birthDate;

  if (dataNascimento instanceof Date) {
    birthDate = dataNascimento;
  } else {
    const dateStr = dataNascimento.toString().trim();

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      // Atenção: Mês é 0-indexado no JavaScript
      birthDate = new Date(year, month - 1, day);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      birthDate = new Date(dateStr);
    } else {
      return false;
    }
  }

  if (isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();

  if (birthDate > today) {
    return false;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < idadeMinima || age > idadeMaxima) {
    return false;
  }

  return true;
}

/**
 * Valida um número de telefone brasileiro (fixo ou móvel).
 * @param {string} telefone - O número de telefone a ser validado.
 * @returns {boolean} - true se o telefone for válido, false caso contrário.
 */
export function validarTelefone(telefone) {
  // Remove caracteres não numéricos
  telefone = telefone.replace(/[^\d]/g, "");

  // Verifica o comprimento (10 ou 11 dígitos)
  if (telefone.length < 10 || telefone.length > 11) {
    return false;
  }

  // Verifica se é composto por dígitos iguais (inválido)
  if (/^(\d)\1+$/.test(telefone)) {
    return false;
  }

  // Extrai o DDD (código de área - 2 primeiros dígitos)
  const ddd = parseInt(telefone.substring(0, 2));

  // Lista de DDDs válidos (simplificada - a lista original no código é mais completa)
  // Para manter a funcionalidade original, vamos usar a lista completa do código original.
  const dddValidos = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
    37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63,
    65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 87, 82, 83, 84, 85, 88, 86,
    89, 91, 93, 94, 92, 97, 95, 96, 98, 99,
  ];

  if (!dddValidos.includes(ddd)) {
    return false;
  }

  // Para 11 dígitos (móvel), o terceiro dígito deve ser 9
  if (telefone.length === 11) {
    const terceiroDigito = telefone.charAt(2);
    if (terceiroDigito !== "9") {
      return false;
    }
  }

  // Para 10 dígitos (fixo), o terceiro dígito deve ser 2-5 (Regra simplificada, mas baseada no código original)
  if (telefone.length === 10) {
    const terceiroDigito = parseInt(telefone.charAt(2));
    if (terceiroDigito < 2 || terceiroDigito > 5) {
      return false;
    }
  }

  return true;
}

/**
 * Valida a força da senha com base nos requisitos.
 * @param {string} senha - A senha a ser validada.
 * @returns {number} - A força da senha.
 */
export function validarSenha(senha) {
  let score = 0;
  if (senha.length >= 8) score++;
  if (senha.length >= 12) score++;
  if (/[a-z]/.test(senha)) score++;
  if (/[A-Z]/.test(senha)) score++;
  if (/[0-9]/.test(senha)) score++;
  if (/[^a-zA-Z0-9]/.test(senha)) score++;

  return score;
}

/**
 * Flattens zod validation errors to a single object.
 * @param {z.ZodError} validation - The zod validation error.
 * @returns {Object} - An object containing the flattened errors.
 */
export function getValidationErrors(validation) {
  /** @type {Object.<string, string>} */
  const errors = {};
  for (const [key, messages] of Object.entries(
    validation.error.flatten().fieldErrors,
  )) {
    errors[key] = messages[0];
  }
  return errors;
}
