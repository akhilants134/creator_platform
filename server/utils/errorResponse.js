export const withErrorDetails = (payload, error) => {
  if (process.env.NODE_ENV !== "production" && error?.message) {
    return { ...payload, error: error.message };
  }

  return payload;
};
