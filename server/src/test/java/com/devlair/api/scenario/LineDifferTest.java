package com.devlair.api.scenario;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LineDifferTest {

    @Test
    void marksInsertedLinesAsAddedWithProposedLineNumbers() {
        String original = """
                first
                third
                """;
        String proposed = """
                first
                second
                third
                """;

        assertThat(LineDiffer.diff(original, proposed))
                .containsExactly(
                        new LineDiffer.Line(LineDiffer.Type.UNCHANGED, 1, 1, "first"),
                        new LineDiffer.Line(LineDiffer.Type.ADDED, null, 2, "second"),
                        new LineDiffer.Line(LineDiffer.Type.UNCHANGED, 2, 3, "third"),
                        new LineDiffer.Line(LineDiffer.Type.UNCHANGED, 3, 4, ""));
    }
}
