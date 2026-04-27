import handler from "../../api/send-email.js";

export default async function netlifyHandler(request) {
  return handler(request);
}
