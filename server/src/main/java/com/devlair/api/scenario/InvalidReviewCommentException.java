package com.devlair.api.scenario;

public class InvalidReviewCommentException extends RuntimeException {

    public InvalidReviewCommentException() {
        super("Each comment must refer to a proposed line in a changed file for this task. Reload the pull request and check your comment locations.");
    }
}
