const JobProposalSchema = require('../../models/job_proposal');
const JobSchema = require('../../models/job');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const { uploadFile } = require('../upload_file');
const { Types } = require('mongoose');

const createJobProposal = async (req, userDetails, res) => {
    return new Promise(async () => {
        const userId = userDetails._id;
        const { job_id } = req.body;

        const existingProposal = await JobProposalSchema.findOne({ user_id: userId, job_id });
        if (existingProposal) {
            logger.warn(messageConstants.JOB_PROPOSAL_ALREADY_EXISTS);
            return responseData.fail(res, messageConstants.JOB_PROPOSAL_ALREADY_EXISTS, 400);
        }

        let attechmentIds = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const uploadedFile = await uploadFile(file);
                attechmentIds.push(uploadedFile._id);
            }
        }

        const jobExists = await JobSchema.findById(job_id);
        if (!jobExists) {
            logger.error(messageConstants.JOB_NOT_FOUND);
            return responseData.fail(res, messageConstants.JOB_NOT_FOUND, 404);
        }

        const jobProposal = new JobProposalSchema({
            ...req.body,
            user_id: userId,
            attechment_id: attechmentIds,
            job_id,
        });

        await jobProposal.save().then(async (result) => {
            logger.info(messageConstants.JOB_PROPOSAL_CREATE_SUCCESS);
            return responseData.success(res, result, messageConstants.JOB_PROPOSAL_CREATE_SUCCESS);
        }).catch((err) => {
            logger.error(messageConstants.JOB_PROPOSAL_CREATE_FAILED, err);
            return responseData.fail(res, messageConstants.JOB_PROPOSAL_CREATE_FAILED, 400)
        })
    });
};

const getJobProposal = async (userDetails, res) => {
    return new Promise(async () => {
        try {
            const userId = userDetails._id;

            const jobproposal = await JobProposalSchema.aggregate([
                { $match: { user_id: userId } },
                {
                    $lookup: {
                        from: "upload_files",
                        let: { attechmentIds: "$attechment_id" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$attechmentIds"] } } }
                        ],
                        as: "attechmentDetails"
                    }
                },
                {
                    $project: {
                        attechment_id: 0 
                    }
                },
                { $sort: { created_at: -1 } }
            ]);

            if (!jobproposal.length) {
                logger.warn(messageConstants.NO_JOB_PROPOSAL_FOUND);
                return responseData.fail(res, messageConstants.NO_JOB_PROPOSAL_FOUND, 404);
            }
            logger.info(messageConstants.JOB_PROPOSAL_FETCH_SUCCESS);
            return responseData.success(res, jobproposal, messageConstants.JOB_PROPOSAL_FETCH_SUCCESS);
        } catch (error) {
            logger.error(`Error get jobs: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
};

const updateJobProposal = async (req, userDetails, res) => {
    return new Promise(async () => {
        try {
            const { _id: jobProposalId } = req.params;
            const updateData = req.body;
            const userId = userDetails?._id;

            if (!jobProposalId) {
                return responseData.fail(res, messageConstants.JOB_PROPOSAL_ID_REQUIRED, 400);
            }

            const existingJob = await JobProposalSchema.findOne({ _id: jobProposalId, user_id: userId });
            if (!existingJob) {
                logger.warn(messageConstants.NO_JOB_PROPOSAL_FOUND);
                return responseData.fail(res, messageConstants.NO_JOB_PROPOSAL_FOUND, 404);
            }

            let attechmentIds = existingJob.attechment_id ? [...existingJob.attechment_id] : [];
            if (req.files && req.files.length > 0) {
                for (let file of req.files) {
                    const uploadedFile = await uploadFile(file);
                    attechmentIds.push(uploadedFile._id);
                }
            }

            const updatedJob = await JobProposalSchema.findOneAndUpdate(
                { _id: jobProposalId, user_id: userId },
                {
                    $set: {
                        ...updateData,
                        attechment_id: attechmentIds,
                    }
                },
                { new: true, runValidators: true }
            );

            if (!updatedJob) {
                logger.warn(messageConstants.NO_JOB_PROPOSAL_FOUND);
                return responseData.fail(res, messageConstants.NO_JOB_PROPOSAL_FOUND, 404);
            }

            logger.info(messageConstants.JOB_PROPOSAL_UPDATE_SUCCESS);
            return responseData.success(res, updatedJob, messageConstants.JOB_PROPOSAL_UPDATE_SUCCESS);

        } catch (error) {
            logger.error(`Error updating job: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
};

const deleteJobProposal = async (req, userDetails, res) => {
    return new Promise(async () => {
        try {
            const { _id: jobProposalId } = req.params;
            const userId = userDetails?._id;
            const deletedJob = await JobProposalSchema.findOneAndDelete({ _id: jobProposalId, user_id: userId });

            if (!deletedJob) {
                logger.warn(messageConstants.NO_JOB_PROPOSAL_FOUND);
                return responseData.fail(res, messageConstants.NO_JOB_PROPOSAL_FOUND, 404);
            }

            logger.info(messageConstants.JOB_PROPOSAL_DELETE_SUCCESS);
            return responseData.success(res, {}, messageConstants.JOB_PROPOSAL_DELETE_SUCCESS);
        } catch (error) {
            logger.error(`Error delete job: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
};

const getJobProposalDetail = async (req, userDetails, res) => {
    return new Promise(async () => {
        try {
            const { _id: jobProposalId } = req.params;
            const userId = userDetails?._id;

            if (!jobProposalId) {
                return responseData.fail(res, messageConstants.JOB_PROPOSAL_ID_REQUIRED, 400);
            }

            console.log(userId, jobProposalId);

            const jobproposal = await JobProposalSchema.aggregate([
                { $match: { user_id: userId, _id: new Types.ObjectId(jobProposalId) } },
                {
                    $lookup: {
                        from: "upload_files",
                        let: { attechmentIds: "$attechment_id" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$attechmentIds"] } } }
                        ],
                        as: "attechmentDetails"
                    }
                },
                {
                    $project: {
                        attechment_id: 0 
                    }
                }
            ]);

            if (!jobproposal.length) {
                logger.warn(messageConstants.NO_JOB_PROPOSAL_FOUND);
                return responseData.fail(res, messageConstants.NO_JOB_PROPOSAL_FOUND, 404);
            }
            logger.info(messageConstants.JOB_PROPOSAL_FETCH_SUCCESS);
            return responseData.success(res, jobproposal, messageConstants.JOB_PROPOSAL_FETCH_SUCCESS);

        } catch (error) {
            logger.error(`Error fetching job: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
};

module.exports = {
    createJobProposal,
    getJobProposal,
    updateJobProposal,
    deleteJobProposal,
    getJobProposalDetail
}