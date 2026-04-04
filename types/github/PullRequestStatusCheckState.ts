export enum GithubStatusCheckState {
    EXPECTED = "EXPECTED",      // The check or job has not been started yet.
    ERROR = "ERROR",            // The check or job encountered an error.
    FAILURE = "FAILURE",        // The check or job failed.
    PENDING = "PENDING",        // The check or job is pending.
    SUCCESS = "SUCCESS",        // The check or job was successful.
}