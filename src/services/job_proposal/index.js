const JobProposalSchema = require('../../models/job_proposal');
const JobSchema = require('../../models/job');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const { uploadFile } = require('../upload_file');

const createJobProposal = async (req, userDetails, res) => {
    return new Promise(async () => {
        const userId = userDetails._id;
        const { job_id } = body;

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
            ...body,
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

const getJobProposal = async ( userDetails, res) => {
    return new Promise(async () => {
try {
            const userId = userDetails._id;

            const jobproposal = await JobProposalSchema.aggregate([
                { $match: { user_id: userId } },
                {
                    $lookup: {
                        from: "upload_files",
                        localField: "attechment_id",
                        foreignField: "_id",
                        as: "attechmentDetails"
                    }
                },
                { $unwind: { path: "$attechmentDetails", preserveNullAndEmptyArrays: true } }
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

module.exports = {
    createJobProposal,
    getJobProposal,
}