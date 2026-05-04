const { z } = require("zod");

const GetStudentsSchema = z.object({
    query: z.object({
        name: z.string().trim().optional(),
        className: z.string().trim().optional(),
        section: z.string().trim().optional(),
        roll: z.union([z.string().trim(), z.number()]).optional(),
    })
});

const StudentPayloadSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Email must be valid"),
        gender: z.string().trim().optional(),
        phone: z.string().trim().optional(),
        dob: z.string().trim().optional(),
        currentAddress: z.string().trim().optional(),
        permanentAddress: z.string().trim().optional(),
        fatherName: z.string().trim().optional(),
        fatherPhone: z.string().trim().optional(),
        motherName: z.string().trim().optional(),
        motherPhone: z.string().trim().optional(),
        guardianName: z.string().trim().optional(),
        guardianPhone: z.string().trim().optional(),
        relationOfGuardian: z.string().trim().optional(),
        systemAccess: z.boolean().optional(),
        class: z.string().trim().optional(),
        section: z.string().trim().optional(),
        admissionDate: z.string().trim().optional(),
        roll: z.union([z.string().trim(), z.number()]).optional(),
    }).strict(),
});

const GetStudentDetailSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9]+$/, "Student id must be a number"),
    })
});

const UpdateStudentSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9]+$/, "Student id must be a number"),
    }),
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Email must be valid"),
        gender: z.string().trim().optional(),
        phone: z.string().trim().optional(),
        dob: z.string().trim().optional(),
        currentAddress: z.string().trim().optional(),
        permanentAddress: z.string().trim().optional(),
        fatherName: z.string().trim().optional(),
        fatherPhone: z.string().trim().optional(),
        motherName: z.string().trim().optional(),
        motherPhone: z.string().trim().optional(),
        guardianName: z.string().trim().optional(),
        guardianPhone: z.string().trim().optional(),
        relationOfGuardian: z.string().trim().optional(),
        systemAccess: z.boolean().optional(),
        class: z.string().trim().optional(),
        section: z.string().trim().optional(),
        admissionDate: z.string().trim().optional(),
        roll: z.union([z.string().trim(), z.number()]).optional(),
    }).strict(),
});

const StudentStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9]+$/, "Student id must be a number"),
    }),
    body: z.object({
        status: z.boolean(),
    }).strict(),
});

module.exports = {
    GetStudentsSchema,
    StudentPayloadSchema,
    GetStudentDetailSchema,
    UpdateStudentSchema,
    StudentStatusSchema,
};
