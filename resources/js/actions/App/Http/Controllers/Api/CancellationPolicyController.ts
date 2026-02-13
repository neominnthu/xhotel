import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::index
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:15
 * @route '/api/v1/cancellation-policies'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/cancellation-policies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::index
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:15
 * @route '/api/v1/cancellation-policies'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::index
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:15
 * @route '/api/v1/cancellation-policies'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::index
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:15
 * @route '/api/v1/cancellation-policies'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::index
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:15
 * @route '/api/v1/cancellation-policies'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::index
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:15
 * @route '/api/v1/cancellation-policies'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::index
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:15
 * @route '/api/v1/cancellation-policies'
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
* @see \App\Http\Controllers\Api\CancellationPolicyController::store
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:33
 * @route '/api/v1/cancellation-policies'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/cancellation-policies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::store
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:33
 * @route '/api/v1/cancellation-policies'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::store
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:33
 * @route '/api/v1/cancellation-policies'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::store
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:33
 * @route '/api/v1/cancellation-policies'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::store
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:33
 * @route '/api/v1/cancellation-policies'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::update
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:61
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
export const update = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/cancellation-policies/{cancellation_policy}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::update
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:61
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
update.url = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cancellation_policy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    cancellation_policy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cancellation_policy: args.cancellation_policy,
                }

    return update.definition.url
            .replace('{cancellation_policy}', parsedArgs.cancellation_policy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::update
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:61
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
update.put = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::update
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:61
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
update.patch = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::update
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:61
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
    const updateForm = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::update
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:61
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
        updateForm.put = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::update
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:61
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
        updateForm.patch = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\CancellationPolicyController::destroy
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:91
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
export const destroy = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/cancellation-policies/{cancellation_policy}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::destroy
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:91
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
destroy.url = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cancellation_policy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    cancellation_policy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cancellation_policy: args.cancellation_policy,
                }

    return destroy.definition.url
            .replace('{cancellation_policy}', parsedArgs.cancellation_policy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\CancellationPolicyController::destroy
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:91
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
destroy.delete = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::destroy
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:91
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
    const destroyForm = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\CancellationPolicyController::destroy
 * @see app/Http/Controllers/Api/CancellationPolicyController.php:91
 * @route '/api/v1/cancellation-policies/{cancellation_policy}'
 */
        destroyForm.delete = (args: { cancellation_policy: string | number } | [cancellation_policy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CancellationPolicyController = { index, store, update, destroy }

export default CancellationPolicyController