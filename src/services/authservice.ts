export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json(); // { success, token }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Something went wrong" };
  }
}
