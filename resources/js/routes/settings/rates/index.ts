import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\RatePageController::index
 * @see app/Http/Controllers/Settings/RatePageController.php:19
 * @route '/settings/rates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/rates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\RatePageController::index
 * @see app/Http/Controllers/Settings/RatePageController.php:19
 * @route '/settings/rates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RatePageController::index
 * @see app/Http/Controllers/Settings/RatePageController.php:19
 * @route '/settings/rates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\RatePageController::index
 * @see app/Http/Controllers/Settings/RatePageController.php:19
 * @route '/settings/rates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\RatePageController::index
 * @see app/Http/Controllers/Settings/RatePageController.php:19
 * @route '/settings/rates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\RatePageController::index
 * @see app/Http/Controllers/Settings/RatePageController.php:19
 * @route '/settings/rates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\RatePageController::index
 * @see app/Http/Controllers/Settings/RatePageController.php:19
 * @route '/settings/rates'
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
* @see \App\Http\Controllers\Settings\RatePageController::store
 * @see app/Http/Controllers/Settings/RatePageController.php:59
 * @route '/settings/rates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/rates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\RatePageController::store
 * @see app/Http/Controllers/Settings/RatePageController.php:59
 * @route '/settings/rates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RatePageController::store
 * @see app/Http/Controllers/Settings/RatePageController.php:59
 * @route '/settings/rates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\RatePageController::store
 * @see app/Http/Controllers/Settings/RatePageController.php:59
 * @route '/settings/rates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\RatePageController::store
 * @see app/Http/Controllers/Settings/RatePageController.php:59
 * @route '/settings/rates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\RatePageController::update
 * @see app/Http/Controllers/Settings/RatePageController.php:99
 * @route '/settings/rates/{rate}'
 */
export const update = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/rates/{rate}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\RatePageController::update
 * @see app/Http/Controllers/Settings/RatePageController.php:99
 * @route '/settings/rates/{rate}'
 */
update.url = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { rate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { rate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    rate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        rate: typeof args.rate === 'object'
                ? args.rate.id
                : args.rate,
                }

    return update.definition.url
            .replace('{rate}', parsedArgs.rate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RatePageController::update
 * @see app/Http/Controllers/Settings/RatePageController.php:99
 * @route '/settings/rates/{rate}'
 */
update.patch = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\RatePageController::update
 * @see app/Http/Controllers/Settings/RatePageController.php:99
 * @route '/settings/rates/{rate}'
 */
    const updateForm = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\RatePageController::update
 * @see app/Http/Controllers/Settings/RatePageController.php:99
 * @route '/settings/rates/{rate}'
 */
        updateForm.patch = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Settings\RatePageController::destroy
 * @see app/Http/Controllers/Settings/RatePageController.php:137
 * @route '/settings/rates/{rate}'
 */
export const destroy = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/rates/{rate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\RatePageController::destroy
 * @see app/Http/Controllers/Settings/RatePageController.php:137
 * @route '/settings/rates/{rate}'
 */
destroy.url = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { rate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { rate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    rate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        rate: typeof args.rate === 'object'
                ? args.rate.id
                : args.rate,
                }

    return destroy.definition.url
            .replace('{rate}', parsedArgs.rate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RatePageController::destroy
 * @see app/Http/Controllers/Settings/RatePageController.php:137
 * @route '/settings/rates/{rate}'
 */
destroy.delete = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\RatePageController::destroy
 * @see app/Http/Controllers/Settings/RatePageController.php:137
 * @route '/settings/rates/{rate}'
 */
    const destroyForm = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\RatePageController::destroy
 * @see app/Http/Controllers/Settings/RatePageController.php:137
 * @route '/settings/rates/{rate}'
 */
        destroyForm.delete = (args: { rate: number | { id: number } } | [rate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const rates = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default rates