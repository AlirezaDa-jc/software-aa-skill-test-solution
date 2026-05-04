const express = require("express");
const router = express.Router();
const { validateRequest } = require("../../utils");
const studentController = require("./students-controller");
const {
    GetStudentsSchema,
    StudentPayloadSchema,
    GetStudentDetailSchema,
    UpdateStudentSchema,
    StudentStatusSchema,
} = require("./students-schema");

router.get("", validateRequest(GetStudentsSchema), studentController.handleGetAllStudents);
router.post("", validateRequest(StudentPayloadSchema), studentController.handleAddStudent);
router.get("/:id", validateRequest(GetStudentDetailSchema), studentController.handleGetStudentDetail);
router.post("/:id/status", validateRequest(StudentStatusSchema), studentController.handleStudentStatus);
router.put("/:id", validateRequest(UpdateStudentSchema), studentController.handleUpdateStudent);

module.exports = { studentsRoutes: router };
