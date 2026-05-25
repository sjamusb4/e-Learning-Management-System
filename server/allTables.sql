CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Student', 'Mentor', 'Admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modules (
    module_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically captures creation time
    
    -- Links module to a specific user (mentor)
    CONSTRAINT fk_mentor 
        FOREIGN KEY (created_by) 
        REFERENCES users (user_id) 
        ON DELETE CASCADE
);


CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    serial_number INTEGER NOT NULL,

    CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE,
    
    -- This allows multiple lessons per module, but blocks duplicate serial numbers inside that module
    CONSTRAINT unique_module_serial UNIQUE (module_id, serial_number)
);

CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    module_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensures a student can only be enrolled in a specific module once
    CONSTRAINT unique_student_module 
        UNIQUE (student_id, module_id),

    -- Links to users table (ensures student exists)
    CONSTRAINT fk_student 
        FOREIGN KEY (student_id) 
        REFERENCES users (user_id) 
        ON DELETE CASCADE,

    -- Links to modules table (ensures module exists)
    CONSTRAINT fk_module_enrollment 
        FOREIGN KEY (module_id) 
        REFERENCES modules (module_id) 
        ON DELETE CASCADE
);


CREATE TABLE lesson_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,

    -- Prevents duplicate rows for the same student and lesson
    CONSTRAINT unique_student_lesson_progress 
        UNIQUE (student_id, lesson_id),

    -- Links to users table
    CONSTRAINT fk_student_progress 
        FOREIGN KEY (student_id) 
        REFERENCES users (user_id) 
        ON DELETE CASCADE,

    -- Links to lessons table
    CONSTRAINT fk_lesson_progress 
        FOREIGN KEY (lesson_id) 
        REFERENCES lessons (lesson_id) 
        ON DELETE CASCADE
);
