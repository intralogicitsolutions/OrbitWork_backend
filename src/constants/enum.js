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
});

const ProjectType = Object.freeze({
     ONGOING_PROJECT: 'Ongoing Project',
     COMPLEX_PROJECT: 'Complex project',
     ONE_TIME_PROJECT: 'One-time project',
});

const EstimatedTime = Object.freeze({
    LESS_THEN_ONE_MONTH: 'Less than 1 month',
    ONE_TO_THREE_MONTH: '1 to 3 months',
    THREE_TO_SIX_MONTHS: '3 to 6 months',
    MORE_THAN_SIX_MONTHS: 'More than 6 months',
})

module.exports = {
    UserRole,
    Status,
    UserTypes,
    FilterTypes,
    Tags,
    ProjectType,
    EstimatedTime
}