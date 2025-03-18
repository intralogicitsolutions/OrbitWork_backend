const urlConstants = {

    // AUTH ROUTES
    USER_SIGNUP: '/auth/signup',
    USER_SIGNIN: '/auth/signin',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // USER ROUTES
    GET_USERS_LIST: '/user/getall',
    DELETE_USER: '/user/delete',

    // PROFILE ROUTES
    CREATE_FREELANCER_PROFILE: '/profile/create-freelancer',
    CREATE_CLIENT_PROFILE: '/profile/create-client',
    CREATE_AGENCY_PROFILE: '/profile/create-agency',
    FILTER_PROFILES: '/profile/filter',

    // JOB ROUTES
    CREATE_JOB: '/job/create',
    GET_JOB: '/job/get',
    UPDATE_JOB: '/job/update/:_id',
    DELETE_JOB: '/job/delete/:_id',
    GET_JOB_DETAIL: '/job/get/:_id',

    // MESSAGE ROUTES
    SEND_MESSAGE: '/message/send',
    GET_MESSAGE: '/message/get/:senderId/:receiverId',
    MESSAGE_LIST: '/message/list',

    // UPLOAD_FILE ROUTES
    UPLOAD_FILE: '/file/upload',

    // CREATE_ROOM ROUTES
    CREATE_ROOM: '/room/create',
    UPDATE_ROOM: '/room/update/:id',


}

module.exports = urlConstants;