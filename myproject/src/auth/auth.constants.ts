const configuredSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'production' && !configuredSecret) {
	throw new Error('JWT_SECRET must be configured in production');
}

export const JWT_SECRET = configuredSecret || 'development-only-change-me';