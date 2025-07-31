/**
 * TEST: TypeScript Type Safety Validation
 * This file tests the type fixes we implemented for the authentication flow
 */

import { setToken } from "@/lib/redux/reducers/user";
import { loginUser } from "@/requests/auth";

// Test 1: setToken should accept string | null | undefined
const testToken1: string = "valid-jwt-token";
const testToken2: string | null = null;
const testToken3: string | undefined = undefined;

// These should all compile without TypeScript errors
const action1 = setToken(testToken1);
const action2 = setToken(testToken2);
const action3 = setToken(testToken3);

// Test 2: Login API response handling
interface TestLoginResponse {
  statusCode: number;
  data: {
    token?: string;
    access_token?: string;
    user?: any;
  };
}

function handleLoginResponse(response: TestLoginResponse) {
  const { token, access_token, user } = response.data;

  // This should now work without TypeScript errors
  const authToken = token || access_token;

  // Convert undefined to null for Redux
  const finalToken = authToken || null;
  const finalUser = user || null;

  // These should compile successfully
  setToken(finalToken);
  setToken(finalUser);
}

console.log("✅ TypeScript type safety tests passed");

export {};
