import axios from "axios";
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
	baseURL: "/api/",
	timeout: 5000,
});

export function isTokenExpired(token: string): boolean {
	if (!token) return true;
	try {
		const decoded = jwtDecode<{ exp: number }>(token);
		const now = Date.now() / 1000;

		return decoded.exp < now;
	} catch {
		return true;
	}
}

export const signIn = async (email: string, password: string): Promise<string> => {
	try {
		const response = await instance.post("sign-in", { email, password });
		const token = response.data.token;
		if (token) {
			return token;
		} else {
			throw new Error("No token in response");
		}
	} catch (error) {
		console.error("Error signing in:", error);
		throw error;
	}
};

export const signUp = async (name: string, email: string, password: string): Promise<number> => {
	try {
		const response = await instance.post("sign-up", { name, email, password });
		const token = response.data.token;
		console.log("Sign-up response:", response.data);
		return response.status;
	} catch (error) {
		console.error("Error signing up:", error);
		throw error;
	}
};

export const signOut = async (): Promise<void> => {
	try {
		await instance.post("sign-out");
	} catch (error) {
		console.error("Error signing out:", error);
		throw error;
	}
};
