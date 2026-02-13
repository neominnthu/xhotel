import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StayController::checkIn
 * @see app/Http/Controllers/Api/StayController.php:14
 * @route '/api/v1/stays/{stay}/check-in'
 */
export const checkIn = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

checkIn.definition = {
    methods: ["post"],
    url: '/api/v1/stays/{stay}/check-in',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StayController::checkIn
 * @see app/Http/Controllers/Api/StayController.php:14
 * @route '/api/v1/stays/{stay}/check-in'
 */
checkIn.url = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkIn.definition.url
            .replace('{stay}', parsedArgs.stay.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StayController::checkIn
 * @see app/Http/Controllers/Api/StayController.php:14
 * @route '/api/v1/stays/{stay}/check-in'
 */
checkIn.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkIn.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StayController::checkIn
 * @see app/Http/Controllers/Api/StayController.php:14
 * @route '/api/v1/stays/{stay}/check-in'
 */
    const checkInForm = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkIn.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StayController::checkIn
 * @see app/Http/Controllers/Api/StayController.php:14
 * @route '/api/v1/stays/{stay}/check-in'
 */
        checkInForm.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkIn.url(args, options),
            method: 'post',
        })
    
    checkIn.form = checkInForm
/**
* @see \App\Http\Controllers\Api\StayController::checkOut
 * @see app/Http/Controllers/Api/StayController.php:30
 * @route '/api/v1/stays/{stay}/check-out'
 */
export const checkOut = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(args, options),
    method: 'post',
})

checkOut.definition = {
    methods: ["post"],
    url: '/api/v1/stays/{stay}/check-out',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StayController::checkOut
 * @see app/Http/Controllers/Api/StayController.php:30
 * @route '/api/v1/stays/{stay}/check-out'
 */
checkOut.url = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkOut.definition.url
            .replace('{stay}', parsedArgs.stay.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StayController::checkOut
 * @see app/Http/Controllers/Api/StayController.php:30
 * @route '/api/v1/stays/{stay}/check-out'
 */
checkOut.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkOut.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\StayController::checkOut
 * @see app/Http/Controllers/Api/StayController.php:30
 * @route '/api/v1/stays/{stay}/check-out'
 */
    const checkOutForm = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkOut.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\StayController::checkOut
 * @see app/Http/Controllers/Api/StayController.php:30
 * @route '/api/v1/stays/{stay}/check-out'
 */
        checkOutForm.post = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkOut.url(args, options),
            method: 'post',
        })
    
    checkOut.form = checkOutForm
const StayController = { checkIn, checkOut }

export default StayController