export function getDomainName(email: string) {
  const match = email.match(/@([^@]+)\.com$/);
  return match ? match[1] : null;
}
