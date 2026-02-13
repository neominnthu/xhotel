import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\UpdatePageController::index
 * @see app/Http/Controllers/Settings/UpdatePageController.php:26
 * @route '/settings/updates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/updates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::index
 * @see app/Http/Controllers/Settings/UpdatePageController.php:26
 * @route '/settings/updates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::index
 * @see app/Http/Controllers/Settings/UpdatePageController.php:26
 * @route '/settings/updates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\UpdatePageController::index
 * @see app/Http/Controllers/Settings/UpdatePageController.php:26
 * @route '/settings/updates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\UpdatePageController::index
 * @see app/Http/Controllers/Settings/UpdatePageController.php:26
 * @route '/settings/updates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::index
 * @see app/Http/Controllers/Settings/UpdatePageController.php:26
 * @route '/settings/updates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::index
 * @see app/Http/Controllers/Settings/UpdatePageController.php:26
 * @route '/settings/updates'
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
* @see \App\Http\Controllers\Settings\UpdatePageController::apply
 * @see app/Http/Controllers/Settings/UpdatePageController.php:102
 * @route '/settings/updates'
 */
export const apply = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/settings/updates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::apply
 * @see app/Http/Controllers/Settings/UpdatePageController.php:102
 * @route '/settings/updates'
 */
apply.url = (options?: RouteQueryOptions) => {
    return apply.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::apply
 * @see app/Http/Controllers/Settings/UpdatePageController.php:102
 * @route '/settings/updates'
 */
apply.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\UpdatePageController::apply
 * @see app/Http/Controllers/Settings/UpdatePageController.php:102
 * @route '/settings/updates'
 */
    const applyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: apply.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::apply
 * @see app/Http/Controllers/Settings/UpdatePageController.php:102
 * @route '/settings/updates'
 */
        applyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: apply.url(options),
            method: 'post',
        })
    
    apply.form = applyForm
/**
* @see \App\Http\Controllers\Settings\UpdatePageController::rollback
 * @see app/Http/Controllers/Settings/UpdatePageController.php:127
 * @route '/settings/updates/rollback'
 */
export const rollback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(options),
    method: 'post',
})

rollback.definition = {
    methods: ["post"],
    url: '/settings/updates/rollback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::rollback
 * @see app/Http/Controllers/Settings/UpdatePageController.php:127
 * @route '/settings/updates/rollback'
 */
rollback.url = (options?: RouteQueryOptions) => {
    return rollback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::rollback
 * @see app/Http/Controllers/Settings/UpdatePageController.php:127
 * @route '/settings/updates/rollback'
 */
rollback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\UpdatePageController::rollback
 * @see app/Http/Controllers/Settings/UpdatePageController.php:127
 * @route '/settings/updates/rollback'
 */
    const rollbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rollback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::rollback
 * @see app/Http/Controllers/Settings/UpdatePageController.php:127
 * @route '/settings/updates/rollback'
 */
        rollbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rollback.url(options),
            method: 'post',
        })
    
    rollback.form = rollbackForm
/**
* @see \App\Http\Controllers\Settings\UpdatePageController::backups
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
export const backups = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backups.url(options),
    method: 'post',
})

backups.definition = {
    methods: ["post"],
    url: '/settings/updates/backups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::backups
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
backups.url = (options?: RouteQueryOptions) => {
    return backups.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::backups
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
backups.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backups.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\UpdatePageController::backups
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
    const backupsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: backups.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::backups
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
        backupsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: backups.url(options),
            method: 'post',
        })
    
    backups.form = backupsForm
/**
* @see \App\Http\Controllers\Settings\UpdatePageController::reports
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reports.url(options),
    method: 'post',
})

reports.definition = {
    methods: ["post"],
    url: '/settings/updates/reports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::reports
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::reports
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
reports.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reports.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\UpdatePageController::reports
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reports.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::reports
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
        reportsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reports.url(options),
            method: 'post',
        })
    
    reports.form = reportsForm
const updates = {
    index: Object.assign(index, index),
apply: Object.assign(apply, apply),
rollback: Object.assign(rollback, rollback),
backups: Object.assign(backups, backups),
reports: Object.assign(reports, reports),
}

export default updates