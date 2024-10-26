import { DOFunctionCallOutput } from '../DOFunctionService/DOFunction.js';
import DOFunctionService from '../DOFunctionService/DOFunctionService.js';
import {
  AuthValidateUserInput,
  AuthValidateUserOutput
} from '../DOFunctionService/functions/authValidateUser.js';
import {
  ProjectDashboardInput,
  ProjectDashboardOutput
} from '../DOFunctionService/functions/projectDashboard.js';

/**
 * A service for making calls to the backend API for personal projects. This is
 * abstracted so that the backend implementation can change over time.
 */
export default class APIService {
  /**
   * Validates the provided username and password against the database and
   * returns the user's information if successful.
   *
   * @param input
   */
  static async validateUser(
    input: AuthValidateUserInput
  ): Promise<DOFunctionCallOutput<AuthValidateUserOutput>> {
    const result = await DOFunctionService.authValidateUser.call(input);
    return result;
  }

  static setDashboardAPIUrl(url: string) {
    DOFunctionService.projectDashboard.setUrl(url);
  }

  /**
   * Calls the dashboard API and returns the result. This will fail if the
   * dashboard API URL has not been set. See {@link setDashboardAPIUrl}.
   *
   * @param input
   */
  static async callDashboardAPI(
    input: ProjectDashboardInput
  ): Promise<DOFunctionCallOutput<ProjectDashboardOutput>> {
    const result = await DOFunctionService.projectDashboard.call(input);
    return result;
  }
}
