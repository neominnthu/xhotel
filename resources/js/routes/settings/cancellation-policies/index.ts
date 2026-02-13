import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::index
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:19
 * @route '/settings/cancellation-policies'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/cancellation-policies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::index
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:19
 * @route '/settings/cancellation-policies'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::index
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:19
 * @route '/settings/cancellation-policies'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::index
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:19
 * @route '/settings/cancellation-policies'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::index
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:19
 * @route '/settings/cancellation-policies'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::index
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:19
 * @route '/settings/cancellation-policies'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::index
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:19
 * @route '/settings/cancellation-policies'
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
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::store
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:56
 * @route '/settings/cancellation-policies'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/cancellation-policies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::store
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:56
 * @route '/settings/cancellation-policies'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::store
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:56
 * @route '/settings/cancellation-policies'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::store
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:56
 * @route '/settings/cancellation-policies'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::store
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:56
 * @route '/settings/cancellation-policies'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::update
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:90
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
export const update = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/cancellation-policies/{cancellationPolicy}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::update
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:90
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
update.url = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cancellationPolicy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cancellationPolicy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cancellationPolicy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cancellationPolicy: typeof args.cancellationPolicy === 'object'
                ? args.cancellationPolicy.id
                : args.cancellationPolicy,
                }

    return update.definition.url
            .replace('{cancellationPolicy}', parsedArgs.cancellationPolicy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::update
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:90
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
update.patch = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::update
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:90
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
    const updateForm = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::update
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:90
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
        updateForm.patch = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::destroy
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:125
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
export const destroy = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/cancellation-policies/{cancellationPolicy}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::destroy
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:125
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
destroy.url = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cancellationPolicy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cancellationPolicy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cancellationPolicy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cancellationPolicy: typeof args.cancellationPolicy === 'object'
                ? args.cancellationPolicy.id
                : args.cancellationPolicy,
                }

    return destroy.definition.url
            .replace('{cancellationPolicy}', parsedArgs.cancellationPolicy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::destroy
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:125
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
destroy.delete = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::destroy
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:125
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
    const destroyForm = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\CancellationPolicyPageController::destroy
 * @see app/Http/Controllers/Settings/CancellationPolicyPageController.php:125
 * @route '/settings/cancellation-policies/{cancellationPolicy}'
 */
        destroyForm.delete = (args: { cancellationPolicy: number | { id: number } } | [cancellationPolicy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const cancellationPolicies = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default cancellationPolicies