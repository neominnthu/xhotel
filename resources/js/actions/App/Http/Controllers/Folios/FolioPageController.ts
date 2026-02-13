import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:19
 * @route '/folios/{folio}/charges'
 */
export const storeCharge = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCharge.url(args, options),
    method: 'post',
})

storeCharge.definition = {
    methods: ["post"],
    url: '/folios/{folio}/charges',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:19
 * @route '/folios/{folio}/charges'
 */
storeCharge.url = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { folio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { folio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    folio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        folio: typeof args.folio === 'object'
                ? args.folio.id
                : args.folio,
                }

    return storeCharge.definition.url
            .replace('{folio}', parsedArgs.folio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:19
 * @route '/folios/{folio}/charges'
 */
storeCharge.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCharge.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:19
 * @route '/folios/{folio}/charges'
 */
    const storeChargeForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCharge.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:19
 * @route '/folios/{folio}/charges'
 */
        storeChargeForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCharge.url(args, options),
            method: 'post',
        })
    
    storeCharge.form = storeChargeForm
/**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
export const storePayment = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/folios/{folio}/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
storePayment.url = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { folio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { folio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    folio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        folio: typeof args.folio === 'object'
                ? args.folio.id
                : args.folio,
                }

    return storePayment.definition.url
            .replace('{folio}', parsedArgs.folio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
storePayment.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
    const storePaymentForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
        storePaymentForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePayment.url(args, options),
            method: 'post',
        })
    
    storePayment.form = storePaymentForm
/**
* @see \App\Http\Controllers\Folios\FolioPageController::storeRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:45
 * @route '/folios/{folio}/refunds'
 */
export const storeRefund = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRefund.url(args, options),
    method: 'post',
})

storeRefund.definition = {
    methods: ["post"],
    url: '/folios/{folio}/refunds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Folios\FolioPageController::storeRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:45
 * @route '/folios/{folio}/refunds'
 */
storeRefund.url = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { folio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { folio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    folio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        folio: typeof args.folio === 'object'
                ? args.folio.id
                : args.folio,
                }

    return storeRefund.definition.url
            .replace('{folio}', parsedArgs.folio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Folios\FolioPageController::storeRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:45
 * @route '/folios/{folio}/refunds'
 */
storeRefund.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRefund.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::storeRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:45
 * @route '/folios/{folio}/refunds'
 */
    const storeRefundForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeRefund.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::storeRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:45
 * @route '/folios/{folio}/refunds'
 */
        storeRefundForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeRefund.url(args, options),
            method: 'post',
        })
    
    storeRefund.form = storeRefundForm
/**
* @see \App\Http\Controllers\Folios\FolioPageController::approveRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
export const approveRefund = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRefund.url(args, options),
    method: 'post',
})

approveRefund.definition = {
    methods: ["post"],
    url: '/refunds/{refund}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Folios\FolioPageController::approveRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
approveRefund.url = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approveRefund.definition.url
            .replace('{refund}', parsedArgs.refund.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Folios\FolioPageController::approveRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
approveRefund.post = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRefund.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::approveRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
    const approveRefundForm = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveRefund.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::approveRefund
 * @see app/Http/Controllers/Folios/FolioPageController.php:58
 * @route '/refunds/{refund}/approve'
 */
        approveRefundForm.post = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveRefund.url(args, options),
            method: 'post',
        })
    
    approveRefund.form = approveRefundForm
const FolioPageController = { storeCharge, storePayment, storeRefund, approveRefund }

export default FolioPageController