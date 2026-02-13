import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::index
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:19
 * @route '/api/v1/availability/holds'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/availability/holds',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::index
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:19
 * @route '/api/v1/availability/holds'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::index
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:19
 * @route '/api/v1/availability/holds'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::index
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:19
 * @route '/api/v1/availability/holds'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::index
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:19
 * @route '/api/v1/availability/holds'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::index
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:19
 * @route '/api/v1/availability/holds'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::index
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:19
 * @route '/api/v1/availability/holds'
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
* @see \App\Http\Controllers\Api\AvailabilityHoldController::store
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:45
 * @route '/api/v1/availability/holds'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/availability/holds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::store
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:45
 * @route '/api/v1/availability/holds'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::store
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:45
 * @route '/api/v1/availability/holds'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::store
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:45
 * @route '/api/v1/availability/holds'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::store
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:45
 * @route '/api/v1/availability/holds'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::destroy
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:80
 * @route '/api/v1/availability/holds/{hold}'
 */
export const destroy = (args: { hold: number | { id: number } } | [hold: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/availability/holds/{hold}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::destroy
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:80
 * @route '/api/v1/availability/holds/{hold}'
 */
destroy.url = (args: { hold: number | { id: number } } | [hold: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hold: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hold: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hold: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hold: typeof args.hold === 'object'
                ? args.hold.id
                : args.hold,
                }

    return destroy.definition.url
            .replace('{hold}', parsedArgs.hold.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::destroy
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:80
 * @route '/api/v1/availability/holds/{hold}'
 */
destroy.delete = (args: { hold: number | { id: number } } | [hold: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::destroy
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:80
 * @route '/api/v1/availability/holds/{hold}'
 */
    const destroyForm = (args: { hold: number | { id: number } } | [hold: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AvailabilityHoldController::destroy
 * @see app/Http/Controllers/Api/AvailabilityHoldController.php:80
 * @route '/api/v1/availability/holds/{hold}'
 */
        destroyForm.delete = (args: { hold: number | { id: number } } | [hold: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AvailabilityHoldController = { index, store, destroy }

export default AvailabilityHoldController