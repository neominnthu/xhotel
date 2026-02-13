import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \HousekeepingPerformancePageController::index
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/housekeeping/performance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \HousekeepingPerformancePageController::index
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \HousekeepingPerformancePageController::index
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \HousekeepingPerformancePageController::index
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \HousekeepingPerformancePageController::index
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \HousekeepingPerformancePageController::index
 * @see [unknown]:0
 * @route '/housekeeping/performance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \HousekeepingPerformancePageController::index
 * @see [unknown]:0
 * @route '/housekeeping/performance'
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
const HousekeepingPerformancePageController = { index }

export default HousekeepingPerformancePageController