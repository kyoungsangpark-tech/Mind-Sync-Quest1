
import { GoogleGenAI, Type } from "@google/genai";
import { MBTIState, Situation, QuestResult, UserHistory } from "../types";

export const generateQuest = async (
  mbti: MBTIState,
  situation: Situation,
  moodLabel: string,
  history: UserHistory[]
): Promise<QuestResult> => {
  // 가이드라인 준수: 반드시 new GoogleGenAI({ apiKey: process.env.API_KEY }) 사용
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mbtiString = `${mbti.E ? 'E' : 'I'}${mbti.S ? 'S' : 'N'}${mbti.T ? 'T' : 'F'}${mbti.J ? 'J' : 'P'}`;
  const now = new Date();
  const hour = now.getHours();

  let timeTheme = "";
  if (hour >= 5 && hour < 11) timeTheme = "활력과 확언";
  else if (hour >= 11 && hour < 18) timeTheme = "감각 환기와 집중력";
  else if (hour >= 18 && hour < 22) timeTheme = "이완과 하루 성찰";
  else timeTheme = "정적 휴식과 마인드풀니스";

  const prompt = `
    사용자 프로필:
    - MBTI: ${mbtiString}
    - 현재 장소: ${situation}
    - 현재 기분: ${moodLabel}
    - 현재 시간 테마: ${timeTheme}

    요구사항:
    1. 1분 이내에 즉시 수행 가능한 마이크로 퀘스트를 설계하세요.
    2. 사용자의 MBTI 특성을 적극 반영하세요 (예: I형은 내적 성찰, E형은 가벼운 행동 유도).
    3. 별도의 도구 없이 ${situation}에서 즉시 실행 가능한 동작이어야 합니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // 텍스트 기반 태스크에 가장 권장되는 모델
      // 가이드라인에 따라 단순 텍스트 프롬프트 사용
      contents: prompt,
      config: {
        systemInstruction: "당신은 세계 최고의 긍정 심리학자이자 MBTI 전문가입니다. 사용자의 상황에 맞는 '1분 마인드 처방전'을 JSON 형태로 제공합니다.",
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

    // 가이드라인: .text() 메서드가 아닌 .text 프로퍼티 사용
    const resultText = response.text;
    if (!resultText) throw new Error("EMPTY_AI_RESPONSE");

    return { 
      ...JSON.parse(resultText), 
      id: 'ai_' + Date.now(),
      isAiGenerated: true 
    } as QuestResult;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    // 폴백 퀘스트 (사용자 경험 보호)
    return {
      id: 'fallback_' + Date.now(),
      title: "마음 한 조각 숨쉬기",
      instruction: "3초간 숨을 깊게 들이마시고, 5초간 천천히 내뱉으며 어깨의 긴장을 풀어보세요.",
      encouragement: "잠시의 호흡만으로도 당신의 뇌는 휴식을 얻습니다.",
      tag: "Relax",
      questType: "breathing",
      rationale: "의도적인 긴 호흡은 부교감 신경을 즉각적으로 활성화하여 스트레스를 낮춥니다.",
      isAiGenerated: false
    };
  }
};
