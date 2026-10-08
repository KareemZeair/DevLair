package com.devlair.api.scenario;

import java.util.ArrayList;
import java.util.List;

/**
 * Compares original and proposed file text line by line using longest common
 * subsequence. The result is a unified-style list the review UI can render
 * without a third-party diff library.
 */
final class LineDiffer {

    enum Type {
        UNCHANGED,
        ADDED,
        REMOVED
    }

    record Line(Type type, Integer originalLineNumber, Integer proposedLineNumber, String text) {
    }

    private LineDiffer() {
    }

    static List<Line> diff(String original, String proposed) {
        String[] originalLines = splitLines(original);
        String[] proposedLines = splitLines(proposed);
        int originalCount = originalLines.length;
        int proposedCount = proposedLines.length;
        int[][] longestCommon = new int[originalCount + 1][proposedCount + 1];

        for (int originalIndex = originalCount - 1; originalIndex >= 0; originalIndex--) {
            for (int proposedIndex = proposedCount - 1; proposedIndex >= 0; proposedIndex--) {
                if (originalLines[originalIndex].equals(proposedLines[proposedIndex])) {
                    longestCommon[originalIndex][proposedIndex] = longestCommon[originalIndex + 1][proposedIndex + 1] + 1;
                } else {
                    longestCommon[originalIndex][proposedIndex] = Math.max(
                            longestCommon[originalIndex + 1][proposedIndex],
                            longestCommon[originalIndex][proposedIndex + 1]);
                }
            }
        }

        List<Line> lines = new ArrayList<>();
        int originalIndex = 0;
        int proposedIndex = 0;
        while (originalIndex < originalCount && proposedIndex < proposedCount) {
            if (originalLines[originalIndex].equals(proposedLines[proposedIndex])) {
                lines.add(new Line(Type.UNCHANGED, originalIndex + 1, proposedIndex + 1, originalLines[originalIndex]));
                originalIndex++;
                proposedIndex++;
            } else if (longestCommon[originalIndex + 1][proposedIndex] >= longestCommon[originalIndex][proposedIndex + 1]) {
                lines.add(new Line(Type.REMOVED, originalIndex + 1, null, originalLines[originalIndex]));
                originalIndex++;
            } else {
                lines.add(new Line(Type.ADDED, null, proposedIndex + 1, proposedLines[proposedIndex]));
                proposedIndex++;
            }
        }
        while (originalIndex < originalCount) {
            lines.add(new Line(Type.REMOVED, originalIndex + 1, null, originalLines[originalIndex]));
            originalIndex++;
        }
        while (proposedIndex < proposedCount) {
            lines.add(new Line(Type.ADDED, null, proposedIndex + 1, proposedLines[proposedIndex]));
            proposedIndex++;
        }
        return lines;
    }

    private static String[] splitLines(String content) {
        if (content.isEmpty()) {
            return new String[0];
        }
        return content.split("\n", -1);
    }
}
