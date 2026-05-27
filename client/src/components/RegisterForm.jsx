export default function RegisterForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  userRole,
  setuserRole,
  handleSubmit,
  loading,
}) {
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-md">
        <div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full mt-1 rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">User Role</label>
          <select
            value={userRole}
            onChange={(e) => setuserRole(e.target.value)}
            className="w-full mt-1 rounded-md border px-3 py-2"
          >
            <option value="Student">Student</option>
            <option value="Mentor">Mentor</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center items-center gap-2 px-3 py-2 rounded-md text-white 
          ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"}`}
      >
        {loading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                className="opacity-75"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Registering...
          </>
        ) : (
          "Register"
        )}
      </button>
      <p class="text-sm text-center font-light text-gray-900 dark:text-gray-900">
        Already have an account?{" "}
        <a
          href="/login"
          class="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Login here
        </a>
      </p>
    </form>
  );
}
