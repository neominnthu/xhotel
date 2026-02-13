import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ReportsController::occupancy
 * @see app/Http/Controllers/Api/ReportsController.php:13
 * @route '/api/v1/reports/occupancy'
 */
export const occupancy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})

occupancy.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/occupancy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportsController::occupancy
 * @see app/Http/Controllers/Api/ReportsController.php:13
 * @route '/api/v1/reports/occupancy'
 */
occupancy.url = (options?: RouteQueryOptions) => {
    return occupancy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportsController::occupancy
 * @see app/Http/Controllers/Api/ReportsController.php:13
 * @route '/api/v1/reports/occupancy'
 */
occupancy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportsController::occupancy
 * @see app/Http/Controllers/Api/ReportsController.php:13
 * @route '/api/v1/reports/occupancy'
 */
occupancy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: occupancy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportsController::occupancy
 * @see app/Http/Controllers/Api/ReportsController.php:13
 * @route '/api/v1/reports/occupancy'
 */
    const occupancyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: occupancy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportsController::occupancy
 * @see app/Http/Controllers/Api/ReportsController.php:13
 * @route '/api/v1/reports/occupancy'
 */
        occupancyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportsController::occupancy
 * @see app/Http/Controllers/Api/ReportsController.php:13
 * @route '/api/v1/reports/occupancy'
 */
        occupancyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    occupancy.form = occupancyForm
/**
* @see \App\Http\Controllers\Api\ReportsController::revenue
 * @see app/Http/Controllers/Api/ReportsController.php:32
 * @route '/api/v1/reports/revenue'
 */
export const revenue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})

revenue.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportsController::revenue
 * @see app/Http/Controllers/Api/ReportsController.php:32
 * @route '/api/v1/reports/revenue'
 */
revenue.url = (options?: RouteQueryOptions) => {
    return revenue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportsController::revenue
 * @see app/Http/Controllers/Api/ReportsController.php:32
 * @route '/api/v1/reports/revenue'
 */
revenue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportsController::revenue
 * @see app/Http/Controllers/Api/ReportsController.php:32
 * @route '/api/v1/reports/revenue'
 */
revenue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: revenue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportsController::revenue
 * @see app/Http/Controllers/Api/ReportsController.php:32
 * @route '/api/v1/reports/revenue'
 */
    const revenueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: revenue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportsController::revenue
 * @see app/Http/Controllers/Api/ReportsController.php:32
 * @route '/api/v1/reports/revenue'
 */
        revenueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: revenue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportsController::revenue
 * @see app/Http/Controllers/Api/ReportsController.php:32
 * @route '/api/v1/reports/revenue'
 */
        revenueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: revenue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    revenue.form = revenueForm
/**
* @see \App\Http\Controllers\Api\ReportsController::occupancyExport
 * @see app/Http/Controllers/Api/ReportsController.php:49
 * @route '/api/v1/reports/occupancy/export'
 */
export const occupancyExport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancyExport.url(options),
    method: 'get',
})

occupancyExport.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/occupancy/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportsController::occupancyExport
 * @see app/Http/Controllers/Api/ReportsController.php:49
 * @route '/api/v1/reports/occupancy/export'
 */
occupancyExport.url = (options?: RouteQueryOptions) => {
    return occupancyExport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportsController::occupancyExport
 * @see app/Http/Controllers/Api/ReportsController.php:49
 * @route '/api/v1/reports/occupancy/export'
 */
occupancyExport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: occupancyExport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportsController::occupancyExport
 * @see app/Http/Controllers/Api/ReportsController.php:49
 * @route '/api/v1/reports/occupancy/export'
 */
occupancyExport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: occupancyExport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportsController::occupancyExport
 * @see app/Http/Controllers/Api/ReportsController.php:49
 * @route '/api/v1/reports/occupancy/export'
 */
    const occupancyExportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: occupancyExport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportsController::occupancyExport
 * @see app/Http/Controllers/Api/ReportsController.php:49
 * @route '/api/v1/reports/occupancy/export'
 */
        occupancyExportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancyExport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportsController::occupancyExport
 * @see app/Http/Controllers/Api/ReportsController.php:49
 * @route '/api/v1/reports/occupancy/export'
 */
        occupancyExportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: occupancyExport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    occupancyExport.form = occupancyExportForm
/**
* @see \App\Http\Controllers\Api\ReportsController::revenueExport
 * @see app/Http/Controllers/Api/ReportsController.php:81
 * @route '/api/v1/reports/revenue/export'
 */
export const revenueExport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenueExport.url(options),
    method: 'get',
})

revenueExport.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/revenue/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReportsController::revenueExport
 * @see app/Http/Controllers/Api/ReportsController.php:81
 * @route '/api/v1/reports/revenue/export'
 */
revenueExport.url = (options?: RouteQueryOptions) => {
    return revenueExport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReportsController::revenueExport
 * @see app/Http/Controllers/Api/ReportsController.php:81
 * @route '/api/v1/reports/revenue/export'
 */
revenueExport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenueExport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReportsController::revenueExport
 * @see app/Http/Controllers/Api/ReportsController.php:81
 * @route '/api/v1/reports/revenue/export'
 */
revenueExport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: revenueExport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReportsController::revenueExport
 * @see app/Http/Controllers/Api/ReportsController.php:81
 * @route '/api/v1/reports/revenue/export'
 */
    const revenueExportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: revenueExport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReportsController::revenueExport
 * @see app/Http/Controllers/Api/ReportsController.php:81
 * @route '/api/v1/reports/revenue/export'
 */
        revenueExportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: revenueExport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReportsController::revenueExport
 * @see app/Http/Controllers/Api/ReportsController.php:81
 * @route '/api/v1/reports/revenue/export'
 */
        revenueExportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: revenueExport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    revenueExport.form = revenueExportForm
const ReportsController = { occupancy, revenue, occupancyExport, revenueExport }

export default ReportsController