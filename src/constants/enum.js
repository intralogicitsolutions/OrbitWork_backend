const UserRole = Object.freeze({
    FREELANCER: 1,
    CLIENT: 2,
    AGENCY: 3,
})

const Status = Object.freeze({
    ACTIVE: 1,
    INACTIVE: 0
});

const UserTypes = Object.freeze({
    FREELANCER: 1,
    CLIENT: 2,
    AGENCY: 3
});

const FilterTypes = Object.freeze({
    JOB: 1,
    TALENT: 2,
    PROJECT: 3
});

const Tags = Object.freeze({
    FREELANCER: 'FREELANCER',
    AGENCY: 'AGENCY'
})

module.exports = {
    UserRole,
    Status,
    UserTypes,
    FilterTypes,
    Tags
}