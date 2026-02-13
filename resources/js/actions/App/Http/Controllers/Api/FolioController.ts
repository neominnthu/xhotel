import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\FolioController::show
 * @see app/Http/Controllers/Api/FolioController.php:17
 * @route '/api/v1/folios/{folio}'
 */
export const show = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/folios/{folio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\FolioController::show
 * @see app/Http/Controllers/Api/FolioController.php:17
 * @route '/api/v1/folios/{folio}'
 */
show.url = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{folio}', parsedArgs.folio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\FolioController::show
 * @see app/Http/Controllers/Api/FolioController.php:17
 * @route '/api/v1/folios/{folio}'
 */
show.get = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\FolioController::show
 * @see app/Http/Controllers/Api/FolioController.php:17
 * @route '/api/v1/folios/{folio}'
 */
show.head = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\FolioController::show
 * @see app/Http/Controllers/Api/FolioController.php:17
 * @route '/api/v1/folios/{folio}'
 */
    const showForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\FolioController::show
 * @see app/Http/Controllers/Api/FolioController.php:17
 * @route '/api/v1/folios/{folio}'
 */
        showForm.get = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\FolioController::show
 * @see app/Http/Controllers/Api/FolioController.php:17
 * @route '/api/v1/folios/{folio}'
 */
        showForm.head = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\FolioController::storeCharge
 * @see app/Http/Controllers/Api/FolioController.php:61
 * @route '/api/v1/folios/{folio}/charges'
 */
export const storeCharge = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCharge.url(args, options),
    method: 'post',
})

storeCharge.definition = {
    methods: ["post"],
    url: '/api/v1/folios/{folio}/charges',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FolioController::storeCharge
 * @see app/Http/Controllers/Api/FolioController.php:61
 * @route '/api/v1/folios/{folio}/charges'
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
* @see \App\Http\Controllers\Api\FolioController::storeCharge
 * @see app/Http/Controllers/Api/FolioController.php:61
 * @route '/api/v1/folios/{folio}/charges'
 */
storeCharge.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCharge.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\FolioController::storeCharge
 * @see app/Http/Controllers/Api/FolioController.php:61
 * @route '/api/v1/folios/{folio}/charges'
 */
    const storeChargeForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCharge.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\FolioController::storeCharge
 * @see app/Http/Controllers/Api/FolioController.php:61
 * @route '/api/v1/folios/{folio}/charges'
 */
        storeChargeForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCharge.url(args, options),
            method: 'post',
        })
    
    storeCharge.form = storeChargeForm
/**
* @see \App\Http\Controllers\Api\FolioController::storePayment
 * @see app/Http/Controllers/Api/FolioController.php:79
 * @route '/api/v1/folios/{folio}/payments'
 */
export const storePayment = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/api/v1/folios/{folio}/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FolioController::storePayment
 * @see app/Http/Controllers/Api/FolioController.php:79
 * @route '/api/v1/folios/{folio}/payments'
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
* @see \App\Http\Controllers\Api\FolioController::storePayment
 * @see app/Http/Controllers/Api/FolioController.php:79
 * @route '/api/v1/folios/{folio}/payments'
 */
storePayment.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\FolioController::storePayment
 * @see app/Http/Controllers/Api/FolioController.php:79
 * @route '/api/v1/folios/{folio}/payments'
 */
    const storePaymentForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\FolioController::storePayment
 * @see app/Http/Controllers/Api/FolioController.php:79
 * @route '/api/v1/folios/{folio}/payments'
 */
        storePaymentForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePayment.url(args, options),
            method: 'post',
        })
    
    storePayment.form = storePaymentForm
/**
* @see \App\Http\Controllers\Api\FolioController::storeRefund
 * @see app/Http/Controllers/Api/FolioController.php:97
 * @route '/api/v1/folios/{folio}/refunds'
 */
export const storeRefund = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRefund.url(args, options),
    method: 'post',
})

storeRefund.definition = {
    methods: ["post"],
    url: '/api/v1/folios/{folio}/refunds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\FolioController::storeRefund
 * @see app/Http/Controllers/Api/FolioController.php:97
 * @route '/api/v1/folios/{folio}/refunds'
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
* @see \App\Http\Controllers\Api\FolioController::storeRefund
 * @see app/Http/Controllers/Api/FolioController.php:97
 * @route '/api/v1/folios/{folio}/refunds'
 */
storeRefund.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRefund.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\FolioController::storeRefund
 * @see app/Http/Controllers/Api/FolioController.php:97
 * @route '/api/v1/folios/{folio}/refunds'
 */
    const storeRefundForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeRefund.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\FolioController::storeRefund
 * @see app/Http/Controllers/Api/FolioController.php:97
 * @route '/api/v1/folios/{folio}/refunds'
 */
        storeRefundForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeRefund.url(args, options),
            method: 'post',
        })
    
    storeRefund.form = storeRefundForm
const FolioController = { show, storeCharge, storePayment, storeRefund }

export default FolioController