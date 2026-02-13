import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DashboardController::overview
 * @see app/Http/Controllers/Api/DashboardController.php:27
 * @route '/api/v1/dashboard/overview'
 */
export const overview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

overview.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::overview
 * @see app/Http/Controllers/Api/DashboardController.php:27
 * @route '/api/v1/dashboard/overview'
 */
overview.url = (options?: RouteQueryOptions) => {
    return overview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::overview
 * @see app/Http/Controllers/Api/DashboardController.php:27
 * @route '/api/v1/dashboard/overview'
 */
overview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DashboardController::overview
 * @see app/Http/Controllers/Api/DashboardController.php:27
 * @route '/api/v1/dashboard/overview'
 */
overview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overview.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DashboardController::overview
 * @see app/Http/Controllers/Api/DashboardController.php:27
 * @route '/api/v1/dashboard/overview'
 */
    const overviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overview.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DashboardController::overview
 * @see app/Http/Controllers/Api/DashboardController.php:27
 * @route '/api/v1/dashboard/overview'
 */
        overviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overview.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DashboardController::overview
 * @see app/Http/Controllers/Api/DashboardController.php:27
 * @route '/api/v1/dashboard/overview'
 */
        overviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overview.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overview.form = overviewForm
/**
* @see \App\Http\Controllers\Api\DashboardController::realtime
 * @see app/Http/Controllers/Api/DashboardController.php:53
 * @route '/api/v1/dashboard/realtime'
 */
export const realtime = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: realtime.url(options),
    method: 'get',
})

realtime.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard/realtime',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::realtime
 * @see app/Http/Controllers/Api/DashboardController.php:53
 * @route '/api/v1/dashboard/realtime'
 */
realtime.url = (options?: RouteQueryOptions) => {
    return realtime.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::realtime
 * @see app/Http/Controllers/Api/DashboardController.php:53
 * @route '/api/v1/dashboard/realtime'
 */
realtime.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: realtime.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DashboardController::realtime
 * @see app/Http/Controllers/Api/DashboardController.php:53
 * @route '/api/v1/dashboard/realtime'
 */
realtime.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: realtime.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DashboardController::realtime
 * @see app/Http/Controllers/Api/DashboardController.php:53
 * @route '/api/v1/dashboard/realtime'
 */
    const realtimeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: realtime.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DashboardController::realtime
 * @see app/Http/Controllers/Api/DashboardController.php:53
 * @route '/api/v1/dashboard/realtime'
 */
        realtimeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: realtime.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DashboardController::realtime
 * @see app/Http/Controllers/Api/DashboardController.php:53
 * @route '/api/v1/dashboard/realtime'
 */
        realtimeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: realtime.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    realtime.form = realtimeForm
/**
* @see \App\Http\Controllers\Api\DashboardController::analytics
 * @see app/Http/Controllers/Api/DashboardController.php:72
 * @route '/api/v1/dashboard/analytics'
 */
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::analytics
 * @see app/Http/Controllers/Api/DashboardController.php:72
 * @route '/api/v1/dashboard/analytics'
 */
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::analytics
 * @see app/Http/Controllers/Api/DashboardController.php:72
 * @route '/api/v1/dashboard/analytics'
 */
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DashboardController::analytics
 * @see app/Http/Controllers/Api/DashboardController.php:72
 * @route '/api/v1/dashboard/analytics'
 */
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DashboardController::analytics
 * @see app/Http/Controllers/Api/DashboardController.php:72
 * @route '/api/v1/dashboard/analytics'
 */
    const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DashboardController::analytics
 * @see app/Http/Controllers/Api/DashboardController.php:72
 * @route '/api/v1/dashboard/analytics'
 */
        analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DashboardController::analytics
 * @see app/Http/Controllers/Api/DashboardController.php:72
 * @route '/api/v1/dashboard/analytics'
 */
        analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analytics.form = analyticsForm
/**
* @see \App\Http\Controllers\Api\DashboardController::performance
 * @see app/Http/Controllers/Api/DashboardController.php:98
 * @route '/api/v1/dashboard/performance'
 */
export const performance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: performance.url(options),
    method: 'get',
})

performance.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard/performance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::performance
 * @see app/Http/Controllers/Api/DashboardController.php:98
 * @route '/api/v1/dashboard/performance'
 */
performance.url = (options?: RouteQueryOptions) => {
    return performance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::performance
 * @see app/Http/Controllers/Api/DashboardController.php:98
 * @route '/api/v1/dashboard/performance'
 */
performance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: performance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\DashboardController::performance
 * @see app/Http/Controllers/Api/DashboardController.php:98
 * @route '/api/v1/dashboard/performance'
 */
performance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: performance.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\DashboardController::performance
 * @see app/Http/Controllers/Api/DashboardController.php:98
 * @route '/api/v1/dashboard/performance'
 */
    const performanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: performance.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\DashboardController::performance
 * @see app/Http/Controllers/Api/DashboardController.php:98
 * @route '/api/v1/dashboard/performance'
 */
        performanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: performance.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\DashboardController::performance
 * @see app/Http/Controllers/Api/DashboardController.php:98
 * @route '/api/v1/dashboard/performance'
 */
        performanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: performance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    performance.form = performanceForm
const DashboardController = { overview, realtime, analytics, performance }

export default DashboardController