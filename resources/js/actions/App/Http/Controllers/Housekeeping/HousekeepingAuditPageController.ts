import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::index
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/housekeeping/audit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::index
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::index
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::index
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::index
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::index
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingAuditPageController::index
 * @see app/Http/Controllers/Housekeeping/HousekeepingAuditPageController.php:14
 * @route '/housekeeping/audit'
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
const HousekeepingAuditPageController = { index }

export default HousekeepingAuditPageController