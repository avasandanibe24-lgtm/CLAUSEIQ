package com.clauseiq.service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import org.springframework.stereotype.Service;

@Service
public class AIAnalysisService {

    private final OpenAIClient client;

    public AIAnalysisService() {
        client = OpenAIOkHttpClient.fromEnv();
    }

    public String analyzeClause(
            String clauseText,
            String clauseType,
            String ruleBasedRisk
    ) {

        String prompt = """
                You are ClauseIQ, an AI-powered contract analysis assistant.

                Analyze the following contract clause.

                Clause type:
                %s

                Current rule-based risk:
                %s

                Clause text:
                %s

                Provide a clear analysis suitable for a contract review
                application and university project demonstration.

                Return exactly these sections:

                SUMMARY:
                Explain the clause in simple language.

                RISK:
                Explain the important legal or business risk.

                OBLIGATIONS:
                Explain what the parties are required to do.

                KEY_TERMS:
                Mention important conditions, deadlines, limits, or permissions.

                SUGGESTED_ACTION:
                Give a practical action a contract reviewer could consider.

                Do not invent facts that are not present in the clause.
                Do not provide definitive legal advice.
                """.formatted(
                clauseType,
                ruleBasedRisk,
                clauseText
        );

        ResponseCreateParams params =
                ResponseCreateParams.builder()
                        .input(prompt)
                        .model(ChatModel.GPT_5_2)
                        .build();

        Response response =
                client.responses().create(params);

        return response.output()
                .stream()
                .flatMap(item ->
                        item.message().stream()
                )
                .flatMap(message ->
                        message.content().stream()
                )
                .flatMap(content ->
                        content.outputText().stream()
                )
                .map(outputText ->
                        outputText.text()
                )
                .findFirst()
                .orElse(
                        "AI analysis could not be generated."
                );
    }
}