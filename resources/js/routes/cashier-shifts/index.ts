import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CashierShiftPageController::index
 * @see app/Http/Controllers/CashierShiftPageController.php:19
 * @route '/cashier-shifts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cashier-shifts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CashierShiftPageController::index
 * @see app/Http/Controllers/CashierShiftPageController.php:19
 * @route '/cashier-shifts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CashierShiftPageController::index
 * @see app/Http/Controllers/CashierShiftPageController.php:19
 * @route '/cashier-shifts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CashierShiftPageController::index
 * @see app/Http/Controllers/CashierShiftPageController.php:19
 * @route '/cashier-shifts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CashierShiftPageController::index
 * @see app/Http/Controllers/CashierShiftPageController.php:19
 * @route '/cashier-shifts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CashierShiftPageController::index
 * @see app/Http/Controllers/CashierShiftPageController.php:19
 * @route '/cashier-shifts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CashierShiftPageController::index
 * @see app/Http/Controllers/CashierShiftPageController.php:19
 * @route '/cashier-shifts'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\CashierShiftPageController::open
 * @see app/Http/Controllers/CashierShiftPageController.php:124
 * @route '/cashier-shifts/open'
 */
export const open = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

open.definition = {
    methods: ["post"],
    url: '/cashier-shifts/open',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CashierShiftPageController::open
 * @see app/Http/Controllers/CashierShiftPageController.php:124
 * @route '/cashier-shifts/open'
 */
open.url = (options?: RouteQueryOptions) => {
    return open.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CashierShiftPageController::open
 * @see app/Http/Controllers/CashierShiftPageController.php:124
 * @route '/cashier-shifts/open'
 */
open.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CashierShiftPageController::open
 * @see app/Http/Controllers/CashierShiftPageController.php:124
 * @route '/cashier-shifts/open'
 */
    const openForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: open.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CashierShiftPageController::open
 * @see app/Http/Controllers/CashierShiftPageController.php:124
 * @route '/cashier-shifts/open'
 */
        openForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: open.url(options),
            method: 'post',
        })
    
    open.form = openForm
/**
* @see \App\Http\Controllers\CashierShiftPageController::close
 * @see app/Http/Controllers/CashierShiftPageController.php:133
 * @route '/cashier-shifts/{cashierShift}/close'
 */
export const close = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/cashier-shifts/{cashierShift}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CashierShiftPageController::close
 * @see app/Http/Controllers/CashierShiftPageController.php:133
 * @route '/cashier-shifts/{cashierShift}/close'
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
* @see \App\Http\Controllers\CashierShiftPageController::close
 * @see app/Http/Controllers/CashierShiftPageController.php:133
 * @route '/cashier-shifts/{cashierShift}/close'
 */
close.post = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CashierShiftPageController::close
 * @see app/Http/Controllers/CashierShiftPageController.php:133
 * @route '/cashier-shifts/{cashierShift}/close'
 */
    const closeForm = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CashierShiftPageController::close
 * @see app/Http/Controllers/CashierShiftPageController.php:133
 * @route '/cashier-shifts/{cashierShift}/close'
 */
        closeForm.post = (args: { cashierShift: number | { id: number } } | [cashierShift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
const cashierShifts = {
    index: Object.assign(index, index),
open: Object.assign(open, open),
close: Object.assign(close, close),
}

export default cashierShifts