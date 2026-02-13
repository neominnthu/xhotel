import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CashierShiftController::open
 * @see app/Http/Controllers/Api/CashierShiftController.php:14
 * @route '/api/v1/cashier-shifts/open'
 */
export const open = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

open.definition = {
    methods: ["post"],
    url: '/api/v1/cashier-shifts/open',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\CashierShiftController::open
 * @see app/Http/Controllers/Api/CashierShiftController.php:14
 * @route '/api/v1/cashier-shifts/open'
 */
open.url = (options?: RouteQueryOptions) => {
    return open.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CashierShiftController::open
 * @see app/Http/Controllers/Api/CashierShiftController.php:14
 * @route '/api/v1/cashier-shifts/open'
 */
open.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\CashierShiftController::open
 * @see app/Http/Controllers/Api/CashierShiftController.php:14
 * @route '/api/v1/cashier-shifts/open'
 */
    const openForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: open.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CashierShiftController::open
 * @see app/Http/Controllers/Api/CashierShiftController.php:14
 * @route '/api/v1/cashier-shifts/open'
 */
        openForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: open.url(options),
            method: 'post',
        })
    
    open.form = openForm
/**
* @see \App\Http\Controllers\Api\CashierShiftController::close
 * @see app/Http/Controllers/Api/CashierShiftController.php:23
 * @route '/api/v1/cashier-shifts/{cashierShift}/close'
 */
export const close = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/api/v1/cashier-shifts/{cashierShift}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\CashierShiftController::close
 * @see app/Http/Controllers/Api/CashierShiftController.php:23
 * @route '/api/v1/cashier-shifts/{cashierShift}/close'
 */
close.url = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cashierShift: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cashierShift: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cashierShift: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cashierShift: typeof args.cashierShift === 'object'
                ? args.cashierShift.id
                : args.cashierShift,
                }

    return close.definition.url
            .replace('{cashierShift}', parsedArgs.cashierShift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CashierShiftController::close
 * @see app/Http/Controllers/Api/CashierShiftController.php:23
 * @route '/api/v1/cashier-shifts/{cashierShift}/close'
 */
close.post = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\CashierShiftController::close
 * @see app/Http/Controllers/Api/CashierShiftController.php:23
 * @route '/api/v1/cashier-shifts/{cashierShift}/close'
 */
    const closeForm = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CashierShiftController::close
 * @see app/Http/Controllers/Api/CashierShiftController.php:23
 * @route '/api/v1/cashier-shifts/{cashierShift}/close'
 */
        closeForm.post = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
/**
* @see \App\Http\Controllers\Api\CashierShiftController::current
 * @see app/Http/Controllers/Api/CashierShiftController.php:35
 * @route '/api/v1/cashier-shifts/current'
 */
export const current = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: current.url(options),
    method: 'get',
})

current.definition = {
    methods: ["get","head"],
    url: '/api/v1/cashier-shifts/current',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CashierShiftController::current
 * @see app/Http/Controllers/Api/CashierShiftController.php:35
 * @route '/api/v1/cashier-shifts/current'
 */
current.url = (options?: RouteQueryOptions) => {
    return current.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CashierShiftController::current
 * @see app/Http/Controllers/Api/CashierShiftController.php:35
 * @route '/api/v1/cashier-shifts/current'
 */
current.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: current.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CashierShiftController::current
 * @see app/Http/Controllers/Api/CashierShiftController.php:35
 * @route '/api/v1/cashier-shifts/current'
 */
current.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: current.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CashierShiftController::current
 * @see app/Http/Controllers/Api/CashierShiftController.php:35
 * @route '/api/v1/cashier-shifts/current'
 */
    const currentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: current.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CashierShiftController::current
 * @see app/Http/Controllers/Api/CashierShiftController.php:35
 * @route '/api/v1/cashier-shifts/current'
 */
        currentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: current.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CashierShiftController::current
 * @see app/Http/Controllers/Api/CashierShiftController.php:35
 * @route '/api/v1/cashier-shifts/current'
 */
        currentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: current.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    current.form = currentForm
const CashierShiftController = { open, close, current }

export default CashierShiftController