import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Settings\UpdatePageController::backup
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
export const backup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backup.url(options),
    method: 'post',
})

backup.definition = {
    methods: ["post"],
    url: '/settings/updates/backups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::backup
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
backup.url = (options?: RouteQueryOptions) => {
    return backup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::backup
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
backup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backup.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\UpdatePageController::backup
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
    const backupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: backup.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::backup
 * @see app/Http/Controllers/Settings/UpdatePageController.php:149
 * @route '/settings/updates/backups'
 */
        backupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: backup.url(options),
            method: 'post',
        })
    
    backup.form = backupForm
/**
* @see \App\Http\Controllers\Settings\UpdatePageController::report
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
export const report = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(options),
    method: 'post',
})

report.definition = {
    methods: ["post"],
    url: '/settings/updates/reports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::report
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
report.url = (options?: RouteQueryOptions) => {
    return report.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\UpdatePageController::report
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
report.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\UpdatePageController::report
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
    const reportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: report.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\UpdatePageController::report
 * @see app/Http/Controllers/Settings/UpdatePageController.php:161
 * @route '/settings/updates/reports'
 */
        reportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: report.url(options),
            method: 'post',
        })
    
    report.form = reportForm
const UpdatePageController = { index, apply, rollback, backup, report }

export default UpdatePageController