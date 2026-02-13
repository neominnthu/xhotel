import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RefundController::approve
 * @see app/Http/Controllers/Api/RefundController.php:13
 * @route '/api/v1/refunds/{refund}/approve'
 */
export const approve = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/api/v1/refunds/{refund}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RefundController::approve
 * @see app/Http/Controllers/Api/RefundController.php:13
 * @route '/api/v1/refunds/{refund}/approve'
 */
approve.url = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{refund}', parsedArgs.refund.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RefundController::approve
 * @see app/Http/Controllers/Api/RefundController.php:13
 * @route '/api/v1/refunds/{refund}/approve'
 */
approve.post = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\RefundController::approve
 * @see app/Http/Controllers/Api/RefundController.php:13
 * @route '/api/v1/refunds/{refund}/approve'
 */
    const approveForm = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\RefundController::approve
 * @see app/Http/Controllers/Api/RefundController.php:13
 * @route '/api/v1/refunds/{refund}/approve'
 */
        approveForm.post = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
const RefundController = { approve }

export default RefundController