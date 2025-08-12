const { Program } = require("../models/index.model");
const { SUC, ERR } = require("../utils/response");
const cloudinary = require('../config/cloudinary');

const extractPublicIdFromUrl = (url, resourceType = 'image') => {
    if (!url) return null;

    const parts = url.split('/upload/')[1];
    const withoutVersion = parts.replace(/^v\d+\//, '');
    const decoded = decodeURIComponent(withoutVersion);

    if (resourceType === 'image' || resourceType === 'video') {
        return decoded.replace(/\.[^/.]+$/, ''); // hapus .jpg/.webp/.png dll
    }

    return decoded;
}

const AddProgram = async (req, res) => {
    const data = req.body;

    const programImgFile = req.files?.programImage?.[0];
    const programDocFile = req.files?.programDocument?.[0];

    const programImage = programImgFile ? programImgFile.path : null;
    const programDocument = programDocFile ? programDocFile.path : null;

    try {
        if (!data) return ERR(res, 404, "Data not found");

        let summary, timeline, budgetBreakdown, supportExpected;
        
        try {
            summary = typeof data.summary === 'string' ? JSON.parse(data.summary) : data.summary;
            timeline = typeof data.timeline === 'string' ? JSON.parse(data.timeline) : data.timeline;
            budgetBreakdown = typeof data.budgetBreakdown === 'string' ? JSON.parse(data.budgetBreakdown) : data.budgetBreakdown;
            supportExpected = typeof data.supportExpected === 'string' ? JSON.parse(data.supportExpected) : data.supportExpected;
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return ERR(res, 400, "Invalid JSON format in request data");
        }

        const newProgram = new Program({
            title: data.title,
            desc: data.desc,
            createdBy: data.createdBy,
            proposer: data.proposer,
            location: data.location,
            category: data.category,
            status: data.status,
            targetAmount: data.targetAmount,
            duration: data.duration,
            image: programImage,
            document: programDocument,
            summary: summary,
            timeline: timeline,
            budgetBreakdown: budgetBreakdown,
            supportExpected: supportExpected,
        });

        await newProgram.save();

        return SUC(res, 201, newProgram, "Data created successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Program created failed");
    }
};

const GetPrograms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;
        
        const totalPrograms = await Program.countDocuments();

        const programs = await Program.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        if (!programs) return ERR(res, 404, "Programs not found");

        return SUC(res, 200, {
            data: programs,
            pagination: {
                total: totalPrograms,
                page,
                limit,
                totalPages: Math.ceil(totalPrograms / limit)
            }
        }, "Success getting programs");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting programs");
    }
};

const GetProgramById = async (req, res) => {
    const { programId } = req.params;

    try {
        if (!programId) return ERR(res, 400, "Program id is not found");

        const program = await Program.findById(programId);
        if (!program) return ERR(res, 404, "Program not found");

        return SUC(res, 200, program, "Success getting data");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Error getting data");
    }
};

const UpdateProgram = async (req, res) => {
    const data = req.body;
    const program = req.program;

    const programImgFile = req.files?.programImage?.[0];
    const programDocFile = req.files?.programDocument?.[0];

    const programImage = programImgFile ? programImgFile.path : null;
    const programDocument = programDocFile ? programDocFile.path : null;

    try {
        if (!program || !data) return ERR(res, 404, "Missing fields required");

        if (programImgFile) {
            if (program.image) {
                const oldImgPublicId = extractPublicIdFromUrl(program.image, "image");
                try {
                    if (oldImgPublicId) {
                        await cloudinary.uploader.destroy(oldImgPublicId);
                    }
                } catch (error) {
                    console.error("Error deleting old image from Cloudinary:", error.message);
                }
            }
            program.image = programImage;
        }

        if (programDocFile) {
            if (program.document) {
                const oldDocPublicId = extractPublicIdFromUrl(program.document, "raw");
                try {
                    if (oldDocPublicId) {
                        await cloudinary.uploader.destroy(oldDocPublicId, {
                        resource_type: 'raw',
                        });
                    }
                } catch (error) {
                    console.error("Error deleting old document from Cloudinary:", error.message);
                }
            }
            program.document = programDocument;
        }

        program.title = data.title || program.title;
        program.desc = data.desc || program.desc;
        program.proposer = data.proposer || program.proposer;
        program.location = data.location || program.location;
        program.category = data.category || program.category;
        program.status = data.status || program.status;
        program.budget = data.budget || program.budget;
        program.duration = data.duration || program.duration;

        if (data.summary) program.summary = JSON.parse(data.summary);

        if (data.timeline) {
            const parsedTimeline = JSON.parse(data.timeline);
            program.timeline = parsedTimeline.map(item => ({
                date: new Date(item.date),
                title: item.title,
                activities: item.activities || []
            }));
        }

        if (data.budgetBreakdown) {
            const parsedBudget = JSON.parse(data.budgetBreakdown);
            program.budgetBreakdown = parsedBudget.map(item => ({
                item: item.item,
                amount: Number(item.amount)
            }));
        }

        if (data.supportExpected) program.supportExpected = JSON.parse(data.supportExpected);

        const updatedProgram = await program.save();

        return SUC(res, 200, updatedProgram, "Success updating data");
    } catch (error) {
        console.error("Error updating program:", error);
        return ERR(res, 500, "Internal server error");
    }
};

const UpdateStatus = async (req, res) => {
    const { status } = req.body;
    const program = req.program;

    try {
        if (!program || !status) return ERR(res, 400, "Program id and status are required");

        program.status = status;
        await program.save();

        return SUC(res, 200, program, "Program status updated successfully");
    } catch (error) {
        console.error(error);
        return ERR(res, 500, "Internal server error");
    };
};

const DeleteProgram = async (req, res) => {
    const program = req.program;

    try {
        if (!program) return ERR(res, 400, "Program id is required");

        if (program.image) {
            try {
                await cloudinary.uploader.destroy(program.image, {
                resource_type: 'image',
                });
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error.message);
            }
        }

        if (program.document) {
            try {
                await cloudinary.uploader.destroy(program.document, {
                resource_type: 'raw',
                });
            } catch (error) {
                console.error("Error deleting document from Cloudinary:", error.message);
            }
        }

        await Program.findByIdAndDelete(program._id);

        return SUC(res, 204, null, "Program removed successfully");
    } catch (error) {
        console.error("Error deleting program:", error);
        return ERR(res, 500, "Internal server error");
    }
};

module.exports = {
    AddProgram,
    GetPrograms,
    GetProgramById,
    UpdateProgram,
    UpdateStatus,
    DeleteProgram,
}