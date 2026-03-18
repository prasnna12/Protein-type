/**
 * Centralized API utility for retries and error handling.
 */

export const retryAsync = async (fn, retries = 3, delayMs = 1500) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("NETWORK_TIMEOUT")), 20000); // 20s timeout
      });

      // Race the actual function against the timeout
      return await Promise.race([fn(), timeoutPromise]);
    } catch (err) {
      const isLastRetry = i === retries - 1;
      const isTimeout = err.message === "NETWORK_TIMEOUT";
      
      console.warn(`API Attempt ${i + 1} failed:`, isTimeout ? "Timeout" : err.message);
      
      if (isLastRetry) throw err;
      
      // Wait before next retry (exponential-ish backoff or longer wait for timeouts)
      const waitTime = isTimeout ? delayMs * 2 : delayMs * (i + 1);
      await new Promise(res => setTimeout(res, waitTime));
    }
  }
};

export const fallbackResponse = (serviceName) => {
  return {
    error: true,
    message: `Server busy or connection issue in ${serviceName}. Please try again in a moment.`,
    isFallback: true
  };
};
