import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Folios\FolioPageController::approve
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
export const approve = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/refunds/{refund}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Folios\FolioPageController::approve
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
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
* @see \App\Http\Controllers\Folios\FolioPageController::approve
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
approve.post = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::approve
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
    const approveForm = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::approve
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
        approveForm.post = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\RefundReceiptController::receipt
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
export const receipt = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

receipt.definition = {
    methods: ["get","head"],
    url: '/refunds/{refund}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RefundReceiptController::receipt
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
receipt.url = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return receipt.definition.url
            .replace('{refund}', parsedArgs.refund.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RefundReceiptController::receipt
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
receipt.get = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RefundReceiptController::receipt
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
receipt.head = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipt.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RefundReceiptController::receipt
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
    const receiptForm = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: receipt.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RefundReceiptController::receipt
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
        receiptForm.get = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipt.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RefundReceiptController::receipt
 * @see app/Http/Controllers/RefundReceiptController.php:12
 * @route '/refunds/{refund}/receipt'
 */
        receiptForm.head = (args: { refund: string | number | { id: string | number } } | [refund: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipt.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    receipt.form = receiptForm
const refunds = {
    approve: Object.assign(approve, approve),
receipt: Object.assign(receipt, receipt),
}

export default refunds