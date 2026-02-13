import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::index
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:19
 * @route '/settings/exchange-rates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/exchange-rates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::index
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:19
 * @route '/settings/exchange-rates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::index
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:19
 * @route '/settings/exchange-rates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::index
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:19
 * @route '/settings/exchange-rates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::index
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:19
 * @route '/settings/exchange-rates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::index
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:19
 * @route '/settings/exchange-rates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::index
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:19
 * @route '/settings/exchange-rates'
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
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::store
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:47
 * @route '/settings/exchange-rates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/exchange-rates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::store
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:47
 * @route '/settings/exchange-rates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::store
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:47
 * @route '/settings/exchange-rates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::store
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:47
 * @route '/settings/exchange-rates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::store
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:47
 * @route '/settings/exchange-rates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::update
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:85
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
export const update = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/exchange-rates/{exchangeRate}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::update
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:85
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
update.url = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exchangeRate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { exchangeRate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    exchangeRate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        exchangeRate: typeof args.exchangeRate === 'object'
                ? args.exchangeRate.id
                : args.exchangeRate,
                }

    return update.definition.url
            .replace('{exchangeRate}', parsedArgs.exchangeRate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::update
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:85
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
update.patch = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::update
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:85
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
    const updateForm = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::update
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:85
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
        updateForm.patch = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::destroy
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:122
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
export const destroy = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/exchange-rates/{exchangeRate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::destroy
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:122
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
destroy.url = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exchangeRate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { exchangeRate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    exchangeRate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        exchangeRate: typeof args.exchangeRate === 'object'
                ? args.exchangeRate.id
                : args.exchangeRate,
                }

    return destroy.definition.url
            .replace('{exchangeRate}', parsedArgs.exchangeRate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::destroy
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:122
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
destroy.delete = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::destroy
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:122
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
    const destroyForm = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ExchangeRatePageController::destroy
 * @see app/Http/Controllers/Settings/ExchangeRatePageController.php:122
 * @route '/settings/exchange-rates/{exchangeRate}'
 */
        destroyForm.delete = (args: { exchangeRate: string | number | { id: string | number } } | [exchangeRate: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ExchangeRatePageController = { index, store, update, destroy }

export default ExchangeRatePageController