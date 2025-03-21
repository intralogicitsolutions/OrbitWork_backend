const JobSchema = require('../../models/job');
const { responseData, messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const { uploadFile } = require('../upload_file');
const mongoose = require('mongoose');

const createJob = async (body, userDetails, file, res) => {

    return new Promise(async () => {
        const userId = userDetails._id;

        let documnetId = null;
        if (file) {
            const uploadedFile = await uploadFile(file);
            documnetId = uploadedFile._id;
            // documnetId = await uploadFile(file);
        }

        const job = new JobSchema({
            ...body,
            user_id: userId,
            document_id: documnetId,
        });

        await job.save().then(async (result) => {
            logger.info(messageConstants.JOB_CREATE_SUCCESS);
            return responseData.success(res, result, messageConstants.JOB_CREATE_SUCCESS);
        }).catch((err) => {
            logger.error(messageConstants.JOB_CREATE_FAILED, err);
            return responseData.fail(res, messageConstants.JOB_CREATE_FAILED, 400)
        })
    });
}

const getJob = async (userDetails, res) => {
    return new Promise(async () => {
        try {
            const userId = userDetails._id;

            const jobs = await JobSchema.aggregate([
                { $match: { user_id: userId } },
                {
                    $lookup: {
                        from: "upload_files",
                        localField: "document_id",
                        foreignField: "_id",
                        as: "documentDetails"
                    }
                },
                { $unwind: { path: "$documentDetails", preserveNullAndEmptyArrays: true } }
            ]);

            if (!jobs.length) {
                logger.warn(messageConstants.NO_JOBS_FOUND);
                return responseData.fail(res, messageConstants.NO_JOBS_FOUND, 404);
            }
            logger.info(messageConstants.JOB_FETCH_SUCCESS);
            return responseData.success(res, jobs, messageConstants.JOB_FETCH_SUCCESS);
        } catch (error) {
            logger.error(`Error get jobs: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }

    });
}

const updateJob = async (req, userDetails, file, res) => {
    return new Promise(async () => {
        try {
            const { _id: jobId } = req.params;
            const updateData = req.body;
            const userId = userDetails?._id;


            if (!jobId) {
                return responseData.fail(res, messageConstants.JOB_ID_REQUIRED, 400);
            }

            const existingJob = await JobSchema.findOne({ _id: jobId, user_id: userId });
            if (!existingJob) {
                logger.warn(messageConstants.JOB_NOT_FOUND);
                return responseData.fail(res, messageConstants.JOB_NOT_FOUND, 404);
            }
            let documentId = existingJob.document_id;
            if (file) {
                const uploadedFile = await uploadFile(file);
                documentId = uploadedFile._id;
                // documentId = await uploadFile(file);
            }

            const updatedJob = await JobSchema.findOneAndUpdate(
                { _id: jobId, user_id: userId },
                {
                    $set: {
                        ...updateData,
                        document_id: documentId,
                    }
                },
                { new: true, runValidators: true }
            );

            if (!updatedJob) {
                logger.warn(messageConstants.JOB_NOT_FOUND);
                return responseData.fail(res, messageConstants.JOB_NOT_FOUND, 404);
            }

            logger.info(messageConstants.JOB_UPDATE_SUCCESS);
            return responseData.success(res, updatedJob, messageConstants.JOB_UPDATE_SUCCESS);
        } catch (error) {
            logger.error(`Error updating job: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
};

const deleteJob = async (req, userDetails, res) => {
    return new Promise(async () => {
        try {
            const { _id: jobId } = req.params;
            const userId = userDetails?._id;
            const deletedJob = await JobSchema.findOneAndDelete({ _id: jobId, user_id: userId });

            if (!deletedJob) {
                logger.warn(messageConstants.JOB_NOT_FOUND);
                return responseData.fail(res, messageConstants.JOB_NOT_FOUND, 404);
            }

            logger.info(messageConstants.JOB_DELETE_SUCCESS);
            return responseData.success(res, {}, messageConstants.JOB_DELETE_SUCCESS);

        } catch (error) {
            logger.error(`Error delete job: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
}

const getJobDetail = async (req, userDetails, res) => {
    return new Promise(async () => {
        try {
            const { _id: jobId } = req.params;
            const userId = userDetails?._id;

            if (!jobId) {
                return responseData.fail(res, messageConstants.JOB_ID_REQUIRED, 400);
            }

            const job = await JobSchema.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(jobId), user_id: userId } },
                {
                    $lookup: {
                        from: "upload_files",
                        localField: "document_id",
                        foreignField: "_id",
                        as: "documentDetails"
                    }
                },
                { $unwind: { path: "$documentDetails", preserveNullAndEmptyArrays: true } }
            ]);


            if (!job.length) {
                logger.warn(messageConstants.JOB_NOT_FOUND);
                return responseData.fail(res, messageConstants.JOB_NOT_FOUND, 404);
            }

            logger.info(messageConstants.JOB_FETCH_SUCCESS);
            return responseData.success(res, job, messageConstants.JOB_FETCH_SUCCESS);
        } catch (error) {
            logger.error(`Error fetching job: ${error.message}`);
            return responseData.fail(res, messageConstants.INTERNAL_SERVER_ERROR, 500);
        }
    });
};


module.exports = {
    createJob,
    getJob,
    updateJob,
    deleteJob,
    getJobDetail
}