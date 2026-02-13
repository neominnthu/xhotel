import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:15
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
 * @see app/Http/Controllers/Folios/FolioPageController.php:15
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
 * @see app/Http/Controllers/Folios/FolioPageController.php:15
 * @route '/folios/{folio}/charges'
 */
storeCharge.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCharge.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:15
 * @route '/folios/{folio}/charges'
 */
    const storeChargeForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCharge.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::storeCharge
 * @see app/Http/Controllers/Folios/FolioPageController.php:15
 * @route '/folios/{folio}/charges'
 */
        storeChargeForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCharge.url(args, options),
            method: 'post',
        })
    
    storeCharge.form = storeChargeForm
/**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:28
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
 * @see app/Http/Controllers/Folios/FolioPageController.php:28
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
 * @see app/Http/Controllers/Folios/FolioPageController.php:28
 * @route '/folios/{folio}/payments'
 */
storePayment.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:28
 * @route '/folios/{folio}/payments'
 */
    const storePaymentForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::storePayment
 * @see app/Http/Controllers/Folios/FolioPageController.php:28
 * @route '/folios/{folio}/payments'
 */
        storePaymentForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePayment.url(args, options),
            method: 'post',
        })
    
    storePayment.form = storePaymentForm
const FolioPageController = { storeCharge, storePayment }

export default FolioPageController