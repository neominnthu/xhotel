import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\GuestController::index
 * @see app/Http/Controllers/Api/GuestController.php:16
 * @route '/api/v1/guests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/guests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\GuestController::index
 * @see app/Http/Controllers/Api/GuestController.php:16
 * @route '/api/v1/guests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GuestController::index
 * @see app/Http/Controllers/Api/GuestController.php:16
 * @route '/api/v1/guests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\GuestController::index
 * @see app/Http/Controllers/Api/GuestController.php:16
 * @route '/api/v1/guests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\GuestController::index
 * @see app/Http/Controllers/Api/GuestController.php:16
 * @route '/api/v1/guests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\GuestController::index
 * @see app/Http/Controllers/Api/GuestController.php:16
 * @route '/api/v1/guests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\GuestController::index
 * @see app/Http/Controllers/Api/GuestController.php:16
 * @route '/api/v1/guests'
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
* @see \App\Http\Controllers\Guests\GuestPageController::index
 * @see app/Http/Controllers/Guests/GuestPageController.php:18
 * @route '/guests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/guests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guests\GuestPageController::index
 * @see app/Http/Controllers/Guests/GuestPageController.php:18
 * @route '/guests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guests\GuestPageController::index
 * @see app/Http/Controllers/Guests/GuestPageController.php:18
 * @route '/guests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Guests\GuestPageController::index
 * @see app/Http/Controllers/Guests/GuestPageController.php:18
 * @route '/guests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Guests\GuestPageController::index
 * @see app/Http/Controllers/Guests/GuestPageController.php:18
 * @route '/guests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Guests\GuestPageController::index
 * @see app/Http/Controllers/Guests/GuestPageController.php:18
 * @route '/guests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Guests\GuestPageController::index
 * @see app/Http/Controllers/Guests/GuestPageController.php:18
 * @route '/guests'
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
* @see \App\Http\Controllers\Api\GuestController::store
 * @see app/Http/Controllers/Api/GuestController.php:52
 * @route '/api/v1/guests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/guests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\GuestController::store
 * @see app/Http/Controllers/Api/GuestController.php:52
 * @route '/api/v1/guests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GuestController::store
 * @see app/Http/Controllers/Api/GuestController.php:52
 * @route '/api/v1/guests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\GuestController::store
 * @see app/Http/Controllers/Api/GuestController.php:52
 * @route '/api/v1/guests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\GuestController::store
 * @see app/Http/Controllers/Api/GuestController.php:52
 * @route '/api/v1/guests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Guests\GuestPageController::store
 * @see app/Http/Controllers/Guests/GuestPageController.php:164
 * @route '/guests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/guests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guests\GuestPageController::store
 * @see app/Http/Controllers/Guests/GuestPageController.php:164
 * @route '/guests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guests\GuestPageController::store
 * @see app/Http/Controllers/Guests/GuestPageController.php:164
 * @route '/guests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Guests\GuestPageController::store
 * @see app/Http/Controllers/Guests/GuestPageController.php:164
 * @route '/guests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Guests\GuestPageController::store
 * @see app/Http/Controllers/Guests/GuestPageController.php:164
 * @route '/guests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\GuestController::show
 * @see app/Http/Controllers/Api/GuestController.php:45
 * @route '/api/v1/guests/{guest}'
 */
