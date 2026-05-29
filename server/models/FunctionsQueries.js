//1. get all studetn assigned module list with progress
const studentDashboardDataQuery = `
  SELECT 
    m.module_id,
    m.title AS module_title,
    m.description AS module_description,
    COUNT(l.lesson_id) AS total_lessons,
    COUNT(CASE WHEN lp.completed = TRUE THEN 1 END) AS completed_lessons
  FROM enrollments e
  JOIN modules m ON e.module_id = m.module_id
  LEFT JOIN lessons l ON m.module_id = l.module_id
  LEFT JOIN lesson_progress lp ON l.lesson_id = lp.lesson_id AND lp.student_id = e.student_id
  WHERE e.student_id = $1 AND m.is_active = TRUE
  GROUP BY m.module_id, m.title, m.description
  ORDER BY m.title ASC;
`;

const moduleDatabyModuleIdAndStudentIdQuery = `SELECT 
    m.module_id,
    m.title AS module_title,
    m.description AS module_description,
    COALESCE(
        json_agg(
            json_build_object(
                'lesson_id', l.lesson_id,
                'lesson_title', l.title,
                'content', l.content,
                'serial_number', l.serial_number,
                'is_completed', COALESCE(lp.completed, FALSE),
                'completed_at', lp.completed_at
            ) ORDER BY l.serial_number
        ), '[]'::json
    ) AS lessons
FROM modules m
LEFT JOIN lessons l ON m.module_id = l.module_id
LEFT JOIN lesson_progress lp 
    ON l.lesson_id = lp.lesson_id 
    AND lp.student_id = $1
WHERE m.module_id = $2
GROUP BY m.module_id, m.title;
`;

const allModulesWithAllLessonsQuery = `
SELECT 
    m.module_id,
    m.title AS module_title,
    m.description AS module_description,
    m.is_active AS module_is_active,

    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'lesson_id', l.lesson_id,
                'lesson_title', l.title,
                'content', l.content,
                'serial_number', l.serial_number
            )
            ORDER BY l.serial_number
        ) FILTER (WHERE l.lesson_id IS NOT NULL),
        '[]'
    ) AS lessons

FROM modules m

LEFT JOIN lessons l 
    ON m.module_id = l.module_id

WHERE m.created_by = $1

GROUP BY 
    m.module_id, m.title, m.description

ORDER BY m.module_id;
`;

const allsStudentLessonProgressQuery = `SELECT
    u.user_id AS id,
    u.username AS name,

    -- ✅ total assigned modules
    COUNT(DISTINCT e.module_id) AS total,

    -- ✅ completed modules
    COUNT(DISTINCT CASE 
        WHEN completed_modules.module_id IS NOT NULL 
        THEN completed_modules.module_id 
    END) AS completed

    FROM users u

    LEFT JOIN enrollments e 
        ON e.student_id = u.user_id

    -- ✅ Subquery: modules fully completed
    LEFT JOIN (
        SELECT 
            lp.student_id,
            l.module_id
        FROM lessons l
        JOIN lesson_progress lp 
            ON lp.lesson_id = l.lesson_id
        GROUP BY lp.student_id, l.module_id
        HAVING 
            COUNT(*) = COUNT(CASE WHEN lp.completed = TRUE THEN 1 END)
    ) completed_modules
        ON completed_modules.student_id = u.user_id
        AND completed_modules.module_id = e.module_id

    WHERE u.role = 'Student'

    GROUP BY u.user_id, u.username

    ORDER BY u.user_id;
`;

const getAllStudentModuleWiseAndLeessonWiseProgress = `WITH module_lesson_counts AS (
    -- Step 1: Get the exact total number of lessons per module safely
        SELECT 
            module_id,
            COUNT(lesson_id) AS total_lessons
        FROM lessons
        GROUP BY module_id
        ),
        student_module_stats AS (
            -- Step 2: Calculate progress per module for enrolled students
            SELECT 
                e.student_id,
                e.module_id,
                m.title AS module_title,
                COALESCE(mlc.total_lessons, 0) AS total_lessons,
                COUNT(DISTINCT lp.lesson_id) FILTER (WHERE lp.completed = TRUE) AS completed_lessons
            FROM enrollments e
            JOIN modules m ON e.module_id = m.module_id
            LEFT JOIN module_lesson_counts mlc ON e.module_id = mlc.module_id
            LEFT JOIN lessons l ON m.module_id = l.module_id
            LEFT JOIN lesson_progress lp ON l.lesson_id = lp.lesson_id AND lp.student_id = e.student_id
            GROUP BY e.student_id, e.module_id, m.title, mlc.total_lessons
        ),
        json_per_student AS (
            -- Step 3: Bundle module metrics into clean JSON objects per student
            SELECT 
                sms.student_id,
                jsonb_agg(
                    jsonb_build_object(
                        'module_title', sms.module_title,
                        'total_lessons', sms.total_lessons,
                        'completed_lessons', sms.completed_lessons,
                        'completion_percentage', CASE 
                            WHEN sms.total_lessons = 0 THEN 0
                            ELSE ROUND((sms.completed_lessons::NUMERIC / sms.total_lessons) * 100, 2)
                        END,
                        'is_module_completed', CASE 
                            WHEN sms.total_lessons > 0 AND sms.completed_lessons = sms.total_lessons THEN TRUE 
                            ELSE FALSE 
                        END
                    ) ORDER BY sms.module_title
                ) AS modules_progress
            FROM student_module_stats sms
            GROUP BY sms.student_id
        )
        -- Step 4: Master join ensuring ALL students appear, even with 0 enrollments
        SELECT 
            u.user_id AS id,
            u.username AS name,
            COALESCE(jps.modules_progress, '[]'::jsonb) AS modules
        FROM users u
        LEFT JOIN json_per_student jps ON u.user_id = jps.student_id
        WHERE u.role = 'Student'
        ORDER BY u.user_id;`;
module.exports = {
  studentDashboardDataQuery,
  moduleDatabyModuleIdAndStudentIdQuery,
  allModulesWithAllLessonsQuery,
  allsStudentLessonProgressQuery,
  getAllStudentModuleWiseAndLeessonWiseProgress,
};
