import crypto from 'crypto'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const generateCode = (length = 6): string => {
  const bytes = crypto.randomBytes(length)
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CHARS[bytes[i] % CHARS.length]
  }
  return code
}
