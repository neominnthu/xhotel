import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import tasks from './tasks'
import rooms from './rooms'
/**
 * @see routes/web.php:428
 * @route '/housekeeping'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/housekeeping',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:428
 * @route '/housekeeping'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:428
 * @route '/housekeeping'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:428
 * @route '/housekeeping'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:428
 * @route '/housekeeping'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:428
 * @route '/housekeeping'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:428
 * @route '/housekeeping'
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
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::audit
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
export const audit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: audit.url(options),
    method: 'get',
})

audit.definition = {
    methods: ["get","head"],
    url: '/housekeeping/audit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::audit
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
audit.url = (options?: RouteQueryOptions) => {
    return audit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::audit
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
audit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: audit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::audit
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
audit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: audit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::audit
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
    const auditForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: audit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::audit
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
        auditForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: audit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::audit
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
        auditForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: audit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    audit.form = auditForm
/**
* @see \HousekeepingPerformancePageController::performance
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
export const performance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: performance.url(options),
    method: 'get',
})

performance.definition = {
    methods: ["get","head"],
    url: '/housekeeping/performance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \HousekeepingPerformancePageController::performance
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
performance.url = (options?: RouteQueryOptions) => {
    return performance.definition.url + queryParams(options)
}

/**
* @see \HousekeepingPerformancePageController::performance
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
performance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: performance.url(options),
    method: 'get',
})
/**
* @see \HousekeepingPerformancePageController::performance
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
performance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: performance.url(options),
    method: 'head',
})

    /**
* @see \HousekeepingPerformancePageController::performance
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
    const performanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: performance.url(options),
        method: 'get',
    })

            /**
* @see \HousekeepingPerformancePageController::performance
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
        performanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: performance.url(options),
            method: 'get',
        })
            /**
* @see \HousekeepingPerformancePageController::performance
 * @see [unknown]:0
 * @route '/housekeeping/performance'
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
const housekeeping = {
    index: Object.assign(index, index),
tasks: Object.assign(tasks, tasks),
rooms: Object.assign(rooms, rooms),
audit: Object.assign(audit, audit),
performance: Object.assign(performance, performance),
}

export default housekeeping