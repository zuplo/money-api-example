import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { getUserInfo } from "../utils/user-info";
import { ErrorResponse } from "../types"

/**
 * This policy retrieves the user's profile from the authentication provider
 * then queries the remote (mock) database/api for the user's org. The sets
 * the orgId as a property on the user in order to use on later policies/handlers
 */
export default async function (request: ZuploRequest, context: ZuploContext) {
  // Get the current user
  const user = await getUserInfo(request, context);

  context.log.debug(user);

  if (user instanceof ErrorResponse) {
    return user;
  }

  context.custom.email = user.email;

  return request;
}