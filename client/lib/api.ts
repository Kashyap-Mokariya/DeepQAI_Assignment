const API_URL = "https://deepqai-assignment.onrender.com";

export async function loginUser(username: string, password: string) {
	const response = await fetch(`${API_URL}/login/`, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({username, password}),
	});
	if (!response.ok) {
		const err = await response.json();
		throw new Error(err.detail || "Login failed");
	}
	const data = await response.json();
	return data;
}

export async function signupUser(
	email: string,
	username: string,
	full_name: string,
	password: string
) {
	const response = await fetch(`${API_URL}/register/`, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({email, username, full_name, password}),
	});
	if (!response.ok) {
		const err = await response.json();
		throw new Error(err.detail || "Signup failed");
	}
	const data = await response.json();
	return data;
}

export async function logoutUser(refreshToken: string) {
	const response = await fetch(`${API_URL}/logout/`, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({refresh: refreshToken}),
	});
	if (!response.ok) {
		const err = await response.json();
		throw new Error(err.detail || "Logout failed");
	}
	return await response.json();
}
