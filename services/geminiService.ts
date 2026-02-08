
import { GoogleGenAI, Type } from "@google/genai";
import { MBTIState, Situation, QuestResult, UserHistory } from "../types";

/**
 * Uses Gemini AI to generate a hyper-contextualized 1-minute micro-quest.
 */
export const generateQuest = async (
  mbti: MBTIState,
  situation: Situation,
  moodLabel: string,
  history: UserHistory[]
): Promise<QuestResult> => {
  // Always initialize a fresh GoogleGenAI instance to pick up the correct API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mbtiString = `${mbti.E ? 'E' : 'I'}${mbti.S ? 'S' : 'N'}${mbti.T ? 'T' : 'F'}${mbti.J ? 'J' : 'P'}`;
  const now = new Date();
  const hour = now.getHours();

  let timeTheme = "";
  if (hour >= 5 && hour < 11) timeTheme = "활력/확언";
  else if (hour >= 11 && hour < 18) timeTheme = "감각 환기";
  else if (hour >= 18 && hour < 22) timeTheme = "이완/성찰";
  else timeTheme = "정적/뇌 비우기";

  const prompt = `
    당신은 세계 최고의 긍정 심리학자입니다. 사용자의 MBTI(${mbtiString}), 장소(${situation}), 기분(${moodLabel})을 바탕으로 1분 마이크로 퀘스트를 설계하세요.
    
    [심리학 가이드라인]
    1. 즉각성: 지금 바로 할 수 있어야 함.
    2. 감각 자극: 시각, 청각, 촉각 등 오감 활용.
    3. 근거(Rationale): 이 행동이 왜 기분을 바꿔주는지 과학적/심리학적 근거 제시.
    4. 테마: 현재 시각에 맞춘 ${timeTheme} 성격.

    Output JSON: { title, instruction, encouragement, tag, questType, rationale }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instruction: { type: Type.STRING },
            encouragement: { type: Type.STRING },
            tag: { type: Type.STRING },
            questType: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ["title", "instruction", "encouragement", "tag", "questType", "rationale"],
        },
      },
    });

    // Directly access the .text property from GenerateContentResponse
    return { ...JSON.parse(response.text || '{}'), id: 'ai_' + Date.now() } as QuestResult;
  } catch (error) {
    console.error("AI Quest generation error:", error);
    return {
      id: 'default',
      title: "가벼운 호흡",
      instruction: "3번 크게 심호흡하세요.",
      encouragement: "좋습니다. 당신은 잘하고 있어요.",
      tag: "Refresh",
      questType: "breathing",
      rationale: "심호흡은 부교감 신경을 즉각 자극하여 평온함을 가져다줍니다."
    };
  }
};
