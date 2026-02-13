import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::show
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
export const show = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/front-desk/check-out/{stay}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::show
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
show.url = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stay: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stay: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stay: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stay: typeof args.stay === 'object'
                ? args.stay.id
                : args.stay,
                }

    return show.definition.url
            .replace('{stay}', parsedArgs.stay.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::show
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
show.get = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::show
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
show.head = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::show
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
    const showForm = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::show
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
        showForm.get = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::show
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
        showForm.head = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const CheckOutPageController = { show }

export default CheckOutPageController