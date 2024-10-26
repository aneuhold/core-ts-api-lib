import { BSON } from 'bson';
import {
  DOFunctionCallOutput,
  DOFunctionInput,
  DOFunctionOutput,
  DOFunctionRawInput,
  DOFunctionRawOutput
} from './DOFunction.js';
import AuthCheckPassword from './functions/authCheckPassword.js';
import AuthValidateUser from './functions/authValidateUser.js';
import ProjectDashboard from './functions/projectDashboard.js';

/**
 * A service to provide some utility related to Digital Ocean functions.
 */
export default class DOFunctionService {
  static authCheckPassword: AuthCheckPassword = AuthCheckPassword.getFunction();

  static authValidateUser: AuthValidateUser = AuthValidateUser.getFunction();

  static projectDashboard: ProjectDashboard = ProjectDashboard.getFunction();

  /**
   * A generic method to handle any API request on the backend. This has
   * no use on the frontend.
   *
   * This will take care of returning the error if the handler throws.
   * Ideally the handler should not throw though unless something really
   * unexpected happened.
   *
   * @param rawInput
   * @param handler
   */
  static async handleApiRequest<
    TInput extends DOFunctionInput,
    TOutput extends DOFunctionOutput
  >(
    rawInput: DOFunctionRawInput,
    handler: (input: TInput) => Promise<DOFunctionCallOutput<TOutput>>
  ): Promise<DOFunctionRawOutput> {
    const input: TInput = this.deserializeInput(rawInput);
    const rawOutput: DOFunctionRawOutput = {
      body: '',
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    };
    // Default output if something goes wrong
    const defaultOutput: DOFunctionCallOutput<TOutput> = {
      success: false,
      errors: [],
      data: {} as TOutput
    };
    try {
      const output = await handler(input);
      rawOutput.body = this.serializeOutput(output);
    } catch (e) {
      const error = e as Error;
      defaultOutput.errors.push(error.message);
      rawOutput.body = this.serializeOutput(defaultOutput);
    }
    return rawOutput;
  }

  private static deserializeInput<TInput extends DOFunctionInput>(
    rawInput: DOFunctionRawInput
  ): TInput {
    const binaryString = atob(rawInput.http.body);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return BSON.deserialize(bytes) as TInput;
  }

  private static serializeOutput<TOutput extends DOFunctionOutput>(
    output: DOFunctionCallOutput<TOutput>
  ): string {
    const uInt8Array = BSON.serialize(output);
    return Buffer.from(uInt8Array).toString('base64');
  }
}
