/**
 * Build query string dari object filter
 */
export function buildQueryString(filter: Record<string, any>): string {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    return params.toString();
}

/**
 * Combine filter + query params dari URL
 */
export function combineParams(filter: Record<string, any>, searchParams: URLSearchParams) {
    const combined: Record<string, any> = { ...filter };

    searchParams.forEach((value, key) => {
        if (value !== undefined && value !== null && value !== '') {
            combined[key] = value;
        }
    });

    return combined;
}