export const show = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/guests/{guest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\GuestController::show
 * @see app/Http/Controllers/Api/GuestController.php:45
 * @route '/api/v1/guests/{guest}'
 */
show.url = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { guest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: typeof args.guest === 'object'
                ? args.guest.id
                : args.guest,
                }

    return show.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GuestController::show
 * @see app/Http/Controllers/Api/GuestController.php:45
 * @route '/api/v1/guests/{guest}'
 */
show.get = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\GuestController::show
 * @see app/Http/Controllers/Api/GuestController.php:45
 * @route '/api/v1/guests/{guest}'
 */
show.head = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\GuestController::show
 * @see app/Http/Controllers/Api/GuestController.php:45
 * @route '/api/v1/guests/{guest}'
 */
    const showForm = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\GuestController::show
 * @see app/Http/Controllers/Api/GuestController.php:45
 * @route '/api/v1/guests/{guest}'
 */
        showForm.get = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\GuestController::show
 * @see app/Http/Controllers/Api/GuestController.php:45
 * @route '/api/v1/guests/{guest}'
 */
        showForm.head = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Guests\GuestPageController::show
 * @see app/Http/Controllers/Guests/GuestPageController.php:83
 * @route '/guests/{guest}'
 */
export const show = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/guests/{guest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guests\GuestPageController::show
 * @see app/Http/Controllers/Guests/GuestPageController.php:83
 * @route '/guests/{guest}'
 */
show.url = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { guest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: typeof args.guest === 'object'
                ? args.guest.id
                : args.guest,
                }

    return show.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guests\GuestPageController::show
 * @see app/Http/Controllers/Guests/GuestPageController.php:83
 * @route '/guests/{guest}'
 */
show.get = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Guests\GuestPageController::show
 * @see app/Http/Controllers/Guests/GuestPageController.php:83
 * @route '/guests/{guest}'
 */
show.head = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Guests\GuestPageController::show
 * @see app/Http/Controllers/Guests/GuestPageController.php:83
 * @route '/guests/{guest}'
 */
    const showForm = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Guests\GuestPageController::show
 * @see app/Http/Controllers/Guests/GuestPageController.php:83
 * @route '/guests/{guest}'
 */
        showForm.get = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Guests\GuestPageController::show
 * @see app/Http/Controllers/Guests/GuestPageController.php:83
 * @route '/guests/{guest}'
 */
        showForm.head = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\GuestController::update
 * @see app/Http/Controllers/Api/GuestController.php:61
 * @route '/api/v1/guests/{guest}'
 */
export const update = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/guests/{guest}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\GuestController::update
 * @see app/Http/Controllers/Api/GuestController.php:61
 * @route '/api/v1/guests/{guest}'
 */
update.url = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { guest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: typeof args.guest === 'object'
                ? args.guest.id
                : args.guest,
                }

    return update.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GuestController::update
 * @see app/Http/Controllers/Api/GuestController.php:61
 * @route '/api/v1/guests/{guest}'
 */
update.put = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\GuestController::update
 * @see app/Http/Controllers/Api/GuestController.php:61
 * @route '/api/v1/guests/{guest}'
 */
update.patch = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\GuestController::update
 * @see app/Http/Controllers/Api/GuestController.php:61
 * @route '/api/v1/guests/{guest}'
 */
    const updateForm = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\GuestController::update
 * @see app/Http/Controllers/Api/GuestController.php:61
 * @route '/api/v1/guests/{guest}'
 */
        updateForm.put = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\GuestController::update
 * @see app/Http/Controllers/Api/GuestController.php:61
 * @route '/api/v1/guests/{guest}'
 */
        updateForm.patch = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Guests\GuestPageController::update
 * @see app/Http/Controllers/Guests/GuestPageController.php:174
 * @route '/guests/{guest}'
 */
export const update = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/guests/{guest}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Guests\GuestPageController::update
 * @see app/Http/Controllers/Guests/GuestPageController.php:174
 * @route '/guests/{guest}'
 */
update.url = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { guest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: typeof args.guest === 'object'
                ? args.guest.id
                : args.guest,
                }

    return update.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guests\GuestPageController::update
 * @see app/Http/Controllers/Guests/GuestPageController.php:174
 * @route '/guests/{guest}'
 */
update.patch = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Guests\GuestPageController::update
 * @see app/Http/Controllers/Guests/GuestPageController.php:174
 * @route '/guests/{guest}'
 */
    const updateForm = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Guests\GuestPageController::update
 * @see app/Http/Controllers/Guests/GuestPageController.php:174
 * @route '/guests/{guest}'
 */
        updateForm.patch = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Guests\GuestPageController::merge
 * @see app/Http/Controllers/Guests/GuestPageController.php:186
 * @route '/guests/{guest}/merge'
 */
export const merge = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: merge.url(args, options),
    method: 'post',
})

merge.definition = {
    methods: ["post"],
    url: '/guests/{guest}/merge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guests\GuestPageController::merge
 * @see app/Http/Controllers/Guests/GuestPageController.php:186
 * @route '/guests/{guest}/merge'
 */
merge.url = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { guest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: typeof args.guest === 'object'
                ? args.guest.id
                : args.guest,
                }

    return merge.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guests\GuestPageController::merge
 * @see app/Http/Controllers/Guests/GuestPageController.php:186
 * @route '/guests/{guest}/merge'
 */
merge.post = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: merge.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Guests\GuestPageController::merge
 * @see app/Http/Controllers/Guests/GuestPageController.php:186
 * @route '/guests/{guest}/merge'
 */
    const mergeForm = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: merge.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Guests\GuestPageController::merge
 * @see app/Http/Controllers/Guests/GuestPageController.php:186
 * @route '/guests/{guest}/merge'
 */
        mergeForm.post = (args: { guest: number | { id: number } } | [guest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: merge.url(args, options),
            method: 'post',
        })
    
    merge.form = mergeForm
const guests = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
merge: Object.assign(merge, merge),
}

export default guests