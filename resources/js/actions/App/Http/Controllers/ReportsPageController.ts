import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportsPageController::index
 * @see app/Http/Controllers/ReportsPageController.php:14
 * @route '/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportsPageController::index
 * @see app/Http/Controllers/ReportsPageController.php:14
 * @route '/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportsPageController::index
 * @see app/Http/Controllers/ReportsPageController.php:14
 * @route '/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportsPageController::index
 * @see app/Http/Controllers/ReportsPageController.php:14
 * @route '/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportsPageController::index
 * @see app/Http/Controllers/ReportsPageController.php:14
 * @route '/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportsPageController::index
 * @see app/Http/Controllers/ReportsPageController.php:14
 * @route '/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportsPageController::index
 * @see app/Http/Controllers/ReportsPageController.php:14
 * @route '/reports'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ReportsPageController::exportMethod
 * @see app/Http/Controllers/ReportsPageController.php:37
 * @route '/reports/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportsPageController::exportMethod
 * @see app/Http/Controllers/ReportsPageController.php:37
 * @route '/reports/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportsPageController::exportMethod
 * @see app/Http/Controllers/ReportsPageController.php:37
 * @route '/reports/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportsPageController::exportMethod
 * @see app/Http/Controllers/ReportsPageController.php:37
 * @route '/reports/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportsPageController::exportMethod
 * @see app/Http/Controllers/ReportsPageController.php:37
 * @route '/reports/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportsPageController::exportMethod
 * @see app/Http/Controllers/ReportsPageController.php:37
 * @route '/reports/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportsPageController::exportMethod
 * @see app/Http/Controllers/ReportsPageController.php:37
 * @route '/reports/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\ReportsPageController::exportRevenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
export const exportRevenue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRevenue.url(options),
    method: 'get',
})

exportRevenue.definition = {
    methods: ["get","head"],
    url: '/reports/export-revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportsPageController::exportRevenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
exportRevenue.url = (options?: RouteQueryOptions) => {
    return exportRevenue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportsPageController::exportRevenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
exportRevenue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRevenue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportsPageController::exportRevenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
exportRevenue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportRevenue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportsPageController::exportRevenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
    const exportRevenueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportRevenue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportsPageController::exportRevenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
        exportRevenueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportRevenue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportsPageController::exportRevenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
        exportRevenueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportRevenue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportRevenue.form = exportRevenueForm
const ReportsPageController = { index, exportMethod, exportRevenue, export: exportMethod }

export default ReportsPageController