package com.devlair.api.scenario;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
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
                "Pass the authenticated customer id."));

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
    }

    @Test
    void rejectsAnonymousScenarioAccess() throws Exception {
        mockMvc.perform(get("/api/scenarios")).andExpect(status().isUnauthorized());
    }
}
