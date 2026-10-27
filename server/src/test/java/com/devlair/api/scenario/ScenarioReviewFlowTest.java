package com.devlair.api.scenario;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
@Transactional
class ScenarioReviewFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ScenarioRepository scenarioRepository;

    @Autowired
    private ScenarioDocumentRepository documentRepository;

    @Autowired
    private ScenarioFileRepository fileRepository;

    @Autowired
    private ReviewFindingRepository findingRepository;

    @Autowired
    private ReviewSubmissionRepository submissionRepository;

    @Autowired
    private LearnerScenarioSkillEvidenceRepository evidenceRepository;

    private MockHttpSession session;

    @BeforeEach
    void registerAndSignIn() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"dev@example.com","password":"password1"}
                                """))
                .andExpect(status().isCreated());

        MvcResult login = mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"dev@example.com","password":"password1"}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        session = (MockHttpSession) login.getRequest().getSession();
    }

    @Test
    void servesScenarioWithoutFindingsThenEvaluatesSubmittedComments() throws Exception {
        Scenario scenario = scenarioRepository.save(new Scenario("order-details-access", "PR #184", "Review the order details change."));
        documentRepository.save(new ScenarioDocument(scenario.getId(), "TICKET", "SID-184", "Add order details."));
        fileRepository.save(new ScenarioFile(scenario.getId(), "src/OrderService.java", "class OrderService {\n}\n", """
                class OrderService {
                    Order get(UUID id) {
                        return repo.findById(id);
                    }
                }
                """));
        findingRepository.save(new ReviewFinding(
                scenario.getId(),
                "src/OrderService.java",
                2,
                4,
                "HIGH",
                "Lookup is not scoped to the customer",
                "Pass the authenticated customer id.",
                "repository.findByIdAndCustomerId(orderId, customerId);"));

        mockMvc.perform(get("/api/scenarios").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("order-details-access"));

        mockMvc.perform(get("/api/scenarios/order-details-access").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documents[0].type").value("TICKET"))
                .andExpect(jsonPath("$.files[0].diff[1].type").value("ADDED"))
                .andExpect(jsonPath("$.found").doesNotExist());

        mockMvc.perform(post("/api/auth/onboarding/complete").session(session).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.onboardingCompleted").value(true));

        mockMvc.perform(post("/api/scenarios/order-details-access/reviews")
                        .session(session)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"comments":[{"filePath":"src/OrderService.java","lineNumber":3,"body":"This ignores the customer."}]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.found[0].title").value("Lookup is not scoped to the customer"))
                .andExpect(jsonPath("$.missed").isEmpty());

        mockMvc.perform(get("/api/workspace").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tasks[0].status").value("COMPLETED"))
                .andExpect(jsonPath("$.tasks[0].attempts").value(1))
                .andExpect(jsonPath("$.skills[0].skillKey").value("review-judgment"))
                .andExpect(jsonPath("$.skills[0].bestScore").value(100));
    }

    @Test
    void rejectsAnonymousScenarioAccess() throws Exception {
        mockMvc.perform(get("/api/scenarios")).andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{\"comments\":[{\"filePath\":\"src/Missing.java\",\"lineNumber\":1,\"body\":\"Investigate this.\"}]}",
            "{\"comments\":[{\"filePath\":\"src/Context.java\",\"lineNumber\":1,\"body\":\"Investigate this.\"}]}",
            "{\"comments\":[{\"filePath\":\"src/OtherTask.java\",\"lineNumber\":1,\"body\":\"Investigate this.\"}]}",
            "{\"comments\":[{\"filePath\":\"src/Removed.java\",\"lineNumber\":1,\"body\":\"Investigate this.\"}]}",
            "{\"comments\":[{\"filePath\":\"src/OrderService.java\",\"lineNumber\":5,\"body\":\"Investigate this.\"}]}",
            "{\"comments\":[{\"filePath\":\"src/OrderService.java\",\"lineNumber\":1,\"body\":\"Valid location.\"},{\"filePath\":\"src/Missing.java\",\"lineNumber\":1,\"body\":\"Invalid location.\"}]}"
    })
    void rejectsInvalidTargetsWithoutSavingAnAttemptOrEvidence(String request) throws Exception {
        seedCommentValidationScenario();

        mockMvc.perform(post("/api/scenarios/comment-validation/reviews")
                        .session(session).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Each comment must refer to a proposed line in a changed file for this task. Reload the pull request and check your comment locations."));

        assertThat(submissionRepository.count()).isZero();
        assertThat(evidenceRepository.count()).isZero();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{}", "{\"comments\":null}", "{\"comments\":[]}", "{\"comments\":[null]}",
            "{\"comments\":[{\"filePath\":\"src/OrderService.java\",\"lineNumber\":0,\"body\":\"Invalid line.\"}]}",
            "{\"comments\":[{\"filePath\":\"src/OrderService.java\",\"lineNumber\":1,\"body\":\"   \"}]}"
    })
    void rejectsMalformedReviewsWithoutRecordingCompletion(String request) throws Exception {
        seedCommentValidationScenario();

        mockMvc.perform(post("/api/scenarios/comment-validation/reviews")
                        .session(session).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isBadRequest());

        assertThat(submissionRepository.count()).isZero();
        assertThat(evidenceRepository.count()).isZero();
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3, 4})
    void acceptsEveryProposedLineShownByTheDiffIncludingBlankLines(int lineNumber) throws Exception {
        seedCommentValidationScenario();

        mockMvc.perform(post("/api/scenarios/comment-validation/reviews")
                        .session(session).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"comments":[{"filePath":"src/OrderService.java","lineNumber":%d,"body":"Please check this behavior."}]}
                                """.formatted(lineNumber)))
                .andExpect(status().isOk());

        assertThat(submissionRepository.findAll()).singleElement().satisfies(submission ->
                assertThat(submission.getComments()).extracting(ReviewComment::getLineNumber).containsExactly(lineNumber));
    }

    private void seedCommentValidationScenario() {
        Scenario scenario = scenarioRepository.save(new Scenario("comment-validation", "PR validation", "Review comment locations."));
        fileRepository.save(new ScenarioFile(scenario.getId(), "src/OrderService.java", "class OrderService {}", "class OrderService {\n\n}\n"));
        fileRepository.save(new ScenarioFile(scenario.getId(), "src/Removed.java", "class Removed {}", ""));

        ScenarioFile context = new ScenarioFile(scenario.getId(), "src/Context.java", "class Context {}", "class Context {}");
        ReflectionTestUtils.setField(context, "fileRole", "CONTEXT");
        fileRepository.save(context);

        Scenario other = scenarioRepository.save(new Scenario("another-task", "Another PR", "Separate task."));
        fileRepository.save(new ScenarioFile(other.getId(), "src/OtherTask.java", "", "class OtherTask {}"));
        findingRepository.save(new ReviewFinding(scenario.getId(), "src/OrderService.java", 1, 3,
                "HIGH", "Prepared finding", "An authored explanation.", "class OrderService {}"));
    }
}
