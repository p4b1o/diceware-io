import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
    const langFromQuery = url.searchParams.get('lang');

    return {
        langFromQuery
    };
};