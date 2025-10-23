import { ApiError, ApiClient } from '$lib/api/client';
import { VITE_API_BASE_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';

const apiClient = new ApiClient(VITE_API_BASE_URL || 'http://localhost:3000');

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const cpf = data.get('cpf').replace(/\D/g, '');
		const password = data.get('senha');

		// Cadastrar empresa e usuário
		try {
			await apiClient.post('/public/register', {
				razaoSocial: data.get('razaoSocial'),
				nomeFantasia: data.get('nomeFantasia'),
				cnpj: data.get('cnpj').replace(/\D/g, ''),
				adminNome: data.get('nome'),
				adminSenha: password,
				adminCpf: cpf,
				adminEmail: data.get('email'),
				adminDataNascimento: data.get('dataNascimento'),
				adminTelefone: data.get('telefone'),
			});
		} catch (e) {
			if (e instanceof ApiError) {
				return error(e.status, e.message);
			}
			logger.error(e);
			return error(500, 'Erro interno do servidor');
		}

		// Tentar login automático após cadastro bem-sucedido
		try {
			const credentials = btoa(`${cpf}:${password}`);
			await apiClient.post('/authenticate', {}, {
				headers: {
					Authorization: `Basic ${credentials}`,
				}
			});
			return { redirect: '/dashboard' };
		} catch (e) {
			// Login falhou mas cadastro foi bem-sucedido - redireciona para tela de login
			logger.error('Falha no login automático após cadastro:', e);

			return { redirect: `/login?username=${encodeURIComponent(cpf)}` };
		}
	}
};