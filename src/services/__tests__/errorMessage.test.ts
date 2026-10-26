import { AxiosError } from 'axios';
import { errorMessage } from '../api';

const withResponse = (status: number, data: any) =>
  new AxiosError('Request failed', AxiosError.ERR_BAD_REQUEST, undefined, null, {
    data,
    status,
    statusText: '',
    headers: {},
    config: {} as any,
  });

describe('errorMessage', () => {
  it("uses the server's message", () => {
    expect(errorMessage(withResponse(400, { message: 'Email already registered' }), 'x')).toBe(
      'Email already registered',
    );
  });

  it('names the first invalid field instead of the generic validation message', () => {
    const error = withResponse(400, {
      message: 'One or more fields are invalid',
      details: [{ field: 'Password', message: 'Password must be at least 8 characters' }],
    });
    expect(errorMessage(error, 'x')).toBe('Password must be at least 8 characters');
  });

  it('says when the server could not be reached', () => {
    expect(errorMessage(new AxiosError('Network Error', AxiosError.ERR_NETWORK), 'x')).toMatch(
      /Couldn't reach the server/,
    );
  });

  it('says when the server timed out', () => {
    expect(errorMessage(new AxiosError('timeout', AxiosError.ECONNABORTED), 'x')).toMatch(/too long/);
  });

  it('falls back when the server gave no reason', () => {
    expect(errorMessage(withResponse(500, ''), 'Registration failed')).toBe('Registration failed');
  });
});
