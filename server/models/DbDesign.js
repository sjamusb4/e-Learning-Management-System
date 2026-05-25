const user = {
  userId: Number,
  username: String,
  email: String,
  password: String,
  role: String, // Student, Mentor, Admin
  createdAt: Date,
};

const module = {
  moduleId: Number,
  title: String,
  description: String,
  serialNumber: Number, // order of the module e.g., 1, 2, 3...
  createdBy: Number, // mentor userId
  isActive: Boolean,
  createdAt: Date,
};

const lesson = {
  lessonId: Number,
  moduleId: Number,
  title: String,
  content: String,
  // createdBy: Number, // mentor userId
  serialNumber: Number, // order of the lesson within the module e.g., 1, 2, 3...
};

// mentor will assign modules to students, and students will complete lessons within those modules
const enrollment = {
  enrollmentId: Number,
  studentId: Number,
  moduleId: Number,
  enrolledAt: Date,
};

const progress = {
  progressId: Number,
  studentId: Number,
  lessonId: Number,
  completed: Boolean,
  completedAt: Date,
};
