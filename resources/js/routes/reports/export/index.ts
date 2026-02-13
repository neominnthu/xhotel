import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportsPageController::revenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
export const revenue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})

revenue.definition = {
    methods: ["get","head"],
    url: '/reports/export-revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportsPageController::revenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
revenue.url = (options?: RouteQueryOptions) => {
    return revenue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportsPageController::revenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
revenue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportsPageController::revenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
revenue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: revenue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportsPageController::revenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
    const revenueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: revenue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportsPageController::revenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
 */
        revenueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: revenue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportsPageController::revenue
 * @see app/Http/Controllers/ReportsPageController.php:69
 * @route '/reports/export-revenue'
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
const exportMethod = {
    revenue: Object.assign(revenue, revenue),
}

export default exportMethod