const {
	ApiError,
	sendAccountVerificationEmail,
	processDBRequest,
} = require("../../utils");
const {
	findAllStudents,
	findStudentDetail,
	findStudentToSetStatus,
	addOrUpdateStudent,
} = require("./students-repository");
const { findUserById } = require("../../shared/repository");

const validateClassAndSection = async (className, section) => {
	if (className) {
		const query = "SELECT sections FROM classes WHERE name = $1";
		const queryParams = [className];
		const { rows } = await processDBRequest({ query, queryParams });
		if (rows.length === 0) {
			throw new ApiError(404, "Class not found");
		}

		if (section) {
			const classSections = rows[0].sections;
			if (!classSections) {
				throw new ApiError(404, "No sections found for the class");
			}
			const sectionsArray = classSections.split(",").map((s) => s.trim());
			if (!sectionsArray.includes(section)) {
				throw new ApiError(404, "Section not found in the specified class");
			}
		}
	} else if (section) {
		throw new ApiError(400, "Class is required when section is provided");
	}
};

const validateStudentUniqueFields = async ({
	userId,
	email,
	class: className,
	section,
	roll,
}) => {
	if (email) {
		let query = "SELECT id FROM users WHERE email = $1";
		const queryParams = [email];
		if (userId) {
			query += " AND id <> $2";
			queryParams.push(userId);
		}

		const { rows } = await processDBRequest({ query, queryParams });
		if (rows.length > 0 && rows[0].id !== parseInt(userId, 10)) {
			throw new ApiError(409, "Email already exists");
		}
	}

	if (typeof roll !== "undefined" && roll !== null) {
		if (!className || !section) {
			throw new ApiError(
				400,
				"Class and section are required when roll is provided",
			);
		}

		let query = `
            SELECT up.user_id
            FROM user_profiles up
            JOIN users u ON u.id = up.user_id
            WHERE up.class_name = $1
              AND up.section_name = $2
              AND up.roll = $3
              AND u.role_id = 3
        `;
		const queryParams = [className, section, roll];
		if (userId) {
			queryParams.push(userId);
			query += " AND up.user_id <> $4";
		}

		const { rows } = await processDBRequest({ query, queryParams });
		if (rows.length > 0) {
			throw new ApiError(409, "Roll already exists in this class and section");
		}
	}
};

const checkStudentId = async (id) => {
	const isStudentFound = await findUserById(id);
	if (!isStudentFound) {
		throw new ApiError(404, "Student not found");
	}
};

const getAllStudents = async (payload) => {
	const students = await findAllStudents(payload);
	if (students.length <= 0) {
		throw new ApiError(404, "Students not found");
	}

	return students;
};

const getStudentDetail = async (id) => {
	await checkStudentId(id);

	const student = await findStudentDetail(id);
	if (!student) {
		throw new ApiError(404, "Student not found");
	}

	return student;
};

const addNewStudent = async (payload) => {
	const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS =
		"Student added and verification email sent successfully.";
	const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL =
		"Student added, but failed to send verification email.";
	try {
		await validateClassAndSection(payload.class, payload.section);
		await validateStudentUniqueFields(payload);

		const result = await addOrUpdateStudent(payload);
		if (!result.status) {
			throw new ApiError(500, result.message);
		}

		try {
			await sendAccountVerificationEmail({
				userId: result.userId,
				userEmail: payload.email,
			});
			return { message: ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
		} catch (error) {
			return { message: ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL };
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Unable to add student");
	}
};

const updateStudent = async (payload) => {
	await checkStudentId(payload.userId);
	await validateClassAndSection(payload.class, payload.section);
	await validateStudentUniqueFields(payload);
	const result = await addOrUpdateStudent(payload);
	if (!result.status) {
		throw new ApiError(500, result.message);
	}

	return { message: result.message };
};

const setStudentStatus = async ({ userId, reviewerId, status }) => {
	await checkStudentId(userId);

	const affectedRow = await findStudentToSetStatus({
		userId,
		reviewerId,
		status,
	});
	if (affectedRow <= 0) {
		throw new ApiError(500, "Unable to disable student");
	}

	return { message: "Student status changed successfully" };
};

module.exports = {
	getAllStudents,
	getStudentDetail,
	addNewStudent,
	setStudentStatus,
	updateStudent,
};
