import { ApiKey, User } from '@aneuhold/core-ts-db-lib';
import DOFunction, {
  DOFunctionInput,
  DOFunctionOutput
} from '../DOFunction.js';
import { DashboardConfig } from '../../../types/DashboardConfig.js';

export interface AuthValidateUserInput extends DOFunctionInput {
  userName: string;
  password: string;
}

export interface AuthValidateUserOutput extends DOFunctionOutput {
  userInfo?: {
    user: User;
    apiKey: ApiKey;
  };
  /**
   * Basic configuration for the projects that the user has access to.
   */
  config?: {
    dashboard?: DashboardConfig;
  };
}

export default class AuthValidateUser extends DOFunction<
  AuthValidateUserInput,
  AuthValidateUserOutput
> {
  private static instance: AuthValidateUser | undefined;

  private constructor() {
    super();
    this.url =
      'https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-66dd3ef6-c21d-46dc-b7ae-caf2ac8041ec/auth/validateUser';
  }

  static getFunction(): AuthValidateUser {
    if (!AuthValidateUser.instance) {
      AuthValidateUser.instance = new AuthValidateUser();
    }
    return AuthValidateUser.instance;
  }
}
