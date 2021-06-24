import config from "@/config";
import { load } from "recaptcha-v3"

export const GenenateRecaptcha = async (action: string) => {
  const recaptcha = await load(config.recaptcha.sitekey)
  const token = await recaptcha.execute(action)

  return token
};
