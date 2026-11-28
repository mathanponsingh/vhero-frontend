import { API_URL } from "@/constants/value"

type SendOtpResponse = { message: string };
type VerifyOtpResponse = {message: string, token: string}

const parse_values = async <T>(res: Response): Promise<T> => {
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // If there is no body just ignore the message
  }

  if (!res.ok) {
    const detail = data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
        ? detail.map((d: any) => d.msg).join(", ")
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
};

export const login = async (email: string): Promise<SendOtpResponse> => {
  const res = await fetch(`${API_URL}/api/send-otp`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return parse_values<SendOtpResponse>(res);
};

export const verify_otp = async(email:string, otp:number): Promise<VerifyOtpResponse>=>{
  const res = await fetch(`${API_URL}/api/verify-otp`,{
    method:'POST',
    credentials:'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body:JSON.stringify({email,otp})
  })
  return parse_values(res)
}