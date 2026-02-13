import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getStaffPerformance
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:21
 * @route '/api/v1/housekeeping/performance/staff/{user}'
 */
export const getStaffPerformance = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStaffPerformance.url(args, options),
    method: 'get',
})

getStaffPerformance.definition = {
    methods: ["get","head"],
    url: '/api/v1/housekeeping/performance/staff/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getStaffPerformance
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:21
 * @route '/api/v1/housekeeping/performance/staff/{user}'
 */
getStaffPerformance.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return getStaffPerformance.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getStaffPerformance
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:21
 * @route '/api/v1/housekeeping/performance/staff/{user}'
 */
getStaffPerformance.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStaffPerformance.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getStaffPerformance
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:21
 * @route '/api/v1/housekeeping/performance/staff/{user}'
 */
getStaffPerformance.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStaffPerformance.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getStaffPerformance
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:21
 * @route '/api/v1/housekeeping/performance/staff/{user}'
 */
    const getStaffPerformanceForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStaffPerformance.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getStaffPerformance
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:21
 * @route '/api/v1/housekeeping/performance/staff/{user}'
 */
        getStaffPerformanceForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStaffPerformance.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getStaffPerformance
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:21
 * @route '/api/v1/housekeeping/performance/staff/{user}'
 */
        getStaffPerformanceForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStaffPerformance.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStaffPerformance.form = getStaffPerformanceForm
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceTrends
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:43
 * @route '/api/v1/housekeeping/performance/staff/{user}/trends'
 */
export const getPerformanceTrends = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPerformanceTrends.url(args, options),
    method: 'get',
})

getPerformanceTrends.definition = {
    methods: ["get","head"],
    url: '/api/v1/housekeeping/performance/staff/{user}/trends',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceTrends
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:43
 * @route '/api/v1/housekeeping/performance/staff/{user}/trends'
 */
getPerformanceTrends.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return getPerformanceTrends.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceTrends
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:43
 * @route '/api/v1/housekeeping/performance/staff/{user}/trends'
 */
getPerformanceTrends.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPerformanceTrends.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceTrends
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:43
 * @route '/api/v1/housekeeping/performance/staff/{user}/trends'
 */
getPerformanceTrends.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPerformanceTrends.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceTrends
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:43
 * @route '/api/v1/housekeeping/performance/staff/{user}/trends'
 */
    const getPerformanceTrendsForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPerformanceTrends.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceTrends
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:43
 * @route '/api/v1/housekeeping/performance/staff/{user}/trends'
 */
        getPerformanceTrendsForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPerformanceTrends.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceTrends
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:43
 * @route '/api/v1/housekeeping/performance/staff/{user}/trends'
 */
        getPerformanceTrendsForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPerformanceTrends.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPerformanceTrends.form = getPerformanceTrendsForm
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getTopPerformers
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:59
 * @route '/api/v1/housekeeping/performance/top-performers'
 */
export const getTopPerformers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTopPerformers.url(options),
    method: 'get',
})

getTopPerformers.definition = {
    methods: ["get","head"],
    url: '/api/v1/housekeeping/performance/top-performers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getTopPerformers
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:59
 * @route '/api/v1/housekeeping/performance/top-performers'
 */
getTopPerformers.url = (options?: RouteQueryOptions) => {
    return getTopPerformers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getTopPerformers
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:59
 * @route '/api/v1/housekeeping/performance/top-performers'
 */
getTopPerformers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTopPerformers.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getTopPerformers
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:59
 * @route '/api/v1/housekeeping/performance/top-performers'
 */
getTopPerformers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTopPerformers.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getTopPerformers
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:59
 * @route '/api/v1/housekeeping/performance/top-performers'
 */
    const getTopPerformersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTopPerformers.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getTopPerformers
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:59
 * @route '/api/v1/housekeeping/performance/top-performers'
 */
        getTopPerformersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTopPerformers.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getTopPerformers
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:59
 * @route '/api/v1/housekeeping/performance/top-performers'
 */
        getTopPerformersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTopPerformers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTopPerformers.form = getTopPerformersForm
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getOverallMetrics
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:77
 * @route '/api/v1/housekeeping/performance/metrics'
 */
export const getOverallMetrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getOverallMetrics.url(options),
    method: 'get',
})

getOverallMetrics.definition = {
    methods: ["get","head"],
    url: '/api/v1/housekeeping/performance/metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getOverallMetrics
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:77
 * @route '/api/v1/housekeeping/performance/metrics'
 */
getOverallMetrics.url = (options?: RouteQueryOptions) => {
    return getOverallMetrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getOverallMetrics
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:77
 * @route '/api/v1/housekeeping/performance/metrics'
 */
getOverallMetrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getOverallMetrics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getOverallMetrics
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:77
 * @route '/api/v1/housekeeping/performance/metrics'
 */
getOverallMetrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getOverallMetrics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getOverallMetrics
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:77
 * @route '/api/v1/housekeeping/performance/metrics'
 */
    const getOverallMetricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getOverallMetrics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getOverallMetrics
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:77
 * @route '/api/v1/housekeeping/performance/metrics'
 */
        getOverallMetricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getOverallMetrics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getOverallMetrics
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:77
 * @route '/api/v1/housekeeping/performance/metrics'
 */
        getOverallMetricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getOverallMetrics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getOverallMetrics.form = getOverallMetricsForm
/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceComparison
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:95
 * @route '/api/v1/housekeeping/performance/comparison'
 */
export const getPerformanceComparison = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getPerformanceComparison.url(options),
    method: 'post',
})

getPerformanceComparison.definition = {
    methods: ["post"],
    url: '/api/v1/housekeeping/performance/comparison',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceComparison
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:95
 * @route '/api/v1/housekeeping/performance/comparison'
 */
getPerformanceComparison.url = (options?: RouteQueryOptions) => {
    return getPerformanceComparison.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceComparison
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:95
 * @route '/api/v1/housekeeping/performance/comparison'
 */
getPerformanceComparison.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getPerformanceComparison.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceComparison
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:95
 * @route '/api/v1/housekeeping/performance/comparison'
 */
    const getPerformanceComparisonForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: getPerformanceComparison.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingPerformanceController::getPerformanceComparison
 * @see app/Http/Controllers/Api/HousekeepingPerformanceController.php:95
 * @route '/api/v1/housekeeping/performance/comparison'
 */
        getPerformanceComparisonForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: getPerformanceComparison.url(options),
            method: 'post',
        })
    
    getPerformanceComparison.form = getPerformanceComparisonForm
const HousekeepingPerformanceController = { getStaffPerformance, getPerformanceTrends, getTopPerformers, getOverallMetrics, getPerformanceComparison }

export default HousekeepingPerformanceController