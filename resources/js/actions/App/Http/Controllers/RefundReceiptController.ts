import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RefundReceiptController::show
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
export const show = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/refunds/{refund}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RefundReceiptController::show
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
show.url = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { refund: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { refund: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    refund: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        refund: typeof args.refund === 'object'
                ? args.refund.id
                : args.refund,
                }

    return show.definition.url
            .replace('{refund}', parsedArgs.refund.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RefundReceiptController::show
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
show.get = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RefundReceiptController::show
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
show.head = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RefundReceiptController::show
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
    const showForm = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RefundReceiptController::show
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
        showForm.get = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RefundReceiptController::show
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
        showForm.head = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const RefundReceiptController = { show }

export default RefundReceiptController