import { createApiClient, ApiError } from "./client";
import { logger } from "$lib/utils/logger";

export const getUsers = async (authToken, params = {}) => {
    const apiClient = createApiClient(authToken);
    try {
        const query = new URLSearchParams();
        Object.keys(params).forEach(key => {
            const value = params[key] || '';
            if (String(value).trim()) {
                query.set(key, value);
            }
        });
        if (!query.has('sort')) {
            query.set('sort', 'id,asc');
        }
        if (!query.has('page')) {
            query.set('page', '0');
        }
        if (!query.has('size')) {
            query.set('size', '10');
        }

        const url = `/usuarios?${query.toString()}`;
        const data = await apiClient.get(url);

        return { 
            users: data?.content?.map(user => ({
                id: user.id,
                name: user.nome,
                email: user.email,
                phone: user.telefone,
                cpf: user.cpf,
            })),
            pagination: {
                currentPage: data?.pageable?.pageNumber || 0,
                itemsPerPage: data?.pageable?.pageSize || 10,
                totalPages: data?.totalPages || 1,
                totalItems: data?.totalElements || 0,
            }
         };
    } catch (error) {
        if (error instanceof ApiError) {
            return { error: error.message }
        }
        logger.error('Unable to fetch users:', error);
        return { error: 'Erro interno do servidor' }
    }
}