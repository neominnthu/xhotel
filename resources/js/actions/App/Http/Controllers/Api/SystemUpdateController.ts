import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SystemUpdateController::check
 * @see app/Http/Controllers/Api/SystemUpdateController.php:17
 * @route '/api/v1/system/updates/check'
 */
export const check = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
})

check.definition = {
    methods: ["post"],
    url: '/api/v1/system/updates/check',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SystemUpdateController::check
 * @see app/Http/Controllers/Api/SystemUpdateController.php:17
 * @route '/api/v1/system/updates/check'
 */
check.url = (options?: RouteQueryOptions) => {
    return check.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SystemUpdateController::check
 * @see app/Http/Controllers/Api/SystemUpdateController.php:17
 * @route '/api/v1/system/updates/check'
 */
check.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: check.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\SystemUpdateController::check
 * @see app/Http/Controllers/Api/SystemUpdateController.php:17
 * @route '/api/v1/system/updates/check'
 */
    const checkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: check.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\SystemUpdateController::check
 * @see app/Http/Controllers/Api/SystemUpdateController.php:17
 * @route '/api/v1/system/updates/check'
 */
        checkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: check.url(options),
            method: 'post',
        })
    
    check.form = checkForm
/**
* @see \App\Http\Controllers\Api\SystemUpdateController::apply
 * @see app/Http/Controllers/Api/SystemUpdateController.php:24
 * @route '/api/v1/system/updates/apply'
 */
export const apply = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/api/v1/system/updates/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SystemUpdateController::apply
 * @see app/Http/Controllers/Api/SystemUpdateController.php:24
 * @route '/api/v1/system/updates/apply'
 */
apply.url = (options?: RouteQueryOptions) => {
    return apply.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SystemUpdateController::apply
 * @see app/Http/Controllers/Api/SystemUpdateController.php:24
 * @route '/api/v1/system/updates/apply'
 */
apply.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\SystemUpdateController::apply
 * @see app/Http/Controllers/Api/SystemUpdateController.php:24
 * @route '/api/v1/system/updates/apply'
 */
    const applyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: apply.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\SystemUpdateController::apply
 * @see app/Http/Controllers/Api/SystemUpdateController.php:24
 * @route '/api/v1/system/updates/apply'
 */
        applyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: apply.url(options),
            method: 'post',
        })
    
    apply.form = applyForm
/**
* @see \App\Http\Controllers\Api\SystemUpdateController::rollback
 * @see app/Http/Controllers/Api/SystemUpdateController.php:56
 * @route '/api/v1/system/updates/rollback'
 */
export const rollback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(options),
    method: 'post',
})

rollback.definition = {
    methods: ["post"],
    url: '/api/v1/system/updates/rollback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SystemUpdateController::rollback
 * @see app/Http/Controllers/Api/SystemUpdateController.php:56
 * @route '/api/v1/system/updates/rollback'
 */
rollback.url = (options?: RouteQueryOptions) => {
    return rollback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SystemUpdateController::rollback
 * @see app/Http/Controllers/Api/SystemUpdateController.php:56
 * @route '/api/v1/system/updates/rollback'
 */
rollback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\SystemUpdateController::rollback
 * @see app/Http/Controllers/Api/SystemUpdateController.php:56
 * @route '/api/v1/system/updates/rollback'
 */
    const rollbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rollback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\SystemUpdateController::rollback
 * @see app/Http/Controllers/Api/SystemUpdateController.php:56
 * @route '/api/v1/system/updates/rollback'
 */
        rollbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rollback.url(options),
            method: 'post',
        })
    
    rollback.form = rollbackForm
const SystemUpdateController = { check, apply, rollback }

export default SystemUpdateController