const CONTRACT_STATUS = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    TERMINATED: 'terminated',
}
const MAX_DEPOSIT_AMOUNT_COEFFICIENT = 0.25
const DEFAULT_LIMIT = 1000
const BEST_CLIENT_DEFAULT_LIMIT = 2

const PROFILE_TYPE = {
    CLIENT: 'client',
    CONTRACTOR: 'contractor',
}

const HTTP_CODE_ERRORS = {
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SCHEMA_VALIDATION: 422,
}
const VALIDATOR_TYPE = {
    BODY: 'body',
    QUERY: 'query',
    HEADER: 'header',
}

module.exports = {
    MAX_DEPOSIT_AMOUNT_COEFFICIENT,
    DEFAULT_LIMIT,
    BEST_CLIENT_DEFAULT_LIMIT,
    CONTRACT_STATUS,
    PROFILE_TYPE,
    HTTP_CODE_ERRORS,
    VALIDATOR_TYPE,
}