const { Program } = require("../models/index.model");
const { SUC, ERR } = require("../utils/response");

const AddProgram = async (req, res) => {
  const userId = req.user._id;
  const data = req.body;

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
      image: data.image,
      summary: data.summary,
      timeline: data.timeline,
      budgetBreakdown: data.budgetBreakdown,
      supportExpected: data.supportExpected,
    });
    await newProgram.save();

    return SUC(res, 200, newProgram, "Data created successfully")
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

module.exports = {
  AddProgram,
  GetPrograms,
  GetProgramById,
}