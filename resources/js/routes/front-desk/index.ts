import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FrontDesk\CheckInPageController::checkIn
 * @see app/Http/Controllers/FrontDesk/CheckInPageController.php:13
 * @route '/front-desk/check-in/{reservation}'
 */
export const checkIn = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkIn.url(args, options),
    method: 'get',
})

checkIn.definition = {
    methods: ["get","head"],
    url: '/front-desk/check-in/{reservation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FrontDesk\CheckInPageController::checkIn
 * @see app/Http/Controllers/FrontDesk/CheckInPageController.php:13
 * @route '/front-desk/check-in/{reservation}'
 */
checkIn.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return checkIn.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FrontDesk\CheckInPageController::checkIn
 * @see app/Http/Controllers/FrontDesk/CheckInPageController.php:13
 * @route '/front-desk/check-in/{reservation}'
 */
checkIn.get = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkIn.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FrontDesk\CheckInPageController::checkIn
 * @see app/Http/Controllers/FrontDesk/CheckInPageController.php:13
 * @route '/front-desk/check-in/{reservation}'
 */
checkIn.head = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkIn.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FrontDesk\CheckInPageController::checkIn
 * @see app/Http/Controllers/FrontDesk/CheckInPageController.php:13
 * @route '/front-desk/check-in/{reservation}'
 */
    const checkInForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkIn.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FrontDesk\CheckInPageController::checkIn
 * @see app/Http/Controllers/FrontDesk/CheckInPageController.php:13
 * @route '/front-desk/check-in/{reservation}'
 */
        checkInForm.get = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkIn.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FrontDesk\CheckInPageController::checkIn
 * @see app/Http/Controllers/FrontDesk/CheckInPageController.php:13
 * @route '/front-desk/check-in/{reservation}'
 */
        checkInForm.head = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkIn.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkIn.form = checkInForm
/**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::checkOut
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
export const checkOut = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkOut.url(args, options),
    method: 'get',
})

checkOut.definition = {
    methods: ["get","head"],
    url: '/front-desk/check-out/{stay}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::checkOut
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
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
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::checkOut
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
checkOut.get = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkOut.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::checkOut
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
checkOut.head = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkOut.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::checkOut
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
    const checkOutForm = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkOut.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::checkOut
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
        checkOutForm.get = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkOut.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FrontDesk\CheckOutPageController::checkOut
 * @see app/Http/Controllers/FrontDesk/CheckOutPageController.php:12
 * @route '/front-desk/check-out/{stay}'
 */
        checkOutForm.head = (args: { stay: number | { id: number } } | [stay: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkOut.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkOut.form = checkOutForm
const frontDesk = {
    checkIn: Object.assign(checkIn, checkIn),
checkOut: Object.assign(checkOut, checkOut),
}

export default frontDesk