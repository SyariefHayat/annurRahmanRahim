const { Program, Campaign } = require("../models/index.model");
const { SUC, ERR } = require("../utils/response");
const cloudinary = require('../config/cloudinary');

const AddProgram = async (req, res) => {
  const data = req.body;
  const userId = req.user._id;
  const programImgFile = req.file;
  const programImage = programImgFile ? `${programImgFile.filename}` : null;

  try {
    if (!data) return ERR(res, 404, "Data not found");

    const newProgram = new Program({
      title: data.title,
      desc: data.desc,
      proposer: data.proposer,
      location: data.location,
      category: data.category,
      status: data.status,
      budget: data.budget,
      duration: data.duration,
      image: programImage,
      summary: data.summary,
      timeline: data.timeline,
      budgetBreakdown: data.budgetBreakdown,
      supportExpected: data.supportExpected,
    });
    await newProgram.save();

    return SUC(res, 201, newProgram, "Data created successfully")
  } catch (error) {
    console.error(error);
    return ERR(res, 500, "Program created faild");
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
  console.log(data)
  const programImgFile = req.file;
  const { programId } = req.params;

  try {
    if (!programId || !data) return ERR(res, 404, "Missing fields required");

    const program = await Program.findById(programId);
    if (!program) return ERR(res, 404, "Program not found");

    if (programImgFile) {
      if (program.image) {
        try {
          await cloudinary.uploader.destroy(program.image);
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error.message);
        }
      }
      program.image = programImgFile.filename;
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
    console.error("Error updating campaign:", error);
    return ERR(res, 500, "Internal server error");
  }
};

module.exports = {
  AddProgram,
  GetPrograms,
  GetProgramById,
  UpdateProgram,
}